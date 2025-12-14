import React, { Component } from "react";
import "./App.css";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingCar from "./pages/BookingCar";
import "antd/dist/antd.css";
import UserBookings from "./pages/UserBookings";
import AddCar from "./pages/AddCar";
import AdminHome from "./pages/AdminHome";
import EditCar from "./pages/EditCar";
import LoyaltyDashboard from "./pages/LoyaltyDashboard";
import TripPlanner from "./pages/TripPlanner";
import UserProfile from "./pages/UserProfile";
import Favorites from "./pages/Favorites";
import CompareVehicles from "./pages/CompareVehicles";

// Error Boundary Component for better error handling
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // You can log errors to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🚗</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Oops! Something went wrong</h2>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <ProtectedRoute path="/userbookings/" component={UserBookings} />
            <ProtectedRoute path="/booking/:carid" component={BookingCar} />
            <ProtectedRoute path="/loyalty" component={LoyaltyDashboard} />
            <ProtectedRoute path="/trip-planner" component={TripPlanner} />
            <ProtectedRoute path="/profile" component={UserProfile} />
            <ProtectedRoute path="/favorites" component={Favorites} />
            <Route path="/compare" component={CompareVehicles} />
            <ProtectedRouteAdmin path="/editcar/:carid" component={EditCar} />
            <ProtectedRouteAdmin path="/admin" component={AdminHome} />
            <ProtectedRouteAdmin path="/addcar" component={AddCar} />
            {/* 404 Not Found Route */}
            <Route path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

// 404 Not Found Component
function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '120px',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0'
      }}>404</h1>
      <h2 style={{ color: '#4a5568', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: '#718096', marginBottom: '30px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}
      >
        🏠 Go Home
      </a>
    </div>
  );
}

export default App;

export function ProtectedRoute(props) {
  if (localStorage.getItem("user")) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/login" />;
  }
}

export function ProtectedRouteAdmin(props) {
  const admin = JSON.parse(localStorage.getItem("user"));
  if (admin?.role === "admin") {
    return <Route {...props} />;
  } else {
    return <Redirect to="/" />;
  }
}
