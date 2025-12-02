const express = require("express");
const router = express.Router();
const SupportTicket = require("../models/supportTicketModel");

// Create a new support ticket
router.post("/create", async (req, res) => {
  try {
    const ticket = new SupportTicket(req.body);
    await ticket.save();
    
    res.send({
      success: true,
      ticket,
      message: `Ticket ${ticket.ticketNumber} created successfully`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get all tickets for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.send(tickets);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get ticket by ID
router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.ticketId)
      .populate('user')
      .populate('relatedBooking');
    
    res.send(ticket);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get ticket by number
router.get("/number/:ticketNumber", async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ ticketNumber: req.params.ticketNumber })
      .populate('user')
      .populate('relatedBooking');
    
    res.send(ticket);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add message to conversation
router.post("/add-message", async (req, res) => {
  try {
    const { ticketId, sender, message, attachments } = req.body;
    
    const ticket = await SupportTicket.findById(ticketId);
    
    ticket.conversation.push({
      sender: sender,
      message: message,
      attachments: attachments || [],
      timestamp: new Date()
    });
    
    // Update status if user responds
    if (sender === 'User' && ticket.status === 'Waiting') {
      ticket.status = 'In Progress';
    }
    
    await ticket.save();
    
    res.send({
      success: true,
      ticket,
      message: "Message added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get AI suggestions for common issues
router.post("/ai-suggest", async (req, res) => {
  try {
    const { category, description } = req.body;
    
    // Simulate AI-powered suggestions
    const suggestions = generateAISuggestions(category, description);
    
    res.send({
      success: true,
      suggestions
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update ticket status
router.post("/update-status", async (req, res) => {
  try {
    const { ticketId, status, assignedTo } = req.body;
    
    const ticket = await SupportTicket.findById(ticketId);
    
    const oldStatus = ticket.status;
    ticket.status = status;
    
    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }
    
    // Calculate resolution time if resolved
    if (status === 'Resolved' && oldStatus !== 'Resolved') {
      const resolutionTime = Math.floor((new Date() - ticket.createdAt) / 60000); // in minutes
      ticket.resolutionTime = resolutionTime;
    }
    
    await ticket.save();
    
    res.send({
      success: true,
      ticket,
      message: "Ticket status updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Rate support experience
router.post("/rate", async (req, res) => {
  try {
    const { ticketId, score, feedback } = req.body;
    
    const ticket = await SupportTicket.findById(ticketId);
    
    ticket.rating = {
      score: score,
      feedback: feedback,
      ratedAt: new Date()
    };
    
    ticket.status = 'Closed';
    
    await ticket.save();
    
    res.send({
      success: true,
      ticket,
      message: "Thank you for your feedback!"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get all tickets (admin)
router.get("/admin/all", async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    
    const tickets = await SupportTicket.find(filter)
      .populate('user')
      .sort({ createdAt: -1 });
    
    res.send(tickets);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Helper function for AI suggestions
function generateAISuggestions(category, description) {
  const suggestionDatabase = {
    'Booking': [
      {
        suggestion: "Try modifying your dates or location for better availability",
        confidence: 0.85
      },
      {
        suggestion: "Check your email for booking confirmation",
        confidence: 0.90
      }
    ],
    'Payment': [
      {
        suggestion: "Verify your payment method is valid and has sufficient funds",
        confidence: 0.88
      },
      {
        suggestion: "Try using a different payment method",
        confidence: 0.82
      }
    ],
    'Car Issue': [
      {
        suggestion: "Contact our 24/7 roadside assistance at 1-800-HELP",
        confidence: 0.95
      },
      {
        suggestion: "Document the issue with photos for insurance purposes",
        confidence: 0.80
      }
    ],
    'Account': [
      {
        suggestion: "Try resetting your password using the 'Forgot Password' link",
        confidence: 0.90
      },
      {
        suggestion: "Clear your browser cache and try again",
        confidence: 0.75
      }
    ]
  };
  
  return suggestionDatabase[category] || [
    {
      suggestion: "Our support team will review your issue and respond shortly",
      confidence: 0.70
    }
  ];
}

module.exports = router;
