// File: src/controllers/GeospatialController.js
import SpatialAnalysis from '../services/geospatial/SpatialAnalysis.js';
import CarbonCalculator from '../services/geospatial/CarbonCalculator.js';
import { EcoHub } from '../models/mongodb/index.js';

class GeospatialController {
  // Find nearby eco-friendly locations
  async findNearbyHubs(req, res) {
    try {
      const { lat, lng, radius = 5000, types } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude required' });
      }

      const typeArray = types ? types.split(',') : [];
      
      const hubs = await SpatialAnalysis.findNearbyServices(
        parseFloat(lat),
        parseFloat(lng),
        parseInt(radius),
        typeArray
      );

      // Add isochrone data for each hub
      const enhancedHubs = await Promise.all(
        hubs.map(async hub => {
          const isochrones = await SpatialAnalysis.generateIsochrones({
            lat: hub.location.coordinates[1],
            lng: hub.location.coordinates[0]
          });
          
          return {
            ...hub,
            accessibility: {
              walkTime: hub.walkable ? Math.round(hub.distance / 83.3) : null, // ~5km/h
              cycleTime: hub.cyclable ? Math.round(hub.distance / 250) : null, // ~15km/h
              isochrones
            }
          };
        })
      );

      res.json({
        hubs: enhancedHubs,
        query: { lat: parseFloat(lat), lng: parseFloat(lng), radius: parseInt(radius) },
        total: enhancedHubs.length
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Calculate route emissions
  async calculateRoute(req, res) {
    try {
      const { waypoints, mode = 'driving', alternatives = true } = req.body;

      if (!waypoints || waypoints.length < 2) {
        return res.status(400).json({ error: 'At least 2 waypoints required' });
      }

      // Calculate primary route
      const coordinates = waypoints.map(w => [w.lng, w.lat]);
      const distance = CarbonCalculator.calculatePathDistance(coordinates);
      
      const emissions = await CarbonCalculator.calculateTransportEmissions({
        mode,
        distance,
        passengers: 1
      }, req.user.location);

      const result = {
        route: {
          waypoints,
          distance: Math.round(distance * 100) / 100,
          estimatedDuration: this.estimateDuration(distance, mode),
          emissions
        }
      };

      // Calculate alternatives if requested
      if (alternatives) {
        result.alternatives = [];
        
        const alternativeModes = ['cycling', 'transit', 'walking'].filter(m => m !== mode);
        
        for (const altMode of alternativeModes) {
          if (distance < this.getMaxDistanceForMode(altMode)) {
            const altEmissions = await CarbonCalculator.calculateTransportEmissions({
              mode: altMode,
              distance,
              passengers: 1
            }, req.user.location);
            
            result.alternatives.push({
              mode: altMode,
              distance,
              estimatedDuration: this.estimateDuration(distance, altMode),
              emissions: altEmissions,
              savings: {
                co2: emissions.totalCo2e - altEmissions.totalCo2e,
                percent: ((emissions.totalCo2e - altEmissions.totalCo2e) / emissions.totalCo2e * 100).toFixed(1)
              }
            });
          }
        }

        // Sort by lowest emissions
        result.alternatives.sort((a, b) => a.emissions.totalCo2e - b.emissions.totalCo2e);
      }

      res.json(result);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get spatial insights for user
  async getSpatialInsights(req, res) {
    try {
      const { period = 90 } = req.query;

      const [hotspots, commuteAnalysis, recommendations] = await Promise.all([
        SpatialAnalysis.identifyHotspots(req.user._id, parseInt(period)),
        SpatialAnalysis.analyzeCommutePatterns(req.user._id, parseInt(period)),
        this.generateSpatialRecommendations(req.user._id)
      ]);

      res.json({
        hotspots,
        commuteAnalysis,
        recommendations,
        generatedAt: new Date()
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new eco hub (community contribution)
  async createHub(req, res) {
    try {
      const hubData = {
        ...req.body,
        submittedBy: req.user._id,
        verified: false // Requires admin verification
      };

      const hub = new EcoHub(hubData);
      await hub.save();

      res.status(201).json({
        success: true,
        hub,
        message: 'Hub submitted for verification'
      });

    } catch (error) {
      res.status(400). json({ error: error.message });
    }
  }

  // Check in at eco hub
  async checkIn(req, res) {
    try {
      const { hubId, activity } = req.body;

      const hub = await EcoHub.findById(hubId);
      if (!hub) {
        return res.status(404).json({ error: 'Hub not found' });
      }

      // Verify proximity (within 100m)
      const distance = CarbonCalculator.calculateDistance(
        { lat: req.body.lat, lng: req.body.lng },
        { lat: hub.location.coordinates[1], lng: hub.location.coordinates[0] }
      );

      if (distance > 0.1) { // 100m
        return res.status(400).json({ 
          error: 'Too far from location',
          distance: Math.round(distance * 1000) + 'm'
        });
      }

      // Record check-in
      hub.checkIns.push({
        userId: req.user._id,
        date: new Date(),
        carbonSaved: activity?.estimatedSavings || 0
      });

      await hub.save();

      // Award points/badges (gamification)
      const checkInCount = hub.checkIns.filter(c => c.userId.toString() === req.user._id.toString()).length;
      
      res.json({
        success: true,
        checkIn: hub.checkIns[hub.checkIns.length - 1],
        stats: {
          totalCheckInsAtHub: hub.checkIns.length,
          yourCheckIns: checkInCount,
          badges: this.checkForBadges(checkInCount)
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get renewable potential analysis
  async analyzeRenewablePotential(req, res) {
    try {
      const { lat, lng, projectType, area } = req.query;

      const analysis = await SpatialAnalysis.analyzeRenewablePotential(
        { lat: parseFloat(lat), lng: parseFloat(lng) },
        projectType
      );

      // Get nearby similar projects
      const nearbyProjects = await EcoHub.find({
        type: projectType === 'solar' ? 'renewable_installer' : 
              projectType === 'reforestation' ? 'carbon_project_site' : 'sustainability_hub',
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: 50000
          }
        }
      }).limit(5);

      res.json({
        analysis,
        nearbyProjects,
        estimatedPotential: this.estimateRenewablePotential(projectType, parseFloat(area))
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Helper methods
  estimateDuration(distanceKm, mode) {
    const speeds = {
      walking: 5,
      cycling: 15,
      transit: 25,
      driving: 40
    };
    const speed = speeds[mode] || 30;
    return Math.round((distanceKm / speed) * 60); // minutes
  }

  getMaxDistanceForMode(mode) {
    const maxDistances = {
      walking: 5,
      cycling: 20,
      transit: 100,
      driving: 1000
    };
    return maxDistances[mode] || 1000;
  }

  async generateSpatialRecommendations(userId) {
    // Based on user's spatial patterns
    return [
      {
        type: 'route_optimization',
        message: 'Try cycling for trips under 5km',
        potentialImpact: '150 kg CO2e/year'
      },
      {
        type: 'location_shift',
        message: 'EV charging station available near frequent destination',
        location: { lat: 0, lng: 0 }
      }
    ];
  }

  checkForBadges(checkInCount) {
    const badges = [];
    if (checkInCount === 1) badges.push('first_visit');
    if (checkInCount === 10) badges.push('regular');
    if (checkInCount === 50) badges.push('eco_warrior');
    if (checkInCount === 100) badges.push('sustainability_champion');
    return badges;
  }

  estimateRenewablePotential(type, area) {
    const yields = {
      solar: 150, // kWh/m2/year
      wind: 0.5, // MW/km2
      reforestation: 10 // tCO2e/ha/year
    };
    
    return {
      type,
      area,
      estimatedOutput: yields[type] * area,
      unit: type === 'solar' ? 'kWh/year' : type === 'wind' ? 'MW' : 'tCO2e/year'
    };
  }
}

export default new GeospatialController();