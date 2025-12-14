const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'rentcars_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  // Input validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide username and password"
    });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Check password - support both hashed and plain text (for backward compatibility)
    let isMatch = false;
    if (user.password.startsWith('$2')) {
      // Password is hashed
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (legacy)
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (excluding password) and token
    const userResponse = {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: userResponse,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during login"
    });
  }
});

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide username and password"
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long"
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email: email || '',
      role: "user"
    });

    await newUser.save();

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { 
        id: newUser._id, 
        username: newUser.username, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Username already exists"
      });
    }
    
    return res.status(500).json({
      success: false,
      error: "Server error during registration"
    });
  }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Profile error:", error);
    return res.status(401).json({
      success: false,
      error: "Invalid token"
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const { email, currentPassword, newPassword } = req.body;
    const updateFields = {};

    if (email) updateFields.email = email;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: "Current password required to change password"
        });
      }

      const user = await User.findById(decoded.id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Current password is incorrect"
        });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error updating profile"
    });
  }
});

module.exports = router;
