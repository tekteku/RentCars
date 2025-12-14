const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user', 'owner'] },
  
  // Extended Profile
  email: { type: String },
  phone: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: Date },
  profileImage: { type: String },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // License Information
  driverLicense: {
    number: String,
    expiryDate: Date,
    issuingCountry: String,
    verified: { type: Boolean, default: false }
  },
  
  // Verification
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  identityVerified: { type: Boolean, default: false },
  
  // Preferences & Settings
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  language: { type: String, default: 'en' },
  currency: { type: String, default: 'eur' },
  
  // Social Features
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Payment Methods (tokenized)
  savedPaymentMethods: [{
    type: { type: String, enum: ['Card', 'PayPal', 'ApplePay', 'GooglePay'] },
    last4: String,
    brand: String,
    tokenId: String,
    isDefault: { type: Boolean, default: false }
  }],
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspensionReason: String,
  
  // Timestamps
  lastLogin: { type: Date },
  accountCreated: { type: Date, default: Date.now }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
