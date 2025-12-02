# 🚗 MyCars - Revolutionary Car Rental Platform

<div align="center">

![MyCars Logo](https://img.shields.io/badge/MyCars-Revolutionary-667eea?style=for-the-badge&logo=car&logoColor=white)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

**The Future of Car Rental - AI-Powered, Social, and Eco-Conscious**

[Features](#-revolutionary-features) • [Installation](#-quick-start) • [Documentation](#-documentation) • [API](#-api-reference)

</div>

---

## 🌟 What Makes This Revolutionary?

MyCars isn't just another car rental platform - it's a **complete reimagination** of how car rental should work in the modern era. We've implemented **10 revolutionary features** that don't exist in any other rental service:

<div align="center">

| 🤖 AI Recommendations | 🏆 5-Tier Loyalty | 🗺️ AI Trip Planner |
|:---:|:---:|:---:|
| **👥 Social Bookings** | **🔧 IoT Monitoring** | **🌍 Carbon Tracking** |
| **💰 Dynamic Pricing** | **📸 Virtual Inspection** | **🎧 24/7 AI Support** |

</div>

---

## ✨ Revolutionary Features

### 1. 🤖 AI-Powered Car Recommendations
- Personalized suggestions based on your preferences and history
- Smart scoring algorithm (0-100% match)
- Trip type awareness (Business, Leisure, Family, Adventure)
- Budget-conscious recommendations
- Learn and improve with each booking

### 2. 🏆 5-Tier Loyalty & Rewards Program
- **Bronze → Silver → Gold → Platinum → Diamond**
- Earn 1 point per € spent
- Redeemable rewards catalog
- Referral program with bonus points
- Subscription plans (save up to 25%)
- Achievement badges & gamification

### 3. 🗺️ AI-Powered Trip Planner
- Smart route generation
- Real-time weather forecasts
- Carbon footprint calculation
- Budget estimation (fuel, tolls, parking, food)
- EV charging station recommendations
- Scenic route options

### 4. 👥 Social Car Sharing & Group Bookings
- Split payments among friends
- Group chat for coordination
- Carpooling integration
- Custom cost splitting
- Booking rules (smoking, pets, music)

### 5. 🔧 Real-time Car Health Monitoring (IoT)
- GPS location tracking
- Fuel/battery level monitoring
- Tire pressure alerts
- Engine diagnostics
- Maintenance scheduling
- Health score (0-100%)

### 6. 📸 Virtual Car Inspection System
- Photo-based pre/post rental inspection
- AI damage detection
- Condition rating
- Dispute resolution with evidence
- Historical records

### 7. 🌍 Carbon Footprint Tracking
- Real-time CO₂ emission calculation
- Comparison with public transport
- Eco-friendly car recommendations
- Carbon offset purchase option
- Environmental rewards

### 8. 💰 Dynamic Smart Pricing
- Real-time price adjustments
- Demand-based pricing
- Weather multipliers
- Seasonal variations
- Loyalty member discounts

### 9. 🎧 24/7 AI-Powered Support
- Instant AI chatbot responses
- Intelligent ticket routing
- Priority support for members
- Automated suggestions
- Real-time tracking

### 10. 🧠 User Preference Learning
- Automatic preference tracking
- No manual setup required
- Learns from each booking
- Budget pattern analysis
- Eco-consciousness scoring

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js v14+ • MongoDB • npm/yarn
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd RentCars-main

# Backend Setup
cd MyCarsT-Backend-master/MyCarsT-Backend-master
npm install
# Create .env file (see INSTALLATION_GUIDE.md)
npm start

# Frontend Setup (new terminal)
cd MyCar-FrontEnd-main/MyCar-FrontEnd-main
npm install
npm start
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017/mycars

For detailed setup instructions, see [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Payment:** Stripe
- **Authentication:** JWT (ready)

### Frontend
- **Framework:** React.js v17
- **UI Library:** Ant Design
- **State Management:** Redux + Thunk
- **Routing:** React Router v5
- **HTTP Client:** Axios
- **AOS** for scroll animations
- **Stripe Checkout** for payments

### Backend
- **Node.js** v22.21.1
- **Express** 4.17.1
- **MongoDB** with Mongoose 6.0.13
- **Stripe** API for payments
- **CORS** enabled
- **dotenv** for environment variables

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v22.21.1 or higher)
- **MongoDB** (v8.2.2 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/tekteku/RentCars.git
cd RentCars
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd MyCarsT-Backend-master/MyCarsT-Backend-master

# Install dependencies
npm install

# Create .env file
echo MONGODB_URI=mongodb://localhost:27017/Cars > .env
echo PORT=5000 >> .env
echo STRIPE_SECRET_KEY=your_stripe_secret_key >> .env

# Seed the database with sample cars
node seedCars.js

# Start the backend server
npm start
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd MyCar-FrontEnd-main/MyCar-FrontEnd-main

# Install dependencies
npm install

# Create .env file
echo REACT_APP_PUBLIC_URL=http://localhost:5000 > .env

# Start the frontend server
npm start
```

The frontend will run on **http://localhost:3000**

### 4. Start MongoDB

```bash
# Windows (PowerShell)
mongod --dbpath "C:\data\db"

# macOS/Linux
mongod --dbpath /data/db
```

## 📁 Project Structure

```
RentCars/
├── MyCar-FrontEnd-main/
│   └── MyCar-FrontEnd-main/
│       ├── public/
│       ├── src/
│       │   ├── components/     # Reusable components
│       │   ├── pages/          # Page components
│       │   ├── redux/          # Redux store, actions, reducers
│       │   ├── services/       # API services
│       │   ├── App.js
│       │   └── index.css       # Global styles
│       ├── package.json
│       └── .env
│
└── MyCarsT-Backend-master/
    └── MyCarsT-Backend-master/
        ├── models/             # Mongoose models
        ├── routes/             # API routes
        ├── db.js               # Database configuration
        ├── server.js           # Express server
        ├── seedCars.js         # Database seeding script
        ├── package.json
        └── .env
```

## 🔑 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/Cars
PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### Frontend (.env)
```env
REACT_APP_PUBLIC_URL=http://localhost:5000
NODE_OPTIONS=--openssl-legacy-provider
```

## 🎯 API Endpoints

### Cars
- `GET /api/cars/getallcars` - Get all cars
- `POST /api/cars/addcar` - Add new car (Admin)
- `PUT /api/cars/editcar` - Edit car (Admin)
- `DELETE /api/cars/deletecar` - Delete car (Admin)

### Bookings
- `POST /api/bookings/bookcar` - Book a car
- `GET /api/bookings/getallbookings` - Get all bookings
- `GET /api/bookings/getuserbookings` - Get user's bookings

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

## 👤 User Roles

### Regular User
- Browse available cars
- Search and filter cars
- Book cars for specific dates
- View booking history
- Make payments via Stripe

### Admin
- All user capabilities
- Add new cars
- Edit existing cars
- Delete cars
- View all bookings
- Manage user accounts

## 💾 Database Schema

### Car Model
```javascript
{
  name: String,
  image: String,
  capacity: Number,
  fuelType: String,
  bookedTimeSlots: Array,
  rentPerHour: Number
}
```

### User Model
```javascript
{
  username: String,
  password: String (hashed),
  role: String (default: "user")
}
```

### Booking Model
```javascript
{
  car: ObjectId (ref: Car),
  user: ObjectId (ref: User),
  bookedTimeSlots: Object,
  totalHours: Number,
  totalAmount: Number,
  transactionId: String
}
```

## 🎨 UI Features

- **Glassmorphism Effects** - Frosted glass design with backdrop blur
- **Gradient Backgrounds** - Ocean blue to teal color scheme
- **Smooth Animations** - Float, pulse, shimmer, and ripple effects
- **Responsive Cards** - Hover effects and lift animations
- **Modern Typography** - Poppins and Inter fonts
- **Loading States** - Skeleton loaders and spinners
- **Form Validation** - Real-time input validation
- **Toast Notifications** - Success and error messages

## 🧪 Testing

To test the payment system, use Stripe's test card:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## 📦 Sample Data

The `seedCars.js` script populates the database with 12 premium cars:
- Tesla Model S
- BMW M5
- Mercedes C-Class
- Audi A6
- Porsche 911
- Range Rover Sport
- Lamborghini Huracan
- Toyota Camry
- Ford Mustang
- Honda Civic
- Jeep Wrangler
- Ferrari 488

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify .env file exists with correct values

### Frontend won't start
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

### MongoDB connection issues
- Verify MongoDB service is running
- Check MongoDB URI in .env
- Ensure database directory exists

### OpenSSL error
- Add `NODE_OPTIONS=--openssl-legacy-provider` to .env
- Or downgrade to Node.js v16

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Taher**
- GitHub: [@tekteku](https://github.com/tekteku)

## 🙏 Acknowledgments

- Ant Design for the UI components
- Stripe for payment processing
- Unsplash for car images
- MongoDB for the database solution

## 📧 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

Made with ❤️ by Taher
