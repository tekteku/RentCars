const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    ticketNumber: { type: String, unique: true },
    subject: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Booking', 'Payment', 'Car Issue', 'Account', 'Technical', 'Emergency', 'General'], 
      required: true 
    },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Urgent'], 
      default: 'Medium' 
    },
    status: { 
      type: String, 
      enum: ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'], 
      default: 'Open' 
    },
    description: { type: String, required: true },
    attachments: [String], // URLs to uploaded files
    conversation: [{
      sender: { type: String, enum: ['User', 'Support', 'AI'], required: true },
      message: String,
      timestamp: { type: Date, default: Date.now },
      attachments: [String]
    }],
    assignedTo: { type: String }, // Support agent name/ID
    relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: "bookings" },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      feedback: String,
      ratedAt: Date
    },
    aiSuggestions: [{
      suggestion: String,
      confidence: Number,
      timestamp: { type: Date, default: Date.now }
    }],
    resolutionTime: Number, // in minutes
    followUpRequired: { type: Boolean, default: false },
    followUpDate: Date
  },
  { timestamps: true }
);

// Generate unique ticket number before saving
supportTicketSchema.pre('save', function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = 'TICKET-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("supportTicket", supportTicketSchema);
