// advanced machine learning prediction service for carbon emissions forecasting, anomaly detection, and project evaluation
import axios from 'axios';
import { CarbonEntry, User } from '../../models/mongodb/index.js';
import config from '../../config/environment.js';

class MLPredictionService {
  constructor() {
    this.mlApiUrl = config.ML_API_URL;
    this.confidenceThreshold = 0.7;
  }

  // Predict future emissions based on historical patterns
  async predictEmissions(userId, horizon = 30) {
    const historicalData = await CarbonEntry.find({
      userId,
      date: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
    }).sort({ date: 1 }).lean();

    if (historicalData.length < 30) {
      return { error: 'Insufficient data for prediction', minRequired: 30, current: historicalData.length };
    }

    // Aggregate daily emissions
    const dailyData = this.aggregateDaily(historicalData);
    
    // Feature engineering
    const features = this.extractFeatures(dailyData);
    
    try {
      // Call Python ML service or use TensorFlow.js
      const prediction = await this.callMLService('predict_emissions', {
        historical: features,
        horizon,
        userProfile: await this.getUserProfile(userId)
      });

      return {
        predictions: prediction.values,
        confidence: prediction.confidence,
        trend: prediction.trend,
        seasonality: prediction.seasonality,
        anomalies: prediction.anomalies,
        recommendations: this.generatePredictiveRecommendations(prediction)
      };
    } catch (error) {
      console.error('ML Prediction error:', error);
      // Fallback to simple trend
      return this.simpleTrendPrediction(dailyData, horizon);
    }
  }

  // Anomaly detection for carbon entries
  async detectAnomalies(entry) {
    const similarEntries = await CarbonEntry.find({
      userId: entry.userId,
      category: entry.category,
      date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
    }).lean();

    if (similarEntries.length < 10) return { isAnomaly: false, confidence: 0 };

    const values = similarEntries.map(e => e.emissions.totalCo2e);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
    
    const zScore = (entry.emissions.totalCo2e - mean) / stdDev;
    const isAnomaly = Math.abs(zScore) > 3; // 3 sigma rule
    
    return {
      isAnomaly,
      zScore,
      confidence: Math.min(1, Math.abs(zScore) / 3),
      severity: isAnomaly ? (Math.abs(zScore) > 4 ? 'high' : 'medium') : 'low',
      similarAverage: mean,
      deviation: entry.emissions.totalCo2e - mean
    };
  }

  // Predict optimal pricing for carbon credits
  async predictCreditPrice(creditData) {
    const features = {
      vintage: creditData.vintage,
      projectType: creditData.project.type,
      verificationStandard: creditData.project.methodology.standard,
      location: creditData.project.location.country,
      totalIssued: creditData.quantification.totalIssued,
      daysSinceVerification: Math.floor((Date.now() - new Date(creditData.verification.verificationDate)) / (1000 * 60 * 60 * 24)),
      coBenefits: creditData.project.coBenefits.length,
      sdgCount: creditData.project.sdgImpacts.length
    };

    try {
      const prediction = await this.callMLService('predict_price', features);
      return {
        predictedPrice: prediction.price,
        confidenceInterval: prediction.confidence,
        marketTrend: prediction.trend,
        factors: prediction.featureImportance
      };
    } catch (error) {
      // Fallback to comparable sales
      return this.comparableAnalysis(creditData);
    }
  }

  // Satellite imagery analysis for project verification
  async analyzeSatelliteImagery(projectId, coordinates, dateRange) {
    // Integration with satellite APIs (Planet, Sentinel, Landsat)
    const analysis = {
      vegetationIndex: null,
      deforestationRisk: null,
      landUseChange: null,
      confidence: 0
    };

    try {
      // This would call a Python service with GDAL/rasterio
      const result = await this.callMLService('satellite_analysis', {
        projectId,
        coordinates,
        dateRange,
        indicators: ['NDVI', 'forest_cover', 'water_quality']
      });

      return {
        ...result,
        verificationScore: this.calculateVerificationScore(result),
        anomalies: result.anomalies || []
      };
    } catch (error) {
      return { error: 'Satellite analysis unavailable', fallback: 'manual_review' };
    }
  }

