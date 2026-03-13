// eco hub model for MongoDB, designed to capture comprehensive information about various types of eco-friendly hubs, including their location, services, operating hours, ratings, reviews, verification status, and engagement metrics. This model supports advanced analytics and integration with the EcoNexus API for promoting sustainable practices and connecting users with local eco-friendly resources.
const mongoose = require('mongoose');

const ecoHubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['recycling_center', 'ev_charging', 'bike_share', 'repair_cafe',
           'farmers_market', 'sustainability_hub', 'renewable_installer',
           'carbon_project_site', 'eco_store', 'community_garden'],
    required: true
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  operatingHours: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    open: String,
    close: String,
    closed: { type: Boolean, default: false }
  }],
  
  // Type-specific details
  details: {
    // Recycling
    acceptedMaterials: [{
      material: String,
      preparationRequired: String,
      pricePerKg: Number
    }],
    // EV Charging
    chargers: [{
      type: { type: String, enum: ['level1', 'level2', 'dc_fast', 'tesla_supercharger'] },
      power: Number, // kW
      connectors: [String],
      status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
      pricePerKwh: Number
    }],
    // Bike share
    bikes: {
      total: Number,
      available: Number,
      types: [String],
      pricePerHour: Number
    },
    // Repair cafe
    repairServices: [{
      category: String,
      skills: [String],
      spareParts: Boolean
    }],
    // Farmers market
    vendors: [{
      name: String,
      products: [String],
      organic: Boolean,
      local: Boolean
    }],
    // Carbon project site
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarbonCredit'
    },
    visitable: Boolean,
    tourSchedule: String
  },
  
  // Ratings & Reviews
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    photos: [String],
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  
  // Verification
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  
  // Engagement
  checkIns: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    carbonSaved: Number // Estimated
  }],
  
  photos: [{
    url: String,
    caption: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  
  tags: [String],
  accessibility: {
    wheelchairAccessible: Boolean,
    parkingAvailable: Boolean,
    publicTransitNearby: [String]
  }
}, {
  timestamps: true
});

ecoHubSchema.index({ location: '2dsphere' });
ecoHubSchema.index({ type: 1, verified: 1 });
ecoHubSchema.index({ tags: 1 });

module.exports = mongoose.model('EcoHub', ecoHubSchema);