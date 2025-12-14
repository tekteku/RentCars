const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    preferredCarTypes: [{ type: String, enum: ['SUV', 'Sedan', 'Sports', 'Electric', 'Luxury', 'Economy', 'Van'] }],
    preferredFuelTypes: [{ type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] }],
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 1000 }
    },
    purposeHistory: [{ 
      type: String, 
      enum: ['Business', 'Leisure', 'Family Trip', 'Adventure', 'City Drive', 'Long Distance'] 
    }],
    favoriteFeatures: [{ 
      type: String, 
      enum: ['GPS', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Heated Seats', 'Backup Camera', 'Apple CarPlay', 'Android Auto'] 
    }],
    rentalHistory: [{
      carId: { type: mongoose.Schema.Types.ObjectId, ref: "cars" },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now }
    }],
    ecoScore: { type: Number, default: 50 } // Eco-friendly preference score
  },
  { timestamps: true }
);

module.exports = mongoose.model("userPreference", userPreferenceSchema);
