import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tag, Badge, Tooltip, Button, Rate, Progress } from "antd";
import {
  ThunderboltOutlined,
  StarOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  CarOutlined,
  HeartOutlined,
  HeartFilled
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';

function CarRecommendations({ userId, tripType, passengers, duration }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (userId) {
      getRecommendations();
    }
  }, [userId, tripType, passengers]);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/recommendations/recommendations`, {
        userId,
        tripType: tripType || 'Leisure',
        passengers: passengers || 1,
        duration
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    setLoading(false);
  };

  const toggleFavorite = (carId) => {
    if (favorites.includes(carId)) {
      setFavorites(favorites.filter(id => id !== carId));
    } else {
      setFavorites([...favorites, carId]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        animation: 'fadeIn 0.8s ease'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          <ThunderboltOutlined /> AI-Powered Recommendations
        </h2>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Personalized car suggestions based on your preferences and history
        </p>
      </div>

      <Row gutter={[24, 24]}>
        {recommendations.map((car, index) => (
          <Col lg={8} md={12} sm={24} xs={24} key={car._id}>
            <Card
              hoverable
              className="recommendation-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: index === 0 ? '3px solid #667eea' : '1px solid #e0e0e0',
                position: 'relative',
                animation: `slideInUp 0.6s ease ${index * 0.1}s both`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    alt={car.name}
                    src={car.image}
                    style={{
                      height: '220px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {index === 0 && (
                    <Badge.Ribbon text="Top Pick" color="#667eea" />
                  )}
                  <Button
                    shape="circle"
                    icon={favorites.includes(car._id) ? <HeartFilled /> : <HeartOutlined />}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      color: favorites.includes(car._id) ? '#ff4d4f' : '#666'
                    }}
                    onClick={() => toggleFavorite(car._id)}
                  />
                  {car.recommendationScore && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {car.recommendationScore}% Match
                    </div>
                  )}
                </div>
              }
            >
              <div style={{ padding: '10px' }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: '#2c3e50'
                }}>
                  {car.name}
                </h3>

                <div style={{ marginBottom: '15px' }}>
                  <Rate
                    disabled
                    defaultValue={car.averageRating || 4.5}
                    style={{ fontSize: '16px' }}
                  />
                  <span style={{ marginLeft: '8px', color: '#666' }}>
                    ({car.totalReviews || 0} reviews)
                  </span>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  fontSize: '13px',
                  color: '#667eea',
                  fontWeight: '600'
                }}>
                  <ThunderboltOutlined /> {car.recommendationReason}
                </div>

                <Row gutter={[8, 8]} style={{ marginBottom: '15px' }}>
                  <Col span={12}>
                    <Tag color="blue" icon={<CarOutlined />}>
                      {car.carType || 'Sedan'}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Tag color="green">
                      {car.fuelType || 'Petrol'}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Tag icon={<SafetyOutlined />}>
                      {car.capacity || 5} Seats
                    </Tag>
                  </Col>
                  {car.ecoRating >= 7 && (
                    <Col span={12}>
                      <Tag color="success" icon={<EnvironmentOutlined />}>
                        Eco-Friendly
                      </Tag>
                    </Col>
                  )}
                </Row>

                {car.ecoRating && (
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                      fontSize: '12px'
                    }}>
                      <span>Eco Rating</span>
                      <span style={{ fontWeight: 'bold' }}>{car.ecoRating}/10</span>
                    </div>
                    <Progress
                      percent={car.ecoRating * 10}
                      strokeColor={{
                        '0%': '#52c41a',
                        '100%': '#73d13d',
                      }}
                      showInfo={false}
                      strokeWidth={8}
                    />
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '15px'
                }}>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#667eea' }}>
                      €{car.rentPerHour}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>per hour</div>
                  </div>
                  <Link to={`/booking/${car._id}`}>
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        height: '45px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        .recommendation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}

export default CarRecommendations;