  // Natural language processing for project descriptions
  async analyzeProjectDescription(text) {
    try {
      const result = await this.callMLService('nlp_analysis', { text });
      return {
        sdgAlignment: result.sdgTags,
        riskIndicators: result.risks,
        qualityScore: result.quality,
        keyMetrics: result.extractedMetrics,
        sentiment: result.sentiment
      };
    } catch (error) {
      return { error: 'NLP service unavailable' };
    }
  }

  // Helper methods
  aggregateDaily(entries) {
    const daily = {};
    entries.forEach(entry => {
      const day = entry.date.toISOString().split('T')[0];
      if (!daily[day]) daily[day] = 0;
      daily[day] += entry.emissions.totalCo2e;
    });
    return Object.entries(daily).map(([date, value]) => ({ date, value }));
  }

  extractFeatures(dailyData) {
    // Add time-based features
    return dailyData.map((d, i, arr) => ({
      ...d,
      dayOfWeek: new Date(d.date).getDay(),
      month: new Date(d.date).getMonth(),
      movingAvg7: i >= 6 ? arr.slice(i-6, i+1).reduce((a, b) => a + b.value, 0) / 7 : d.value,
      lag1: i > 0 ? arr[i-1].value : d.value,
      lag7: i >= 7 ? arr[i-7].value : d.value
    }));
  }

  async callMLService(endpoint, data) {
    if (!this.mlApiUrl) {
      throw new Error('ML API URL not configured');
    }
    
    const response = await axios.post(`${this.mlApiUrl}/${endpoint}`, data, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;
  }

  simpleTrendPrediction(data, horizon) {
    // Linear regression fallback
    const n = data.length;
    const sumX = data.reduce((sum, d, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumXX = data.reduce((sum, d, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictions = [];
    for (let i = 1; i <= horizon; i++) {
      predictions.push({
        day: i,
        predicted: slope * (n + i) + intercept,
        lower: slope * (n + i) + intercept * 0.8,
        upper: slope * (n + i) + intercept * 1.2
      });
    }
    
    return {
      predictions,
      method: 'linear_trend',
      confidence: 0.6,
      trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
    };
  }

  generatePredictiveRecommendations(prediction) {
    const recs = [];
    
    if (prediction.trend === 'increasing') {
      recs.push({
        type: 'urgent',
        message: 'Emissions trending upward. Review recent activities.',
        actions: ['audit_recent_entries', 'identify_anomalies']
      });
    }
    
    if (prediction.seasonality) {
      recs.push({
        type: 'seasonal',
        message: `High ${prediction.seasonality.peakSeason} emissions predicted. Plan reductions.`,
        actions: ['schedule_maintenance', 'optimize_hvac']
      });
    }
    
    return recs;
  }

  calculateVerificationScore(analysis) {
    // Weighted scoring
    const weights = {
      ndvi: 0.3,
      forest_cover: 0.4,
      water_quality: 0.2,
      consistency: 0.1
    };
    
    let score = 0;
    for (const [key, weight] of Object.entries(weights)) {
      if (analysis[key]) {
        score += analysis[key].score * weight;
      }
    }
    
    return Math.round(score * 100) / 100;
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).lean();
    return {
      role: user.role,
      location: user.location,
      carbonProfile: user.carbonProfile
    };
  }

  comparableAnalysis(creditData) {
    // Simple comparable market analysis
    return {
      predictedPrice: creditData.pricing.basePrice,
      method: 'comparable_sales',
      confidence: 0.5,
      note: 'ML service unavailable - using base price'
    };
  }
}

export default new MLPredictionService();