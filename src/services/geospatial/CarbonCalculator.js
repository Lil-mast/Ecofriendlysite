// carbon calculator service for geospatial emissions estimation, designed to provide detailed and accurate carbon footprint calculations for various activities, including transportation, energy use, industrial processes, waste management, and consumption. This service integrates geospatial data to enhance the precision of emissions estimates and supports advanced features such as transport mode detection from GPS tracks and real-time grid carbon intensity retrieval.
import * as turf from '@turf/turf';
import axios from 'axios';
import NodeCache from 'node-cache';
import config from '../../config/environment.js';

class CarbonCalculator {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 });
    
    // Emission factors database (IPCC/EPA/DEFRA aligned)
    this.emissionFactors = {
      transport: {
        gasoline_car: 0.21, // kg CO2/km
        diesel_car: 0.17,
        hybrid_car: 0.12,
        electric_car: 0.05, // Varies by grid
        motorcycle: 0.10,
        bus: 0.10,
        train_electric: 0.04,
        train_diesel: 0.06,
        flight_short: 0.25, // < 1500km
        flight_long: 0.15, // > 1500km
        ship: 0.01,
        bicycle: 0,
        walking: 0,
        ferry: 0.19
      },
      energy: {
        gridIntensity: {
          'US': 386, 'CN': 555, 'DE': 385, 'FR': 64, 'BR': 98,
          'IN': 713, 'UK': 233, 'CA': 130, 'AU': 570, 'JP': 465,
          'SE': 13, 'NO': 8, 'IS': 0, 'DK': 180, 'FI': 130
        },
        natural_gas: 0.20, // kg CO2e/kWh
        heating_oil: 0.26,
        propane: 0.18,
        coal: 0.34,
        biomass: 0.02,
        solar_pv: 0.05,
        wind: 0.01,
        hydro: 0.02,
        nuclear: 0.01
      },
      materials: {
        steel: 1.9, // kg CO2e/kg
        cement: 0.9,
        aluminum: 8.2,
        plastic_pet: 2.8,
        paper: 0.9,
        glass: 0.85,
        organic_cotton: 2.1,
        polyester: 9.5
      },
      waste: {
        landfill_mixed: 0.5, // kg CO2e/kg
        landfill_organic: 0.25,
        incineration: 0.7,
        recycling_paper: -0.5, // Negative = savings
        recycling_plastic: -0.8,
        recycling_glass: -0.3,
        recycling_metal: -1.2,
        composting: -0.2
      },
      food: {
        beef: 27.0, // kg CO2e/kg
        lamb: 20.0,
        pork: 12.0,
        chicken: 6.0,
        fish_farmed: 5.0,
        fish_wild: 3.0,
        eggs: 4.5,
        dairy: 3.0,
        rice: 4.0,
        wheat: 1.5,
        vegetables: 0.5,
        fruits: 0.8,
        nuts: 2.0,
        processed: 4.0
      }
    };
  }

  // Distance calculation using Turf.js
  calculateDistance(from, to, unit = 'kilometers') {
    const point1 = turf.point([from.lng, from.lat]);
    const point2 = turf.point([to.lng, to.lat]);
    return turf.distance(point1, point2, { units: unit });
  }

  // Calculate path distance from GPS track
  calculatePathDistance(coordinates) {
    if (coordinates.length < 2) return 0;
    const line = turf.lineString(coordinates.map(c => [c.lng || c[0], c.lat || c[1]]));
    return turf.length(line, { units: 'kilometers' });
  }

  // Detect transport mode from GPS data
  async detectTransportMode(gpsTrack) {
    if (!gpsTrack || gpsTrack.length < 2) return 'unknown';
    
    const speeds = [];
    const accelerations = [];
    
    for (let i = 1; i < gpsTrack.length; i++) {
      const p1 = gpsTrack[i - 1];
      const p2 = gpsTrack[i];
      
      const dist = this.calculateDistance(
        { lng: p1.lng || p1[0], lat: p1.lat || p1[1] },
        { lng: p2.lng || p2[0], lat: p2.lat || p2[1] }
      );
      
      const timeDiff = (new Date(p2.timestamp) - new Date(p1.timestamp)) / 1000 / 3600; // hours
      if (timeDiff > 0) {
        const speed = dist / timeDiff; // km/h
        speeds.push(speed);
        
        if (speeds.length > 1) {
          const accel = (speed - speeds[speeds.length - 2]) / timeDiff;
          accelerations.push(Math.abs(accel));
        }
      }
    }
    
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const maxSpeed = Math.max(...speeds);
    const avgAccel = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;
    
    // Classification heuristics
    if (maxSpeed > 800) return 'flight_long';
    if (maxSpeed > 300) return 'flight_short';
    if (avgSpeed > 150) return 'train_electric';
    if (avgSpeed > 80 && avgAccel < 5) return 'train_diesel';
    if (avgSpeed > 60 && avgAccel > 8) return 'car'; // High acceleration suggests car
    if (avgSpeed > 40 && avgAccel < 5) return 'bus';
    if (avgSpeed > 25) return 'motorcycle';
    if (avgSpeed > 12) return 'bicycle';
    if (avgSpeed > 3) return 'walking';
    return 'stationary';
  }

  // Get real-time grid carbon intensity
  async getGridCarbonIntensity(lat, lng, countryCode) {
    const cacheKey = `grid_${countryCode}_${Math.round(lat)}_${Math.round(lng)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (config.ELECTRICITYMAP_API_KEY) {
        const response = await axios.get(
          `https://api.electricitymap.org/v3/carbon-intensity/latest?lat=${lat}&lon=${lng}`,
          { headers: { 'auth-token': config.ELECTRICITYMAP_API_KEY }, timeout: 5000 }
        );
        const intensity = response.data.carbonIntensity;
        this.cache.set(cacheKey, intensity, 1800); // 30 min cache
        return intensity;
      }
    } catch (error) {
      console.warn('ElectricityMap API failed, using fallback:', error.message);
    }

    // Fallback to static database
    const intensity = this.emissionFactors.energy.gridIntensity[countryCode] || 450;
    this.cache.set(cacheKey, intensity, 86400); // 24h cache for fallback
    return intensity;
  }

  // Calculate transport emissions with geospatial context
  async calculateTransportEmissions(activity, userLocation) {
    const { mode, distance, passengers = 1, vehicleType, fuelType } = activity;
    
    let factor = this.emissionFactors.transport[mode] || 0.21;
    
    // Adjust for electric vehicles based on local grid
    if (mode === 'electric_car' && userLocation) {
      const gridIntensity = await this.getGridCarbonIntensity(
        userLocation.coordinates[1],
        userLocation.coordinates[0],
        userLocation.country
      );
      // Assume 0.2 kWh/km efficiency
      factor = (gridIntensity * 0.2) / 1000;
    }
    
    // Adjust for traffic congestion if available
    if (mode.includes('car') && activity.routeCongestion) {
      factor *= (1 + activity.routeCongestion * 0.2); // Up to 20% increase
    }
    
    // Well-to-wheel vs tank-to-wheel adjustments
    const wtwMultiplier = fuelType === 'biofuel' ? 0.3 : 1.2;
    
    const totalEmissions = (distance * factor * wtwMultiplier) / passengers;
    
    return {
      co2: totalEmissions * 0.95,
      ch4: totalEmissions * 0.03,
      n2o: totalEmissions * 0.02,
      totalCo2e: totalEmissions,
      methodology: 'GHG Protocol Mobile Combustion',
      factors: { mode, distance, passengers, gridIntensity: factor }
    };
  }

  // Calculate building energy emissions
  async calculateEnergyEmissions(usage, location) {
    const { kwh, source = 'grid', buildingType, area, occupancy } = usage;
    
    let factor;
    let methodology;
    
    if (source === 'grid') {
      const intensity = await this.getGridCarbonIntensity(
        location.coordinates[1],
        location.coordinates[0],
        location.country
      );
      factor = intensity / 1000; // Convert g/kWh to kg/kWh
      methodology = 'Location-based grid average';
    } else {
      factor = this.emissionFactors.energy[source] || 0.4;
      methodology = 'Market-based contract';
    }
    
    // Adjust for building efficiency
    let efficiencyMultiplier = 1.0;
    if (buildingType === 'commercial') efficiencyMultiplier = 1.2;
    if (buildingType === 'industrial') efficiencyMultiplier = 1.5;
    if (buildingType === 'datacenter') efficiencyMultiplier = 2.0;
    
    const total = kwh * factor * efficiencyMultiplier;
    
    return {
      co2: total * 0.98,
      ch4: total * 0.01,
      n2o: total * 0.01,
      totalCo2e: total,
      methodology,
      factors: { kwh, source, buildingType, intensity: factor }
    };
  }

  // Calculate industrial process emissions
  calculateIndustrialEmissions(processType, quantity, material) {
    const factors = {
      cement_production: 0.9, // tCO2e/t cement
      steel_production: 1.9,
      aluminum_production: 8.2,
      chemical_synthesis: 2.5,
      paper_mill: 0.5
    };
    
    const factor = factors[processType] || 1.0;
    const total = quantity * factor;
    
    return {
      co2: total,
      totalCo2e: total,
      methodology: 'IPCC Tier 2',
      factors: { processType, quantity, factor }
    };
  }

  // Calculate waste emissions
  calculateWasteEmissions(wasteType, quantity, treatmentMethod) {
    const baseFactor = this.emissionFactors.waste[wasteType] || 0.5;
    const treatmentMultiplier = {
      landfill: 1.0,
      incineration: 0.8,
      recycling: -0.6, // Negative = savings
      composting: -0.4,
      anaerobic_digestion: -0.7
    }[treatmentMethod] || 1.0;
    
    const total = quantity * baseFactor * treatmentMultiplier;
    
    return {
      ch4: treatmentMethod === 'landfill' ? quantity * 0.1 : 0,
      totalCo2e: total,
      methodology: 'IPCC Waste Model',
      factors: { wasteType, quantity, treatmentMethod }
    };
  }

  // Calculate food/consumption emissions
  calculateConsumptionEmissions(items, location) {
    let total = 0;
    const breakdown = [];
    
    for (const item of items) {
      const factor = this.emissionFactors.food[item.category] || 
                     this.emissionFactors.materials[item.category] || 2.0;
      
      // Local sourcing adjustment
      const localMultiplier = item.localSourced ? 0.9 : 1.0;
      // Organic adjustment (typically lower input emissions)
      const organicMultiplier = item.organic ? 0.95 : 1.0;
      
      const emissions = item.quantity * factor * localMultiplier * organicMultiplier;
      total += emissions;
      
      breakdown.push({
        item: item.name,
        category: item.category,
        quantity: item.quantity,
        emissions,
        factors: { localMultiplier, organicMultiplier }
      });
    }
    
    return {
      totalCo2e: total,
      breakdown,
      methodology: 'Hybrid LCA'
    };
  }

  // Scope 3 Value Chain calculations
  async calculateScope3Emissions(activities, organizationData) {
    const categories = {
      purchasedGoods: 0,
      capitalGoods: 0,
      fuelEnergy: 0,
      transport: 0,
      waste: 0,
      businessTravel: 0,
      employeeCommuting: 0,
      upstreamLeased: 0,
      downstream: 0
    };
    
    for (const activity of activities) {
      const result = await this.calculateEmissions(activity);
      categories[activity.scope3Category] += result.totalCo2e;
    }
    
    // Add employee commuting estimation if not provided
    if (!categories.employeeCommuting && organizationData.employees) {
      const avgCommute = 20; // km/day assumption
      const workDays = 230; // days/year
      categories.employeeCommuting = organizationData.employees * avgCommute * workDays * 0.1; // 0.1 kg/km
    }
    
    return {
      totalCo2e: Object.values(categories).reduce((a, b) => a + b, 0),
      categories,
      methodology: 'GHG Protocol Scope 3'
    };
  }

  // Generic calculation dispatcher
  async calculateEmissions(activity) {
    switch (activity.type) {
      case 'transport':
        return this.calculateTransportEmissions(activity.data, activity.location);
      case 'energy':
        return this.calculateEnergyEmissions(activity.data, activity.location);
      case 'industrial':
        return this.calculateIndustrialEmissions(
          activity.data.processType,
          activity.data.quantity,
          activity.data.material
        );
      case 'waste':
        return this.calculateWasteEmissions(
          activity.data.wasteType,
          activity.data.quantity,
          activity.data.treatment
        );
      case 'consumption':
        return this.calculateConsumptionEmissions(activity.data.items, activity.location);
      default:
        throw new Error(`Unknown activity type: ${activity.type}`);
    }
  }

  // Carbon sequestration/removal calculations
  calculateRemoval(projectType, area, duration, species) {
    const sequestrationRates = {
      reforestation: 10, // tCO2e/ha/year
      afforestation: 12,
      forest_conservation: 8,
      wetland_restoration: 15,
      soil_carbon: 3,
      blue_carbon_mangrove: 20,
      blue_carbon_seagrass: 10,
      direct_air_capture: 1000 // Highly variable, per facility
    };
    
    const rate = sequestrationRates[projectType] || 5;
    const total = rate * area * duration;
    const uncertainty = 0.3; // 30% standard for forestry
    
    return {
      totalRemoval: total,
      annualRate: rate * area,
      uncertainty: total * uncertainty,
      permanenceRisk: this.assessPermanenceRisk(projectType, duration),
      factors: { projectType, area, duration, rate }
    };
  }

  assessPermanenceRisk(projectType, duration) {
    const risks = {
      reforestation: 'medium',
      afforestation: 'medium',
      forest_conservation: 'high',
      wetland_restoration: 'low',
      soil_carbon: 'medium',
      blue_carbon_mangrove: 'low',
      direct_air_capture: 'very_low'
    };
    return risks[projectType] || 'medium';
  }
}

export default new CarbonCalculator();