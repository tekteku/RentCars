const express = require("express");
const router = express.Router();
const UserPreference = require("../models/userPreferenceModel");
const Car = require("../models/carModel");
const Booking = require("../models/bookingModel");

// Get user preferences
router.get("/preferences/:userId", async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ user: req.params.userId });
    
    if (!preferences) {
      // Create default preferences if none exist
      preferences = new UserPreference({
        user: req.params.userId,
        preferredCarTypes: [],
        preferredFuelTypes: [],
        budgetRange: { min: 0, max: 1000 }
      });
      await preferences.save();
    }
    
    res.send(preferences);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update user preferences
router.post("/preferences/update", async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    
    const preferences = await UserPreference.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    res.send(preferences);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get AI-powered car recommendations
router.post("/recommendations", async (req, res) => {
  try {
    const { userId, tripType, duration, passengers } = req.body;
    
    // Get user preferences and rental history
    const preferences = await UserPreference.findOne({ user: userId }).populate('rentalHistory.carId');
    const userBookings = await Booking.find({ user: userId }).populate('car');
    
    // Get all available cars
    const allCars = await Car.find({ isActive: true, isAvailable: true });
    
    // AI Scoring Algorithm
    const scoredCars = allCars.map(car => {
      let score = 50; // Base score
      
      // Score based on user's preferred car types
      if (preferences?.preferredCarTypes.includes(car.carType)) {
        score += 15;
      }
      
      // Score based on fuel type preference
      if (preferences?.preferredFuelTypes.includes(car.fuelType)) {
        score += 10;
      }
      
      // Score based on budget
      if (car.rentPerHour >= preferences?.budgetRange.min && 
          car.rentPerHour <= preferences?.budgetRange.max) {
        score += 15;
      }
      
      // Score based on capacity
      if (passengers && car.capacity && parseInt(car.capacity) >= passengers) {
        score += 10;
      }
      
      // Score based on past positive experiences
      const pastRentals = preferences?.rentalHistory.filter(h => 
        h.carId?._id.toString() === car._id.toString() && h.rating >= 4
      );
      if (pastRentals?.length > 0) {
        score += 20;
      }
      
      // Score based on car rating
      score += (car.averageRating || 0) * 2;
      
      // Score based on eco-friendliness if user has high eco score
      if (preferences?.ecoScore > 70 && car.ecoRating > 7) {
        score += 15;
      }
      
      // Trip type matching
      if (tripType === 'Long Distance' && ['SUV', 'Sedan', 'Luxury'].includes(car.carType)) {
        score += 10;
      }
      if (tripType === 'City Drive' && ['Economy', 'Electric'].includes(car.carType)) {
        score += 10;
      }
      if (tripType === 'Family Trip' && ['SUV', 'Van'].includes(car.carType)) {
        score += 10;
      }
      
      return {
        ...car.toObject(),
        recommendationScore: Math.min(100, score),
        recommendationReason: generateRecommendationReason(car, score, preferences)
      };
    });
    
    // Sort by score and return top recommendations
    const recommendations = scoredCars
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 10);
    
    res.send(recommendations);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Helper function to generate recommendation reason
function generateRecommendationReason(car, score, preferences) {
  const reasons = [];
  
  if (preferences?.preferredCarTypes.includes(car.carType)) {
    reasons.push(`Matches your preferred ${car.carType} type`);
  }
  
  if (car.averageRating >= 4.5) {
    reasons.push(`Highly rated (${car.averageRating}★)`);
  }
  
  if (car.ecoRating >= 8) {
    reasons.push("Eco-friendly choice");
  }
  
  if (preferences?.rentalHistory.some(h => h.carId?.carType === car.carType && h.rating >= 4)) {
    reasons.push("Similar to cars you've enjoyed before");
  }
  
  if (car.features?.includes('GPS')) {
    reasons.push("Includes GPS navigation");
  }
  
  if (reasons.length === 0) {
    reasons.push("Great value for money");
  }
  
  return reasons.join(' • ');
}

// Add rating to rental history
router.post("/rate-car", async (req, res) => {
  try {
    const { userId, carId, rating } = req.body;
    
    const preferences = await UserPreference.findOne({ user: userId });
    
    if (preferences) {
      preferences.rentalHistory.push({
        carId: carId,
        rating: rating,
        date: new Date()
      });
      
      await preferences.save();
      res.send({ success: true, message: "Rating added successfully" });
    } else {
      res.status(404).send({ success: false, message: "User preferences not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
