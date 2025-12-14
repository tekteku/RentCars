import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Statistic, Progress, Timeline, Tag, Avatar, List } from "antd";
import {
  CarOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RocketOutlined,
  StarOutlined,
  FireOutlined,
  CrownOutlined
} from "@ant-design/icons";
import DefaultLayout from "../components/DefaultLayout";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    loyaltyPoints: 0,
    tier: 'Bronze',
    carbonSaved: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    
    if (userData) {
      fetchUserStats(userData._id);
    }
  }, []);

  const fetchUserStats = async (userId) => {
    try {
      const loyaltyResponse = await axios.get(`${BASE_URL}/api/loyalty/details/${userId}`);
      if (loyaltyResponse.data) {
        setStats({
          totalBookings: loyaltyResponse.data.totalBookings || 0,
          loyaltyPoints: loyaltyResponse.data.points || 0,
          tier: loyaltyResponse.data.tier || 'Bronze',
          carbonSaved: Math.floor(loyaltyResponse.data.totalBookings * 12.5) // Estimated
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const features = [
    {
      icon: <ThunderboltOutlined style={{ fontSize: '40px', color: '#667eea' }} />,
      title: "AI Recommendations",
      description: "Get personalized car suggestions powered by machine learning",
      link: "/",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      badge: "NEW"
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
      title: "Rewards & Loyalty",
      description: `You're ${stats.tier} tier with ${stats.loyaltyPoints} points!`,
      link: "/loyalty",
      color: "linear-gradient(135deg, #fa8c16 0%, #ffd666 100%)",
      badge: "HOT"
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: '40px', color: '#52c41a' }} />,
      title: "Trip Planner",
      description: "AI-powered route planning with carbon footprint tracking",
      link: "/trip-planner",
      color: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
      badge: "ECO"
    },
    {
      icon: <TeamOutlined style={{ fontSize: '40px', color: '#13c2c2' }} />,
      title: "Social Booking",
      description: "Split costs and share rides with friends",
      link: "/",
      color: "linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)",
      badge: "SOCIAL"
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '40px', color: '#eb2f96' }} />,
      title: "Car Health Monitor",
      description: "Real-time IoT monitoring and virtual inspections",
      link: "/",
      color: "linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)",
      badge: "SMART"
    },
    {
      icon: <RocketOutlined style={{ fontSize: '40px', color: '#722ed1' }} />,
      title: "Subscription Plans",
      description: "Save up to 25% with monthly subscriptions",
      link: "/loyalty",
      color: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
      badge: "SAVE"
    }
  ];

  const benefits = [
    { icon: "🤖", text: "AI-Powered Smart Recommendations" },
    { icon: "💰", text: "Dynamic Pricing & Best Deals" },
    { icon: "🏆", text: "5-Tier Loyalty Rewards Program" },
    { icon: "🌍", text: "Carbon Footprint Tracking" },
    { icon: "👥", text: "Social Group Bookings" },
    { icon: "📱", text: "Real-Time Car Monitoring" },
    { icon: "🗺️", text: "AI Trip Planning Assistant" },
    { icon: "🎁", text: "Exclusive Member Benefits" },
    { icon: "⚡", text: "Instant 24/7 AI Support" },
    { icon: "🔒", text: "Virtual Safety Inspections" }
  ];

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 40px',
        borderRadius: '30px',
        marginBottom: '40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '900',
            marginBottom: '20px',
            textShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <RocketOutlined /> Welcome to the Future of Car Rental
          </h1>
          <p style={{ fontSize: '22px', marginBottom: '40px', opacity: 0.95 }}>
            Experience revolutionary features powered by AI, IoT, and Social Technology
          </p>

          {user ? (
            <Row gutter={[24, 24]} justify="center" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <Col xs={24} sm={12} md={6}>
                <Card style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '20px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'white', opacity: 0.9 }}>Total Bookings</span>}
                    value={stats.totalBookings}
                    valueStyle={{ color: 'white', fontSize: '32px', fontWeight: '800' }}
                    prefix={<CarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '20px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'white', opacity: 0.9 }}>Loyalty Points</span>}
                    value={stats.loyaltyPoints}
                    valueStyle={{ color: 'white', fontSize: '32px', fontWeight: '800' }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '20px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'white', opacity: 0.9 }}>Member Tier</span>}
                    value={stats.tier}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: '800' }}
                    prefix={<CrownOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '20px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'white', opacity: 0.9 }}>CO₂ Saved (kg)</span>}
                    value={stats.carbonSaved}
                    valueStyle={{ color: 'white', fontSize: '32px', fontWeight: '800' }}
                    prefix={<EnvironmentOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          ) : (
            <div>
              <Link to="/register">
                <Button
                  size="large"
                  style={{
                    height: '60px',
                    fontSize: '18px',
                    fontWeight: '700',
                    borderRadius: '15px',
                    marginRight: '15px',
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    padding: '0 40px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="large"
                  style={{
                    height: '60px',
                    fontSize: '18px',
                    fontWeight: '700',
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid white',
                    padding: '0 40px'
                  }}
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Revolutionary Features Grid */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <FireOutlined /> Revolutionary Features
        </h2>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Link to={feature.link}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '25px',
                    border: '2px solid #e8e8e8',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    animation: `slideInUp 0.6s ease ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {feature.badge && (
                    <Tag
                      color={
                        feature.badge === 'NEW' ? 'blue' :
                        feature.badge === 'HOT' ? 'red' :
                        feature.badge === 'ECO' ? 'green' : 'purple'
                      }
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        fontWeight: '700',
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: 'none'
                      }}
                    >
                      {feature.badge}
                    </Tag>
                  )}

                  <div style={{
                    background: feature.color,
                    borderRadius: '20px',
                    padding: '30px',
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}>
                    <div style={{ color: 'white' }}>
                      {feature.icon}
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#1a202c'
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    fontSize: '15px',
                    color: '#718096',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Why Choose Us */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        padding: '60px 40px',
        borderRadius: '30px',
        marginBottom: '60px'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: '50px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <StarOutlined /> Why Choose MyCars?
        </h2>

        <Row gutter={[24, 24]}>
          {benefits.map((benefit, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <div style={{
                textAlign: 'center',
                padding: '25px 15px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>
                  {benefit.icon}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  {benefit.text}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 40px',
        borderRadius: '30px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: '900',
          marginBottom: '20px'
        }}>
          Ready to Experience the Future?
        </h2>
        <p style={{
          fontSize: '20px',
          marginBottom: '40px',
          opacity: 0.95
        }}>
          Join thousands of satisfied customers and start your journey today
        </p>
        <Link to="/">
          <Button
            size="large"
            style={{
              height: '60px',
              fontSize: '18px',
              fontWeight: '700',
              borderRadius: '15px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0 50px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
          >
            <CarOutlined /> Browse Cars Now
          </Button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </DefaultLayout>
  );
}

export default Dashboard;
