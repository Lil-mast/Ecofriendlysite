// user model for MongoDB with comprehensive fields for both individual and organizational users, including geospatial data, carbon profile, sustainability goals, and preferences. This model supports authentication, role-based access control, and advanced querying capabilities for the Senken API.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8,
    select: false
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['individual', 'organization', 'verifier', 'admin'],
    default: 'individual'
  },
  
  // Geospatial Profile
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
      timezone: String
    }
  },
  
  // Organization specific
  organization: {
    name: String,
    registrationNumber: String,
    industry: String,
    size: {
      type: String,
      enum: ['micro', 'small', 'medium', 'large', 'enterprise']
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  
  // Carbon Profile
  carbonProfile: {
    householdSize: { type: Number, default: 1 },
    primaryTransport: {
      type: String,
      enum: ['none', 'electric_vehicle', 'hybrid', 'gasoline', 'diesel', 'public_transit', 'active'],
      default: 'none'
    },
    housingType: {
      type: String,
      enum: ['apartment', 'house', 'condo', 'commercial', 'industrial'],
      default: 'apartment'
    },
    energySource: [{
      type: String,
      enum: ['grid', 'solar', 'wind', 'natural_gas', 'oil', 'renewable_mix']
    }],
    annualRevenue: Number, // For carbon intensity calculations
    employeeCount: Number
  },
  
  // Goals & Targets
  sustainabilityGoals: [{
    type: {
      type: String,
      enum: ['emission_reduction', 'energy_efficiency', 'renewable_energy', 'waste_reduction', 'water_conservation']
    },
    targetValue: Number,
    currentValue: { type: Number, default: 0 },
    unit: String,
    baselineYear: Number,
    targetYear: Number,
    deadline: Date,
    achieved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true }
    },
    privacy: {
      sharePublicly: { type: Boolean, default: false },
      shareWithOrganizations: { type: Boolean, default: true }
    },
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    }
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  },
  lastLogin: Date,
  emailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 });
userSchema.index({ 'organization.verificationStatus': 1 });
userSchema.index({ createdAt: -1 });

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full profile
userSchema.virtual('carbonScore').get(function() {
  // Calculate based on goals achievement
  if (!this.sustainabilityGoals.length) return 0;
  const achieved = this.sustainabilityGoals.filter(g => g.achieved).length;
  return Math.round((achieved / this.sustainabilityGoals.length) * 100);
});

module.exports = mongoose.model('User', userSchema);