const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [String], // Multiple images gallery
    capacity: { type: String, required: false },
    fuelType: { type: String, required: false },
    currency: { type: String, required: false, default: "eur" },
    
    // Revolutionary Features
    carType: { type: String, enum: ['SUV', 'Sedan', 'Sports', 'Electric', 'Luxury', 'Economy', 'Van'] },
    transmission: { type: String, enum: ['Automatic', 'Manual'] },
    year: { type: Number },
    features: [String], // GPS, Bluetooth, Sunroof, etc.
    ecoRating: { type: Number, min: 0, max: 10, default: 5 }, // Environmental friendliness
    co2Emission: { type: Number }, // grams per km
    
    // Dynamic Pricing
    basePricePerHour: { type: Number, required: true },
    rentPerHour: { type: Number, required: true },
    dynamicPricing: {
      demandMultiplier: { type: Number, default: 1.0 },
      weatherMultiplier: { type: Number, default: 1.0 },
      seasonalMultiplier: { type: Number, default: 1.0 },
      lastUpdated: { type: Date, default: Date.now }
    },
    
    // Availability & Location
    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    currentLocation: {
      address: String,
      latitude: Number,
      longitude: Number,
      branch: String
    },
    
    // Social Features
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      photos: [String],
      date: { type: Date, default: Date.now }
    }],
    
    // Insurance & Safety
    insuranceIncluded: { type: Boolean, default: true },
    insuranceType: { type: String, enum: ['Basic', 'Comprehensive', 'Premium'] },
    safetyFeatures: [String], // ABS, Airbags, Lane Assist, etc.
    
    // Subscription & Special Offers
    availableForSubscription: { type: Boolean, default: false },
    specialOffers: [{
      title: String,
      description: String,
      discountPercentage: Number,
      validFrom: Date,
      validTo: Date,
      active: { type: Boolean, default: true }
    }],
    
    // Peer-to-Peer
    isPeerToPeer: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    
    // Status
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    maintenanceStatus: { type: String, enum: ['Good', 'Service Due', 'In Service'], default: 'Good' }
  },
  {
    timestamps: true,
  }
);

// Calculate average rating before saving
carSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
    this.totalReviews = this.reviews.length;
  }
};

const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
