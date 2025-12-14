const mongoose = require("mongoose");

const socialBookingSchema = new mongoose.Schema(
  {
    mainBooking: { type: mongoose.Schema.Types.ObjectId, ref: "bookings", required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    participants: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      status: { type: String, enum: ['Invited', 'Accepted', 'Declined', 'Paid'], default: 'Invited' },
      shareAmount: { type: Number },
      paidAmount: { type: Number, default: 0 },
      paymentId: String,
      invitedDate: { type: Date, default: Date.now },
      respondedDate: Date
    }],
    splitType: { 
      type: String, 
      enum: ['Equal', 'Custom', 'PerDay'], 
      default: 'Equal' 
    },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Partial', 'Complete'], 
      default: 'Pending' 
    },
    groupChat: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }],
    carPooling: {
      isCarPool: { type: Boolean, default: false },
      pickupPoints: [{
        address: String,
        latitude: Number,
        longitude: Number,
        time: Date,
        passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
      }]
    },
    rules: {
      smokingAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      musicPreference: String,
      additionalNotes: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("socialBooking", socialBookingSchema);
