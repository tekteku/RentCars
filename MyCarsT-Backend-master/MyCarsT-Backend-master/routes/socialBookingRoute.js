const express = require("express");
const router = express.Router();
const SocialBooking = require("../models/socialBookingModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

// Create a social/group booking
router.post("/create", async (req, res) => {
  try {
    const { mainBookingId, organizer, participants, totalAmount, splitType } = req.body;
    
    const socialBooking = new SocialBooking({
      mainBooking: mainBookingId,
      organizer: organizer,
      participants: participants,
      totalAmount: totalAmount,
      splitType: splitType
    });
    
    // Calculate split amounts
    if (splitType === 'Equal') {
      const splitAmount = totalAmount / (participants.length + 1); // +1 for organizer
      socialBooking.participants = participants.map(p => ({
        user: p.user,
        shareAmount: splitAmount,
        status: 'Invited'
      }));
    } else {
      socialBooking.participants = participants;
    }
    
    await socialBooking.save();
    
    res.send({
      success: true,
      socialBooking,
      message: "Group booking created successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get social booking details
router.get("/:bookingId", async (req, res) => {
  try {
    const socialBooking = await SocialBooking.findById(req.params.bookingId)
      .populate('mainBooking')
      .populate('organizer')
      .populate('participants.user');
    
    res.send(socialBooking);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get user's social bookings
router.get("/user/:userId", async (req, res) => {
  try {
    const socialBookings = await SocialBooking.find({
      $or: [
        { organizer: req.params.userId },
        { 'participants.user': req.params.userId }
      ]
    })
    .populate('mainBooking')
    .populate('organizer')
    .populate('participants.user')
    .sort({ createdAt: -1 });
    
    res.send(socialBookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Respond to invitation
router.post("/respond", async (req, res) => {
  try {
    const { bookingId, userId, status } = req.body;
    
    const socialBooking = await SocialBooking.findById(bookingId);
    
    const participant = socialBooking.participants.find(
      p => p.user.toString() === userId
    );
    
    if (!participant) {
      return res.status(404).send({
        success: false,
        message: "Participant not found"
      });
    }
    
    participant.status = status;
    participant.respondedDate = new Date();
    
    await socialBooking.save();
    
    res.send({
      success: true,
      socialBooking,
      message: `Invitation ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Record payment from participant
router.post("/record-payment", async (req, res) => {
  try {
    const { bookingId, userId, amount, paymentId } = req.body;
    
    const socialBooking = await SocialBooking.findById(bookingId);
    
    const participant = socialBooking.participants.find(
      p => p.user.toString() === userId
    );
    
    if (!participant) {
      return res.status(404).send({
        success: false,
        message: "Participant not found"
      });
    }
    
    participant.paidAmount += amount;
    participant.paymentId = paymentId;
    
    if (participant.paidAmount >= participant.shareAmount) {
      participant.status = 'Paid';
    }
    
    socialBooking.amountPaid += amount;
    
    // Update payment status
    if (socialBooking.amountPaid >= socialBooking.totalAmount) {
      socialBooking.paymentStatus = 'Complete';
    } else if (socialBooking.amountPaid > 0) {
      socialBooking.paymentStatus = 'Partial';
    }
    
    await socialBooking.save();
    
    res.send({
      success: true,
      socialBooking,
      message: "Payment recorded successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add message to group chat
router.post("/chat/message", async (req, res) => {
  try {
    const { bookingId, userId, message } = req.body;
    
    const socialBooking = await SocialBooking.findById(bookingId);
    
    socialBooking.groupChat.push({
      user: userId,
      message: message,
      timestamp: new Date()
    });
    
    await socialBooking.save();
    
    const populatedBooking = await SocialBooking.findById(bookingId)
      .populate('groupChat.user', 'username firstName lastName');
    
    res.send({
      success: true,
      chat: populatedBooking.groupChat,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get chat messages
router.get("/chat/:bookingId", async (req, res) => {
  try {
    const socialBooking = await SocialBooking.findById(req.params.bookingId)
      .populate('groupChat.user', 'username firstName lastName profileImage');
    
    res.send(socialBooking.groupChat);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add carpool pickup point
router.post("/carpool/add-pickup", async (req, res) => {
  try {
    const { bookingId, pickupPoint } = req.body;
    
    const socialBooking = await SocialBooking.findById(bookingId);
    
    if (!socialBooking.carPooling.isCarPool) {
      socialBooking.carPooling.isCarPool = true;
    }
    
    socialBooking.carPooling.pickupPoints.push(pickupPoint);
    
    await socialBooking.save();
    
    res.send({
      success: true,
      socialBooking,
      message: "Pickup point added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update booking rules
router.post("/update-rules", async (req, res) => {
  try {
    const { bookingId, rules } = req.body;
    
    const socialBooking = await SocialBooking.findById(bookingId);
    socialBooking.rules = { ...socialBooking.rules, ...rules };
    
    await socialBooking.save();
    
    res.send({
      success: true,
      socialBooking,
      message: "Rules updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
