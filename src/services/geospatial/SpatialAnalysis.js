// core geospatial analysis service for identifying hotspots, optimizing routes, and finding eco-friendly locations
const turf = require('@turf/turf');
const { CarbonEntry } = require('../../models/mongodb');
const { EcoHub } = require('../../models/mongodb');

class SpatialAnalysisService {
  constructor() {
    this.clusterRadius = 1; // km for DBSCAN
    this.minPoints = 3;
  }

  // Identify emission hotspots using DBSCAN clustering
  async identifyHotspots(userId, timeRange = 90) {
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
    
    const entries = await CarbonEntry.find({
      userId,
      date: { $gte: startDate },
      'geometry.type': { $in: ['Point', 'LineString'] },
      'emissions.totalCo2e': { $gt: 0 }
    }).lean();

    if (entries.length < this.minPoints) return [];

    // Convert entries to points with emission weights
    const points = entries.map(entry => {
      let coords;
      if (entry.geometry.type === 'Point') {
        coords = entry.geometry.coordinates;
      } else {
        // Use centroid for LineString
        const line = turf.lineString(entry.geometry.coordinates);
        const centroid = turf.centroid(line);
        coords = centroid.geometry.coordinates;
      }
      
      return turf.point(coords, {
        emissions: entry.emissions.totalCo2e,
        entryId: entry._id,
        category: entry.category,
        date: entry.date
      });
    });

    // Perform DBSCAN clustering
    const collection = turf.featureCollection(points);
    const clustered = turf.clustersDbscan(collection, this.clusterRadius, {
      minPoints: this.minPoints,
      units: 'kilometers'
    });

    // Analyze clusters
    const clusters = {};
    clustered.features.forEach(feature => {
      const clusterId = feature.properties.cluster;
      if (clusterId !== undefined) {
        if (!clusters[clusterId]) clusters[clusterId] = [];
        clusters[clusterId].push(feature);
      }
    });

    return Object.keys(clusters).map(id => {
      const clusterPoints = clusters[id];
      const center = turf.center(turf.featureCollection(clusterPoints));
      const totalEmissions = clusterPoints.reduce((sum, p) => sum + p.properties.emissions, 0);
      const avgEmissions = totalEmissions / clusterPoints.length;
      
      // Determine primary category
      const categories = {};
      clusterPoints.forEach(p => {
        const cat = p.properties.category;
        categories[cat] = (categories[cat] || 0) + 1;
      });
      const primaryCategory = Object.keys(categories).sort((a, b) => categories[b] - categories[a])[0];

      return {
        id: `hotspot_${userId}_${id}`,
        center: center.geometry.coordinates,
        radius: this.clusterRadius,
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        visitCount: clusterPoints.length,
        averageEmissions: Math.round(avgEmissions * 100) / 100,
        primaryCategory,
        confidence: Math.min(100, clusterPoints.length * 10),
        recommendations: this.generateHotspotRecommendations(primaryCategory, avgEmissions),
        timeSpan: {
          first: new Date(Math.min(...clusterPoints.map(p => new Date(p.properties.date)))),
          last: new Date(Math.max(...clusterPoints.map(p => new Date(p.properties.date))))
        }
      };
    });
  }

  // Generate contextual recommendations for hotspots
  generateHotspotRecommendations(category, avgEmissions) {
    const recommendations = [];
    
    if (category === 'transportation') {
      if (avgEmissions > 10) {
        recommendations.push({
          type: 'mode_shift',
          priority: 'high',
          action: 'Consider public transit or carpooling for this route',
          potentialSavings: avgEmissions * 0.6
        });
      }
      recommendations.push({
        type: 'route_optimization',
        priority: 'medium',
        action: 'Check for lower-traffic alternatives',
        potentialSavings: avgEmissions * 0.15
      });
    } else if (category === 'energy') {
      recommendations.push({
        type: 'efficiency',
        priority: 'high',
        action: 'Audit energy usage at this location',
        potentialSavings: avgEmissions * 0.25
      });
    }
    
    return recommendations;
  }

  // Find optimal locations for renewable projects
  async analyzeRenewablePotential(bounds, projectType) {
    // This would integrate with solar irradiance APIs, wind maps, etc.
    const analysis = {
      solar: {
        criteria: ['roof_area', 'orientation', 'shading', 'grid_proximity'],
        dataSources: ['satellite_imagery', 'lidar', 'utility_data']
      },
      wind: {
        criteria: ['wind_speed', 'terrain', 'grid_proximity', 'zoning'],
        dataSources: ['weather_stations', 'topographic_maps']
      },
      reforestation: {
        criteria: ['soil_quality', 'water_availability', 'land_use', 'biodiversity'],
        dataSources: ['soil_surveys', 'hydrological_maps', 'land_registry']
      }
    };
    
    return analysis[projectType] || analysis.solar;
  }

