// carbon footprint entry model for MongoDB, designed to capture detailed information about individual carbon emissions activities, including geospatial data, activity details, emission calculations, data quality, and source tracking. This model supports advanced analytics and integration with the EcoNexus API for carbon management and reporting.
const mongoose = require('mongoose');

const carbonEntrySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  
  // Temporal tracking
  date: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  reportingPeriod: {
    startDate: Date,
    endDate: Date,
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual']
    }
  },
  
  // Categorization (GHG Protocol aligned)
  category: {
    type: String,
    enum: ['scope1_direct', 'scope2_indirect_energy', 'scope3_value_chain', 
           'transportation', 'energy', 'industrial_process', 'agriculture', 'waste'],
    required: true,
    index: true
  },
  
  subCategory: {
    type: String,
    enum: ['stationary_combustion', 'mobile_combustion', 'process_emissions', 
           'purchased_electricity', 'purchased_heat', 'business_travel', 
           'employee_commuting', 'upstream_transport', 'waste_generated',
           'purchased_goods', 'capital_goods', 'fuel_energy_related']
  },
  
  // Geospatial data
  geometry: {
    type: {
      type: String,
      enum: ['Point', 'LineString', 'Polygon', 'MultiPoint'],
      required: true
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    accuracy: Number, // GPS accuracy in meters
    altitude: Number
  },
  
  // Activity details
  activity: {
    type: { type: String, required: true },
    description: String,
    quantity: Number,
    unit: String,
    fuelType: String,
    vehicleType: String,
    distance: Number, // km
    duration: Number, // minutes
    passengers: { type: Number, default: 1 },
    loadFactor: Number, // For freight
    temperature: Number, // For HVAC calculations
    occupancy: Number // For buildings
  },
  
  // Emission calculations
  emissions: {
    co2: { type: Number, required: true }, // kg CO2
    ch4: { type: Number, default: 0 }, // kg CH4
    n2o: { type: Number, default: 0 }, // kg N2O
    hfcs: { type: Number, default: 0 },
    pfcs: { type: Number, default: 0 },
    sf6: { type: Number, default: 0 },
    nf3: { type: Number, default: 0 },
    totalCo2e: { type: Number, required: true }, // Total CO2 equivalent
    biogenicCo2: { type: Number, default: 0 },
    uncertainty: Number // Percentage uncertainty
  },
  
  // Emission factors used
  emissionFactors: [{
    gas: String,
    factor: Number,
    unit: String,
    source: String, // IPCC, EPA, DEFRA, etc.
    year: Number,
    region: String
  }],
  
  // Location context for regional factors
  locationContext: {
    country: String,
    region: String,
    gridCarbonIntensity: Number, // g CO2/kWh
    climateZone: String,
    urbanDensity: String
  },
  
  // Data quality & verification
  dataQuality: {
    score: { type: Number, min: 1, max: 5 },
    methodology: String,
    verificationStatus: {
      type: String,
      enum: ['unverified', 'self_verified', 'third_party_verified', 'audited'],
      default: 'unverified'
    },
    verifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    evidenceUrls: [String]
  },
  
  // Source tracking
  dataSource: {
    type: { 
      type: String, 
      enum: ['manual_entry', 'iot_sensor', 'api_integration', 'file_upload', 
             'calculated', 'estimated', 'ai_predicted'],
      default: 'manual_entry'
    },
    provider: String, // Device manufacturer or API name
    deviceId: String,
    rawData: mongoose.Schema.Types.Mixed,
    importId: String // For bulk imports
  },
  
  // AI/ML enhancements
  aiAnalysis: {
    anomalyScore: Number,
    confidence: Number,
    predictedVsActual: Number,
    recommendations: [String],
    processedAt: Date
  },
  
  // Marketplace linkage
  marketplace: {
    creditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarbonCredit'
    },
    listingId: String,
    transactionId: String,
    price: Number,
    currency: String
  },
  
  metadata: {
    tags: [String],
    notes: String,
    attachments: [{
      filename: String,
      url: String,
      type: String
    }]
  }
}, {
  timestamps: true
});

// Compound indexes for analytics
carbonEntrySchema.index({ userId: 1, date: -1, category: 1 });
carbonEntrySchema.index({ geometry: '2dsphere' });
carbonEntrySchema.index({ category: 1, 'locationContext.country': 1, date: -1 });
carbonEntrySchema.index({ 'dataQuality.verificationStatus': 1, date: -1 });
carbonEntrySchema.index({ 'emissions.totalCo2e': -1 });

// Pre-save hook for CO2e calculation
carbonEntrySchema.pre('save', function(next) {
  if (this.isModified('emissions')) {
    // GWP100 values (IPCC AR5)
    const gwp = {
      co2: 1,
      ch4: 28,
      n2o: 265,
      hfcs: 1000, // Simplified, varies by type
      pfcs: 1000,
      sf6: 23500,
      nf3: 16100
    };
    
    this.emissions.totalCo2e = 
      (this.emissions.co2 * gwp.co2) +
      (this.emissions.ch4 * gwp.ch4) +
      (this.emissions.n2o * gwp.n2o) +
      (this.emissions.hfcs * gwp.hfcs) +
      (this.emissions.pfcs * gwp.pfcs) +
      (this.emissions.sf6 * gwp.sf6) +
      (this.emissions.nf3 * gwp.nf3) -
      this.emissions.biogenicCo2; // Biogenic CO2 typically excluded
  }
  next();
});

// Static methods for analytics
carbonEntrySchema.statics.getEmissionsByPeriod = async function(userId, startDate, endDate, groupBy = 'day') {
  const groupFormat = {
    day: '%Y-%m-%d',
    week: '%Y-W%V',
    month: '%Y-%m',
    year: '%Y'
  };
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: groupFormat[groupBy], date: '$date' }
        },
        totalEmissions: { $sum: '$emissions.totalCo2e' },
        count: { $sum: 1 },
        categories: { $push: '$category' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('CarbonEntry', carbonEntrySchema);