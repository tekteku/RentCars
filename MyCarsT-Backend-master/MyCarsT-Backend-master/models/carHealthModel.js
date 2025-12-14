const mongoose = require("mongoose");

const carHealthSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "cars", required: true, unique: true },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
      lastUpdated: { type: Date, default: Date.now }
    },
    fuelLevel: { 
      type: Number, 
      min: 0, 
      max: 100,
      default: 100 
    },
    batteryLevel: { // For electric cars
      type: Number, 
      min: 0, 
      max: 100 
    },
    mileage: { type: Number, default: 0 },
    lastServiceDate: Date,
    nextServiceDue: Date,
    healthScore: { type: Number, min: 0, max: 100, default: 100 },
    issues: [{
      type: { 
        type: String, 
        enum: ['Engine', 'Brakes', 'Tires', 'Battery', 'Transmission', 'AC', 'Other'] 
      },
      severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
      description: String,
      reportedDate: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false }
    }],
    maintenanceHistory: [{
      date: Date,
      type: String,
      cost: Number,
      description: String,
      performedBy: String
    }],
    inspections: [{
      inspectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      date: { type: Date, default: Date.now },
      photos: [String], // URLs to photos
      damageReports: [{
        location: String,
        severity: { type: String, enum: ['Minor', 'Moderate', 'Severe'] },
        description: String,
        photoUrl: String
      }],
      overallCondition: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'] }
    }],
    tirePressure: {
      frontLeft: Number,
      frontRight: Number,
      rearLeft: Number,
      rearRight: Number,
      unit: { type: String, default: 'PSI' }
    },
    oilLife: { type: Number, min: 0, max: 100 }, // Percentage
    engineTemperature: Number, // Celsius
    alerts: [{
      type: String,
      message: String,
      priority: { type: String, enum: ['Low', 'Medium', 'High'] },
      timestamp: { type: Date, default: Date.now },
      acknowledged: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("carHealth", carHealthSchema);
