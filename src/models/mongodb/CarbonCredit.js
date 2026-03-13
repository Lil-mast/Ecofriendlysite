// carbon credit model for MongoDB, designed to capture comprehensive information about carbon credits, including project details, quantification, verification, monitoring, pricing, marketplace status, transaction history, and retirement tracking. This model supports advanced analytics and integration with the EcoNexus API for carbon credit management and trading.

const mongoose = require('mongoose');

const carbonCreditSchema = new mongoose.Schema({
  // Credit Identification
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  vintage: { 
    type: Number, 
    required: true 
  }, // Year of emission reduction
  
  // Project Details
  project: {
    name: { type: String, required: true },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
      country: String,
      region: String
    },
    type: {
      type: String,
      enum: ['renewable_energy', 'forestry', 'methane_capture', 'direct_air_capture',
             'blue_carbon', 'soil_carbon', 'improved_cookstoves', 'water_purification',
             'industrial', 'agriculture', 'waste_management'],
      required: true
    },
    methodology: {
      standard: {
        type: String,
        enum: ['VCS', 'Gold_Standard', 'CDM', 'CAR', 'ACR', 'Plan_Vivo', 'Climate_Action_Reserve'],
        required: true
      },
      methodologyId: String,
      version: String
    },
    description: String,
    sdgImpacts: [{
      goal: Number, // SDG number 1-17
      description: String,
      evidence: String
    }],
    coBenefits: [{
      type: String,
      description: String
    }]
  },
  
  // Quantification
  quantification: {
    totalIssued: { type: Number, required: true }, // Total credits issued
    available: { type: Number, required: true }, // Currently available
    retired: { type: Number, default: 0 },
    bufferPool: { type: Number, default: 0 }, // For reversal risk
    unit: { type: String, default: 'tCO2e' }
  },
  
  // Verification
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'expired'],
      default: 'pending'
    },
    body: String, // VVB name
    reportUrl: String,
    verificationDate: Date,
    nextVerificationDate: Date,
    riskRating: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    permanencePeriod: Number // Years
  },
  
  // Monitoring & IoT
  monitoring: {
    iotDevices: [{
      deviceId: String,
      type: String,
      lastReading: Date,
      dataPoints: Number
    }],
    satelliteVerification: {
      provider: String,
      imageryDate: Date,
      changeDetection: Number, // % change detected
      confidence: Number
    },
    aiValidation: {
      score: Number,
      anomalies: [String],
      lastUpdated: Date
    }
  },
  
  // Pricing
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    priceModel: {
      type: String,
      enum: ['fixed', 'dynamic', 'auction', 'negotiable'],
      default: 'fixed'
    },
    minPrice: Number,
    maxPrice: Number,
    bulkDiscounts: [{
      minQuantity: Number,
      discountPercent: Number
    }]
  },
  
  // Marketplace Status
  status: {
    type: String,
    enum: ['draft', 'listed', 'sold', 'retired', 'delisted'],
    default: 'draft'
  },
  listing: {
    listedAt: Date,
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    featured: { type: Boolean, default: false },
    expiresAt: Date
  },
  
  // Transaction History
  transactions: [{
    type: {
      type: String,
      enum: ['issuance', 'transfer', 'retirement', 'cancellation']
    },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: Number,
    price: Number,
    date: { type: Date, default: Date.now },
    transactionHash: String, // For audit trail
    purpose: String // For retirements
  }],
  
  // Retirement tracking
  retirements: [{
    retiredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: Number,
    date: { type: Date, default: Date.now },
    beneficiary: String,
    purpose: String,
    certificateUrl: String
  }],
  
  metadata: {
    documents: [{
      name: String,
      url: String,
      type: String
    }],
    media: [{
      type: String,
      url: String,
      caption: String
    }],
    tags: [String]
  }
}, {
  timestamps: true
});

// Indexes
carbonCreditSchema.index({ 'project.location': '2dsphere' });
carbonCreditSchema.index({ vintage: -1, 'verification.status': 1 });
carbonCreditSchema.index({ 'project.type': 1, status: 1 });
carbonCreditSchema.index({ 'pricing.basePrice': 1 });
carbonCreditSchema.index({ serialNumber: 'text', 'project.name': 'text' });

// Methods
carbonCreditSchema.methods.isAvailable = function(quantity = 1) {
  return this.status === 'listed' && 
         this.quantification.available >= quantity &&
         this.verification.status === 'verified';
};

carbonCreditSchema.methods.calculatePrice = function(quantity) {
  let price = this.pricing.basePrice * quantity;
  
  // Apply bulk discounts
  if (this.pricing.bulkDiscounts) {
    const applicable = this.pricing.bulkDiscounts
      .filter(d => quantity >= d.minQuantity)
      .sort((a, b) => b.discountPercent - a.discountPercent)[0];
    
    if (applicable) {
      price = price * (1 - applicable.discountPercent / 100);
    }
  }
  
  return price;
};

module.exports = mongoose.model('CarbonCredit', carbonCreditSchema);