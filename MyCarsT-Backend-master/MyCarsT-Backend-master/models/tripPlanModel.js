const mongoose = require("mongoose");

const tripPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "bookings" },
    tripName: { type: String, required: true },
    startLocation: {
      address: String,
      latitude: Number,
      longitude: Number
    },
    destination: {
      address: String,
      latitude: Number,
      longitude: Number
    },
    waypoints: [{
      name: String,
      address: String,
      latitude: Number,
      longitude: Number,
      stopDuration: Number, // in minutes
      notes: String
    }],
    estimatedDistance: { type: Number }, // in km
    estimatedDuration: { type: Number }, // in minutes
    suggestedRoute: String, // Encoded polyline or route description
    tripType: { 
      type: String, 
      enum: ['OneWay', 'RoundTrip', 'MultiCity'], 
      default: 'RoundTrip' 
    },
    preferences: {
      avoidTolls: { type: Boolean, default: false },
      avoidHighways: { type: Boolean, default: false },
      preferScenic: { type: Boolean, default: false }
    },
    recommendedStops: [{
      type: { type: String, enum: ['Gas', 'Charging', 'Food', 'Rest', 'Attraction', 'Parking'] },
      name: String,
      address: String,
      latitude: Number,
      longitude: Number,
      rating: Number,
      distanceFromRoute: Number // in km
    }],
    weatherForecast: [{
      date: Date,
      location: String,
      temperature: Number,
      condition: String,
      precipitation: Number,
      warnings: [String]
    }],
    carbonFootprint: {
      estimatedCO2: Number, // in kg
      comparisonWithPublicTransport: Number,
      offsetCost: Number
    },
    budget: {
      fuel: Number,
      tolls: Number,
      parking: Number,
      food: Number,
      total: Number
    },
    status: { 
      type: String, 
      enum: ['Planning', 'Active', 'Completed', 'Cancelled'], 
      default: 'Planning' 
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("tripPlan", tripPlanSchema);
