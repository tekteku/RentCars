const express = require("express");
const router = express.Router();
const LoyaltyProgram = require("../models/loyaltyProgramModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

// Get loyalty program details
router.get("/details/:userId", async (req, res) => {
  try {
    let loyalty = await LoyaltyProgram.findOne({ user: req.params.userId });
    
    if (!loyalty) {
      // Create default loyalty program for new user
      loyalty = new LoyaltyProgram({
        user: req.params.userId,
        tier: 'Bronze',
        points: 0
      });
      await loyalty.save();
    }
    
    res.send(loyalty);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add points after booking
router.post("/add-points", async (req, res) => {
  try {
    const { userId, bookingAmount, bookingId } = req.body;
    
    let loyalty = await LoyaltyProgram.findOne({ user: userId });
    
    if (!loyalty) {
      loyalty = new LoyaltyProgram({ user: userId });
    }
    
    // Calculate points: 1 point per euro spent
    const pointsToAdd = Math.floor(bookingAmount);
    
    loyalty.points += pointsToAdd;
    loyalty.totalBookings += 1;
    loyalty.totalSpent += bookingAmount;
    
    // Update tier based on total spent
    if (loyalty.totalSpent >= 5000) {
      loyalty.tier = 'Diamond';
    } else if (loyalty.totalSpent >= 3000) {
      loyalty.tier = 'Platinum';
    } else if (loyalty.totalSpent >= 2000) {
      loyalty.tier = 'Gold';
    } else if (loyalty.totalSpent >= 1000) {
      loyalty.tier = 'Silver';
    } else {
      loyalty.tier = 'Bronze';
    }
    
    // Add badges
    if (loyalty.totalBookings === 1 && !loyalty.badges.some(b => b.name === 'First Ride')) {
      loyalty.badges.push({
        name: 'First Ride',
        description: 'Completed your first booking'
      });
    }
    
    if (loyalty.totalBookings === 10 && !loyalty.badges.some(b => b.name === 'Frequent Rider')) {
      loyalty.badges.push({
        name: 'Frequent Rider',
        description: 'Completed 10 bookings'
      });
    }
    
    if (loyalty.totalBookings === 50 && !loyalty.badges.some(b => b.name === 'Road Warrior')) {
      loyalty.badges.push({
        name: 'Road Warrior',
        description: 'Completed 50 bookings'
      });
    }
    
    await loyalty.save();
    
    res.send({
      success: true,
      loyalty,
      pointsAdded: pointsToAdd,
      message: `Added ${pointsToAdd} points! You now have ${loyalty.points} points.`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Redeem points
router.post("/redeem", async (req, res) => {
  try {
    const { userId, rewardType, pointsCost } = req.body;
    
    const loyalty = await LoyaltyProgram.findOne({ user: userId });
    
    if (!loyalty) {
      return res.status(404).send({ success: false, message: "Loyalty program not found" });
    }
    
    if (loyalty.points < pointsCost) {
      return res.status(400).send({ 
        success: false, 
        message: "Insufficient points" 
      });
    }
    
    loyalty.points -= pointsCost;
    loyalty.rewards.push({
      type: rewardType,
      pointsCost: pointsCost,
      redeemed: true,
      redeemedDate: new Date()
    });
    
    await loyalty.save();
    
    res.send({
      success: true,
      loyalty,
      message: `Successfully redeemed ${rewardType}!`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Subscribe to membership plan
router.post("/subscribe", async (req, res) => {
  try {
    const { userId, planType, paymentId } = req.body;
    
    const loyalty = await LoyaltyProgram.findOne({ user: userId });
    
    if (!loyalty) {
      return res.status(404).send({ success: false, message: "Loyalty program not found" });
    }
    
    const planBenefits = {
      'Monthly': {
        discountPercentage: 10,
        freeUpgrades: 1,
        prioritySupport: true,
        flexibleCancellation: true,
        duration: 30
      },
      'Quarterly': {
        discountPercentage: 15,
        freeUpgrades: 3,
        prioritySupport: true,
        flexibleCancellation: true,
        duration: 90
      },
      'Annual': {
        discountPercentage: 25,
        freeUpgrades: 12,
        prioritySupport: true,
        flexibleCancellation: true,
        duration: 365
      }
    };
    
    const benefits = planBenefits[planType];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + benefits.duration);
    
    loyalty.subscriptionPlan = {
      type: planType,
      startDate: startDate,
      endDate: endDate,
      benefits: {
        discountPercentage: benefits.discountPercentage,
        freeUpgrades: benefits.freeUpgrades,
        prioritySupport: benefits.prioritySupport,
        flexibleCancellation: benefits.flexibleCancellation
      }
    };
    
    await loyalty.save();
    
    res.send({
      success: true,
      loyalty,
      message: `Successfully subscribed to ${planType} plan!`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Validate referral code
router.post("/validate-referral", async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;
    
    const referrer = await LoyaltyProgram.findOne({ referralCode });
    
    if (!referrer) {
      return res.status(404).send({ 
        success: false, 
        message: "Invalid referral code" 
      });
    }
    
    // Add bonus points to referrer
    referrer.points += 500;
    referrer.referredUsers.push(newUserId);
    await referrer.save();
    
    // Give bonus to new user
    const newUserLoyalty = new LoyaltyProgram({
      user: newUserId,
      points: 200,
      tier: 'Bronze'
    });
    await newUserLoyalty.save();
    
    res.send({
      success: true,
      message: "Referral applied! You received 200 bonus points!",
      loyalty: newUserLoyalty
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get available rewards
router.get("/rewards", async (req, res) => {
  try {
    const rewards = [
      { id: 1, name: "10% Off Next Booking", points: 500, type: "Discount" },
      { id: 2, name: "Free Car Upgrade", points: 1000, type: "Upgrade" },
      { id: 3, name: "Free Additional Driver", points: 300, type: "Service" },
      { id: 4, name: "Free GPS Device", points: 200, type: "Equipment" },
      { id: 5, name: "25% Off Weekend Rental", points: 800, type: "Discount" },
      { id: 6, name: "Priority Customer Support", points: 400, type: "Service" },
      { id: 7, name: "Free Car Wash", points: 150, type: "Service" },
      { id: 8, name: "Late Return (2 hours free)", points: 350, type: "Time" }
    ];
    
    res.send(rewards);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
