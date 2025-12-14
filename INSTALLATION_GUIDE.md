# 🚀 Quick Setup Guide - Revolutionary Car Rental App

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Code editor (VS Code recommended)

---

## 🎯 Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd MyCarsT-Backend-master/MyCarsT-Backend-master

# Install dependencies
npm install

# Install additional revolutionary packages (if needed)
npm install dotenv uuid
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/mycars
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mycars

# Stripe Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Email Service (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Seed initial data (optional)
node seedCars.js
```

### 4. Start Backend Server

```bash
# Development mode
npm start

# Or with nodemon (for auto-restart)
npm install -g nodemon
nodemon server.js
```

Server will start at: `http://localhost:5000`

---

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd MyCar-FrontEnd-main/MyCar-FrontEnd-main

# Install dependencies
npm install

# Install additional UI packages (if needed)
npm install antd axios moment react-redux redux redux-thunk
```

### 6. Frontend Environment

Create a `.env` file in the frontend directory:

```env
REACT_APP_PUBLIC_URL=http://localhost:5000
```

### 7. Start Frontend Application

```bash
npm start
```

Application will open at: `http://localhost:3000`

---

## 🎨 Default Admin Account

Create an admin user manually in MongoDB or through registration:

```javascript
{
  "username": "admin",
  "password": "admin123",
  "role": "admin",
  "email": "admin@mycars.com"
}
```

---

## 📦 Package Dependencies

### Backend Packages
```json
{
  "express": "^4.17.1",
  "mongoose": "^6.0.13",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "stripe": "^8.195.0",
  "uuid": "^8.3.2",
  "body-parser": "^1.19.1",
  "nodemon": "^2.0.15"
}
```

### Frontend Packages
```json
{
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "react-router-dom": "^5.3.0",
  "antd": "^4.17.1",
  "axios": "^0.24.0",
  "moment": "^2.29.1",
  "redux": "^4.1.2",
  "react-redux": "^7.2.6",
  "redux-thunk": "^2.4.0",
  "react-stripe-checkout": "^2.6.3",
  "aos": "^2.3.4"
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Verify connection string in .env
# Make sure MONGO_URI is correct
```

#### 2. Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in server.js
const port = process.env.PORT || 5001;
```

#### 3. CORS Error
Already configured in server.js:
```javascript
app.use(cors());
```

#### 4. Stripe Payment Issues
```bash
# Use test keys from Stripe Dashboard
# Test Card: 4242 4242 4242 4242
# Expiry: Any future date
# CVC: Any 3 digits
```

#### 5. OpenSSL Legacy Provider Error (React)
Already fixed in package.json:
```json
"start": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts start"
```

---

## 🧪 Testing the Revolutionary Features

### 1. AI Recommendations
1. Register/Login as a user
2. Browse cars on home page
3. View personalized recommendations
4. Check recommendation scores

### 2. Loyalty Program
1. Login to your account
2. Navigate to "Rewards & Loyalty"
3. View your tier and points
4. Explore rewards catalog

### 3. Trip Planner
1. Go to "Trip Planner" in menu
2. Create a new trip
3. Enter start and destination
4. Generate AI route
5. View carbon footprint

### 4. Social Booking
1. Make a booking
2. Create group booking
3. Invite friends
4. Use group chat
5. Split payments

### 5. Car Health Monitoring
1. Admin: View car health status
2. Check IoT metrics
3. Add inspection reports
4. Monitor alerts

---

## 📱 Application Structure

```
RentCars-main/
│
├── MyCarsT-Backend-master/
│   ├── models/           # 10+ Mongoose models
│   ├── routes/           # 10+ API route files
│   ├── server.js         # Express server
│   ├── db.js            # MongoDB connection
│   └── .env             # Environment variables
│
└── MyCar-FrontEnd-main/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── redux/        # State management
    │   └── App.js        # Main app component
    └── public/           # Static files
```

---

## 🌐 API Endpoints Overview

### Base URL: `http://localhost:5000/api`

#### Authentication
- POST `/users/register` - User registration
- POST `/users/login` - User login

#### Cars
- GET `/cars/getallcars` - Get all cars
- POST `/cars/addcar` - Add car (admin)
- POST `/cars/editcar` - Edit car (admin)
- POST `/cars/deletecar` - Delete car (admin)

#### Bookings
- POST `/bookings/booKCar` - Create booking
- GET `/bookings/getAllBookings` - Get bookings

#### Revolutionary APIs
- POST `/recommendations/recommendations` - AI recommendations
- GET `/loyalty/details/:userId` - Loyalty info
- POST `/trip-plan/create` - Create trip
- POST `/social-booking/create` - Group booking
- GET `/car-health/:carId` - Car health status
- POST `/support/create` - Support ticket

---

## 🎯 Features Checklist

✅ AI-Powered Recommendations
✅ Dynamic Pricing System
✅ 5-Tier Loyalty Program
✅ Trip Planner with Carbon Tracking
✅ Social/Group Bookings
✅ Real-time Car Health (IoT)
✅ Virtual Inspections
✅ AI Support System
✅ Subscription Plans
✅ Referral Program
✅ Multi-Currency Support
✅ Advanced Search & Filters
✅ Real-time Notifications
✅ Responsive Design

---

## 🔐 Security Features

- JWT Authentication
- Password encryption (recommended: bcrypt)
- Stripe secure payments
- CORS protection
- Input validation
- XSS protection
- Role-based access control

---

## 📊 Performance Optimization

- Redux for state management
- Lazy loading components
- Image optimization
- API caching
- Database indexing
- CDN for static assets

---

## 🚀 Deployment Guide

### Backend Deployment (Heroku/Railway/Render)

```bash
# 1. Create Procfile
web: node server.js

# 2. Set environment variables
# Add MONGO_URI, STRIPE_SECRET_KEY, etc.

# 3. Push to deployment
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

```bash
# 1. Build production
npm run build

# 2. Set environment variables
REACT_APP_PUBLIC_URL=https://your-backend.com

# 3. Deploy
vercel deploy
```

---

## 📞 Support

If you encounter any issues:

1. Check console logs (browser & server)
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Review API endpoints

---

## 🎉 You're Ready!

Visit `http://localhost:3000` and experience the future of car rental!

### Quick Test Flow:
1. ✅ Register a new account
2. ✅ Browse cars with AI recommendations
3. ✅ Book a car
4. ✅ Check loyalty dashboard
5. ✅ Create a trip plan
6. ✅ Explore all revolutionary features!

**Happy Coding! 🚗💨**
