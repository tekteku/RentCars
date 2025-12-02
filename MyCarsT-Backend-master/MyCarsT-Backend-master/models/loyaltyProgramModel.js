const mongoose = require("mongoose");

const loyaltyProgramSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    tier: { 
      type: String, 
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], 
      default: 'Bronze' 
    },
    points: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    referralCode: { type: String, unique: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    subscriptionPlan: {
      type: { type: String, enum: ['None', 'Monthly', 'Quarterly', 'Annual'], default: 'None' },
      startDate: Date,
      endDate: Date,
      benefits: {
        discountPercentage: { type: Number, default: 0 },
        freeUpgrades: { type: Number, default: 0 },
        prioritySupport: { type: Boolean, default: false },
        flexibleCancellation: { type: Boolean, default: false }
      }
    },
    badges: [{
      name: String,
      description: String,
      earnedDate: { type: Date, default: Date.now }
    }],
    rewards: [{
      type: String,
      description: String,
      pointsCost: Number,
      redeemed: { type: Boolean, default: false },
      redeemedDate: Date
    }]
  },
  { timestamps: true }
);

// Generate unique referral code before saving
loyaltyProgramSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("loyaltyProgram", loyaltyProgramSchema);
