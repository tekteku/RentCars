const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

// Initialize Stripe with error handling
let stripe;
try {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.warn("Stripe not configured. Payment processing will be unavailable.");
}

/**
 * @route   POST /api/bookings/bookCar
 * @desc    Create a new car booking with payment
 * @access  Private
 */
router.post("/booKCar", async (req, res) => {
  try {
    const { user, car, totalHours, totalAmount, driverRequire, bookedTimeSlots, token } = req.body;

    // Validate required fields
    if (!user || !car || !totalHours || !totalAmount || !bookedTimeSlots) {
      return res.status(400).json({
        success: false,
        error: "Missing required booking information"
      });
    }

    // Validate time slots
    if (!bookedTimeSlots.from || !bookedTimeSlots.to) {
      return res.status(400).json({
        success: false,
        error: "Invalid time slots"
      });
    }

    // Check if car exists
    const carDoc = await Car.findById(car);
    if (!carDoc) {
      return res.status(404).json({
        success: false,
        error: "Car not found"
      });
    }

    // Check if user exists
    const userDoc = await User.findById(user);
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Check for time slot conflicts
    const hasConflict = carDoc.bookedTimeSlots.some(slot => {
      const existingFrom = new Date(slot.from);
      const existingTo = new Date(slot.to);
      const newFrom = new Date(bookedTimeSlots.from);
      const newTo = new Date(bookedTimeSlots.to);
      
      return (newFrom < existingTo && newTo > existingFrom);
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        error: "Car is not available for the selected time slot"
      });
    }

    let payment = null;
    let transactionId = `BOOK-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Process payment if Stripe is configured and token provided
    if (stripe && token?.email) {
      try {
        payment = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: "eur",
          receipt_email: token.email,
          description: `Car rental: ${carDoc.name} for ${totalHours} hours`,
          metadata: {
            carId: car,
            userId: user,
            hours: totalHours.toString()
          }
        });
        transactionId = payment.id;
      } catch (stripeError) {
        console.error("Stripe payment error:", stripeError);
        return res.status(402).json({
          success: false,
          error: "Payment processing failed. Please try again."
        });
      }
    }

    // Create booking
    const newBooking = new Booking({
      user,
      car,
      totalHours,
      totalAmount,
      driverRequire: driverRequire || false,
      bookedTimeSlots,
      transactionId,
      status: 'confirmed'
    });

    await newBooking.save();

    // Update car's booked time slots
    carDoc.bookedTimeSlots.push(bookedTimeSlots);
    await carDoc.save();

    // Populate car details for response
    const populatedBooking = await Booking.findById(newBooking._id).populate('car');

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully!",
      data: {
        booking: populatedBooking,
        payment: payment ? {
          id: payment.id,
          status: payment.status,
          amount: payment.amount / 100
        } : null
      }
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process booking. Please try again."
    });
  }
});

/**
 * @route   GET /api/bookings/getAllBookings
 * @desc    Get all bookings (Admin) or user's bookings
 * @access  Private
 */
router.get("/getAllBookings", async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = {};
    if (userId) filter.user = userId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("car")
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings"
    });
  }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("user", "username email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch booking details"
    });
  }
});

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: "Booking is already cancelled"
      });
    }

    // Check if booking can be cancelled (e.g., not started yet)
    const bookingStart = new Date(booking.bookedTimeSlots.from);
    if (bookingStart < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Cannot cancel a booking that has already started"
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    // Remove time slot from car
    const car = await Car.findById(booking.car);
    if (car) {
      car.bookedTimeSlots = car.bookedTimeSlots.filter(slot => 
        slot.from !== booking.bookedTimeSlots.from || 
        slot.to !== booking.bookedTimeSlots.to
      );
      await car.save();
    }

    // TODO: Process refund via Stripe if applicable

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel booking"
    });
  }
});

/**
 * @route   GET /api/bookings/user/:userId
 * @desc    Get all bookings for a specific user
 * @access  Private
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user bookings"
    });
  }
});

module.exports = router;