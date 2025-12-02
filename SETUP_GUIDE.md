# MyCars - Car Rental Application

A full-stack MERN (MongoDB, Express, React, Node.js) car rental application with Stripe payment integration.

## 📋 Project Structure

The project consists of two main parts:
- **Frontend**: React application (`MyCar-FrontEnd-main/MyCar-FrontEnd-main/`)
- **Backend**: Node.js/Express API (`MyCarsT-Backend-master/MyCarsT-Backend-master/`)

## 🚀 Quick Start Guide

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (for database) OR local MongoDB
- [Stripe Account](https://stripe.com/) (for payments)

### 📦 Installation

All dependencies have been installed! If you need to reinstall them:

**Backend:**
```powershell
cd "c:\Users\TaherCh\Downloads\projects\Cars Rental applications\MyCarsT-Backend-master\MyCarsT-Backend-master"
npm install
```

**Frontend:**
```powershell
cd "c:\Users\TaherCh\Downloads\projects\Cars Rental applications\MyCar-FrontEnd-main\MyCar-FrontEnd-main"
npm install
```

### ⚙️ Configuration

#### Backend Configuration

1. The backend `.env` file has been created with your MongoDB connection string
2. **Important**: Update the `.env` file if needed:
   - `MONGODB_URI`: Your MongoDB connection string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys))
   - `PORT`: Server port (default: 5000)

#### Frontend Configuration

The frontend `.env` file is configured to connect to `http://localhost:5000`

## 🏃 Running the Application

### Step 1: Start the Backend Server

Open a PowerShell terminal and run:

```powershell
cd "c:\Users\TaherCh\Downloads\projects\Cars Rental applications\MyCarsT-Backend-master\MyCarsT-Backend-master"
npm start
```

You should see: `Node JS Server Started in Port 5000` and `Mongo DB Connection successfull`

### Step 2: Start the Frontend Application

Open a **NEW** PowerShell terminal and run:

```powershell
cd "c:\Users\TaherCh\Downloads\projects\Cars Rental applications\MyCar-FrontEnd-main\MyCar-FrontEnd-main"
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 👤 User Accounts

### Creating an Admin Account

The application has two types of users:
- **Regular Users**: Can browse and book cars
- **Admin Users**: Can add, edit, and delete cars

To create an admin account, you need to manually update a user in MongoDB:

1. Register a normal account through the application
2. Go to your MongoDB Atlas dashboard
3. Navigate to your `Cars` database → `users` collection
4. Find your user and click "Edit"
5. Change the `role` field from `"user"` to `"admin"`
6. Save the changes
7. Log out and log back in

### Test User Credentials

You can create your own accounts through the registration page.

## 🔧 Features

- **User Authentication**: Register and login system
- **Car Browsing**: View available cars with filtering by date
- **Booking System**: Book cars for specific time periods
- **Payment Integration**: Stripe payment processing
- **Admin Dashboard**: Add, edit, and delete cars (admin only)
- **User Dashboard**: View your bookings
- **Email Notifications**: Booking confirmation emails via EmailJS

## 📱 Application Pages

- **Home (`/`)**: Browse available cars
- **Login (`/login`)**: User login
- **Register (`/register`)**: User registration
- **Booking (`/booking/:carid`)**: Book a specific car
- **User Bookings (`/userbookings`)**: View your bookings
- **Admin Dashboard (`/admin`)**: Manage cars (admin only)
- **Add Car (`/addcar`)**: Add new car (admin only)
- **Edit Car (`/editcar/:carid`)**: Edit car details (admin only)

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct in `.env`
- Make sure port 5000 is not already in use
- Verify all backend dependencies are installed

### Frontend won't start
- Make sure backend is running first
- Check if `.env` has correct `REACT_APP_PUBLIC_URL`
- Clear browser cache and restart

### Cannot login/register
- Verify backend is running and connected to MongoDB
- Check browser console for errors
- Make sure MongoDB is accessible

### Payment not working
- Verify Stripe secret key is correct in backend `.env`
- Use Stripe test card numbers for testing: `4242 4242 4242 4242`

## 🔑 Stripe Test Cards

For testing payments, use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## 📝 Notes

- This is a development setup. For production, you'll need to build the frontend and deploy both applications
- The MongoDB connection string in `.env` contains your credentials - keep it secure!
- Stripe key in the code is in test mode - get your own keys for production

## 🛠️ Technology Stack

**Frontend:**
- React 17
- Redux (State Management)
- Ant Design (UI Components)
- Axios (HTTP Client)
- React Router (Routing)
- Stripe Checkout (Payments)
- EmailJS (Email Service)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Stripe (Payment Processing)
- CORS

## 📧 Support

If you encounter any issues, check:
1. All dependencies are installed
2. Both frontend and backend are running
3. MongoDB connection is successful
4. Environment variables are correctly set

## 🎉 You're All Set!

Your car rental application is now ready to use. Start by:
1. Starting the backend server
2. Starting the frontend application
3. Registering a new account
4. Browsing and booking cars!

For admin features, don't forget to update your user role in MongoDB to "admin".
