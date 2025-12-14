const express = require("express");
const router = express.Router();
const TripPlan = require("../models/tripPlanModel");
const Car = require("../models/carModel");

// Create a new trip plan
router.post("/create", async (req, res) => {
  try {
    const tripPlan = new TripPlan(req.body);
    await tripPlan.save();
    
    res.send({
      success: true,
      tripPlan,
      message: "Trip plan created successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get all trip plans for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const tripPlans = await TripPlan.find({ user: req.params.userId })
      .populate('booking')
      .sort({ createdAt: -1 });
    
    res.send(tripPlans);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get trip plan by ID
router.get("/:planId", async (req, res) => {
  try {
    const tripPlan = await TripPlan.findById(req.params.planId)
      .populate('booking')
      .populate('user')
      .populate('sharedWith');
    
    res.send(tripPlan);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update trip plan
router.post("/update", async (req, res) => {
  try {
    const { planId, ...updateData } = req.body;
    
    const tripPlan = await TripPlan.findByIdAndUpdate(
      planId,
      { $set: updateData },
      { new: true }
    );
    
    res.send({
      success: true,
      tripPlan,
      message: "Trip plan updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Generate route suggestions with AI
router.post("/generate-route", async (req, res) => {
  try {
    const { startLocation, destination, carType, preferences } = req.body;
    
    // Simulate AI-powered route generation
    // In production, integrate with Google Maps API, MapBox, or similar
    
    const mockRoute = {
      estimatedDistance: calculateDistance(startLocation, destination),
      estimatedDuration: Math.floor(Math.random() * 180) + 60, // 60-240 minutes
      suggestedRoute: "Via Highway A1 and Route 66",
      waypoints: [],
      recommendedStops: generateRecommendedStops(carType),
      weatherForecast: generateWeatherForecast(),
      carbonFootprint: calculateCarbonFootprint(carType, 150),
      budget: calculateTripBudget(carType, 150)
    };
    
    res.send({
      success: true,
      route: mockRoute
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add waypoint to trip
router.post("/add-waypoint", async (req, res) => {
  try {
    const { planId, waypoint } = req.body;
    
    const tripPlan = await TripPlan.findById(planId);
    tripPlan.waypoints.push(waypoint);
    await tripPlan.save();
    
    res.send({
      success: true,
      tripPlan,
      message: "Waypoint added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Share trip with other users
router.post("/share", async (req, res) => {
  try {
    const { planId, userIds } = req.body;
    
    const tripPlan = await TripPlan.findById(planId);
    tripPlan.sharedWith = [...new Set([...tripPlan.sharedWith, ...userIds])];
    await tripPlan.save();
    
    res.send({
      success: true,
      tripPlan,
      message: "Trip shared successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Helper functions
function calculateDistance(start, end) {
  // Simplified calculation - in production use proper geo library
  return Math.floor(Math.random() * 300) + 50; // 50-350 km
}

function generateRecommendedStops(carType) {
  const stops = [
    {
      type: 'Gas',
      name: 'Shell Station',
      address: '123 Highway Road',
      rating: 4.5,
      distanceFromRoute: 2
    },
    {
      type: 'Food',
      name: 'Highway Diner',
      address: '456 Route 66',
      rating: 4.2,
      distanceFromRoute: 5
    },
    {
      type: 'Rest',
      name: 'Scenic Viewpoint',
      address: 'Mountain Pass',
      rating: 4.8,
      distanceFromRoute: 1
    }
  ];
  
  if (carType === 'Electric') {
    stops.unshift({
      type: 'Charging',
      name: 'Tesla Supercharger',
      address: '789 Green Street',
      rating: 4.7,
      distanceFromRoute: 3
    });
  }
  
  return stops;
}

function generateWeatherForecast() {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear'];
  return [
    {
      date: new Date(),
      location: 'Start Location',
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.random() * 100
    }
  ];
}

function calculateCarbonFootprint(carType, distance) {
  let co2PerKm = 120; // grams
  
  if (carType === 'Electric') {
    co2PerKm = 0;
  } else if (carType === 'Hybrid') {
    co2PerKm = 80;
  } else if (carType === 'SUV') {
    co2PerKm = 180;
  }
  
  const estimatedCO2 = (co2PerKm * distance) / 1000; // in kg
  
  return {
    estimatedCO2: estimatedCO2.toFixed(2),
    comparisonWithPublicTransport: (estimatedCO2 * 0.6).toFixed(2),
    offsetCost: (estimatedCO2 * 0.02).toFixed(2) // 2 cents per kg
  };
}

function calculateTripBudget(carType, distance) {
  const fuelEfficiency = carType === 'Electric' ? 0.15 : 0.08; // euro per km
  const fuel = distance * fuelEfficiency;
  const tolls = distance > 200 ? 15 : 5;
  const parking = 10;
  const food = 25;
  
  return {
    fuel: fuel.toFixed(2),
    tolls: tolls,
    parking: parking,
    food: food,
    total: (fuel + tolls + parking + food).toFixed(2)
  };
}

module.exports = router;
