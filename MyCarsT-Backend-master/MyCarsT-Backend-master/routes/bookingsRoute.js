const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/booKCar", async (req, res) => {
  req.body.transactionId = "2020";
  const token = req.body;
  try {
    /* const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });

    const customer= await stripe.paymentIntents.create({
        email:token.email,
        source:token.id
    }); */
    const payment = await stripe.paymentIntents.create({
      amount: req.body.totalAmount * 100,
      currency: "eur",
      receipt_email: token.token.email,
    });
    if (payment) {
      
      const userInfo = await User.find({_id: token.user});


      req.body.transactionId = payment.id;
      const newbooking = new Booking(req.body);
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.car });
      

      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save(); 
     

      const result ={
        payment,
        newbooking
      }
      res.status(201).json(result)
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/getAllBookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car");
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
module.exports = router;
 //
 //