  // Find nearby eco-friendly services
  async findNearbyServices(lat, lng, radius = 5000, types = []) {
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius
        }
      },
      verified: true
    };
    
    if (types.length > 0) {
      query.type = { $in: types };
    }
    
    const hubs = await EcoHub.find(query).limit(20).lean();
    
    // Calculate distances and travel times
    const userPoint = turf.point([lng, lat]);
    
    return hubs.map(hub => {
      const hubPoint = turf.point(hub.location.coordinates);
      const distance = turf.distance(userPoint, hubPoint, { units: 'meters' });
      
      // Estimate carbon to reach this location (assume car for now)
      const travelEmissions = (distance / 1000) * 0.21; // kg CO2
      
      return {
        ...hub,
        distance: Math.round(distance),
        travelEmissions: Math.round(travelEmissions * 100) / 100,
        walkable: distance < 2000,
        cyclable: distance < 5000
      };
    }).sort((a, b) => a.distance - b.distance);
  }

  // Analyze commute patterns for optimization
  async analyzeCommutePatterns(userId, days = 30) {
    const entries = await CarbonEntry.find({
      userId,
      category: 'transportation',
      date: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
      'geometry.type': 'LineString'
    }).lean();

    if (entries.length < 5) return null;

    // Extract start and end points
    const routes = entries.map(entry => ({
      from: entry.geometry.coordinates[0],
      to: entry.geometry.coordinates[entry.geometry.coordinates.length - 1],
      emissions: entry.emissions.totalCo2e,
      time: entry.date
    }));

    // Cluster frequent destinations
    const destinations = routes.map(r => turf.point(r.to));
    const destCollection = turf.featureCollection(destinations);
    const clustered = turf.clustersDbscan(destCollection, 0.5, { minPoints: 3 });

    const frequentDestinations = [];
    const clusters = {};
    
    clustered.features.forEach((f, idx) => {
      const cluster = f.properties.cluster;
      if (cluster !== undefined) {
        if (!clusters[cluster]) clusters[cluster] = [];
        clusters[cluster].push(routes[idx]);
      }
    });

    Object.keys(clusters).forEach(key => {
      const clusterRoutes = clusters[key];
      const center = turf.center(turf.featureCollection(clusterRoutes.map(r => turf.point(r.to))));
      
      frequentDestinations.push({
        location: center.geometry.coordinates,
        visitCount: clusterRoutes.length,
        avgEmissions: clusterRoutes.reduce((sum, r) => sum + r.emissions, 0) / clusterRoutes.length,
        alternatives: this.suggestAlternatives(center.geometry.coordinates)
      });
    });

    return {
      totalCommutes: entries.length,
      avgEmissionsPerCommute: entries.reduce((sum, e) => sum + e.emissions.totalCo2e, 0) / entries.length,
      frequentDestinations: frequentDestinations.sort((a, b) => b.visitCount - a.visitCount),
      optimizationPotential: this.calculateOptimizationPotential(entries)
    };
  }

  suggestAlternatives(destination) {
    // Would integrate with transit APIs
    return [
      { mode: 'public_transit', savings: '30-50%' },
      { mode: 'cycling', savings: '100%', condition: 'if < 10km' },
      { mode: 'carpool', savings: '50-75%' }
    ];
  }

  calculateOptimizationPotential(entries) {
    const currentTotal = entries.reduce((sum, e) => sum + e.emissions.totalCo2e, 0);
    // Assume 30% reduction possible with optimization
    return {
      currentAnnual: currentTotal * 12, // Extrapolate
      potentialAnnual: currentTotal * 12 * 0.7,
      savingsPotential: currentTotal * 12 * 0.3
    };
  }

  // Generate isochrones (travel time polygons)
  async generateIsochrones(center, modes = ['walking', 'cycling', 'driving']) {
    // Would integrate with OpenRouteService or similar
    const isochrones = {};
    
    for (const mode of modes) {
      const maxTime = mode === 'walking' ? 15 : mode === 'cycling' ? 30 : 60; // minutes
      const speed = mode === 'walking' ? 5 : mode === 'cycling' ? 15 : 40; // km/h
      
      // Simplified circular isochrone (real implementation would use routing API)
      const radius = (speed * maxTime) / 60; // km
      const circle = turf.circle([center.lng, center.lat], radius, {
        units: 'kilometers',
        steps: 64
      });
      
      isochrones[mode] = {
        geometry: circle.geometry,
        maxTime,
        reach: radius
      };
    }
    
    return isochrones;
  }

  // Spatial intersection analysis
  async analyzeSpatialOverlap(userGeometry, projectGeometries) {
    const userArea = turf.area(userGeometry);
    const overlaps = [];
    
    for (const project of projectGeometries) {
      const intersection = turf.intersect(userGeometry, project.geometry);
      if (intersection) {
        const overlapArea = turf.area(intersection);
        overlaps.push({
          projectId: project.id,
          overlapArea,
          overlapPercent: (overlapArea / userArea) * 100,
          geometry: intersection.geometry
        });
      }
    }
    
    return overlaps.sort((a, b) => b.overlapArea - a.overlapArea);
  }
}

module.exports = new SpatialAnalysisService();