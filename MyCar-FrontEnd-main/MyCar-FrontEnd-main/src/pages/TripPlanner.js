import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Input, Select, DatePicker, Tag, List, Divider, Modal, Timeline } from "antd";
import {
  EnvironmentOutlined,
  CarOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  DollarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';
const { TextArea } = Input;
const { Option } = Select;

function TripPlanner({ userId, bookingId }) {
  const [tripPlans, setTripPlans] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [routeSuggestion, setRouteSuggestion] = useState(null);
  
  const [formData, setFormData] = useState({
    tripName: '',
    startLocation: { address: '' },
    destination: { address: '' },
    tripType: 'RoundTrip',
    carType: 'Sedan'
  });

  useEffect(() => {
    if (userId) {
      getUserTripPlans();
    }
  }, [userId]);

  const getUserTripPlans = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/trip-plan/user/${userId}`);
      setTripPlans(response.data);
    } catch (error) {
      console.error("Error fetching trip plans:", error);
    }
  };

  const createTripPlan = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/trip-plan/create`, {
        user: userId,
        booking: bookingId,
        ...formData
      });
      
      if (response.data.success) {
        alert("Trip plan created successfully!");
        getUserTripPlans();
        setShowCreateModal(false);
        resetForm();
      }
    } catch (error) {
      alert("Error creating trip plan");
    }
  };

  const generateRoute = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/trip-plan/generate-route`, {
        startLocation: formData.startLocation,
        destination: formData.destination,
        carType: formData.carType,
        preferences: {}
      });
      
      if (response.data.success) {
        setRouteSuggestion(response.data.route);
      }
    } catch (error) {
      console.error("Error generating route:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      tripName: '',
      startLocation: { address: '' },
      destination: { address: '' },
      tripType: 'RoundTrip',
      carType: 'Sedan'
    });
    setRouteSuggestion(null);
  };

  return (
    <div style={{ padding: '40px 20px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          <ThunderboltOutlined /> AI-Powered Trip Planner
        </h2>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Plan your perfect journey with smart route suggestions and real-time insights
        </p>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '15px',
            height: '50px',
            marginTop: '20px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Create New Trip Plan
        </Button>
      </div>

      {/* Trip Plans List */}
      <Row gutter={[24, 24]}>
        {tripPlans.map((plan) => (
          <Col xs={24} lg={12} key={plan._id}>
            <Card
              hoverable
              style={{
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid #e8e8e8'
              }}
              onClick={() => setSelectedPlan(plan)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '5px' }}>
                    {plan.tripName}
                  </h3>
                  <Tag color={
                    plan.status === 'Completed' ? 'success' :
                    plan.status === 'Active' ? 'processing' :
                    plan.status === 'Cancelled' ? 'error' : 'default'
                  }>
                    {plan.status}
                  </Tag>
                </div>
                <Tag color="blue">{plan.tripType}</Tag>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  padding: '10px',
                  background: '#f0f5ff',
                  borderRadius: '10px'
                }}>
                  <EnvironmentOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '10px' }} />
                  <span style={{ fontWeight: '600' }}>{plan.startLocation?.address || 'Start Location'}</span>
                </div>
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                  <CarOutlined style={{ fontSize: '24px', color: '#667eea' }} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  background: '#fff1f0',
                  borderRadius: '10px'
                }}>
                  <EnvironmentOutlined style={{ color: '#ff4d4f', fontSize: '20px', marginRight: '10px' }} />
                  <span style={{ fontWeight: '600' }}>{plan.destination?.address || 'Destination'}</span>
                </div>
              </div>

              {plan.estimatedDistance && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '10px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                        {plan.estimatedDistance}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>km</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '10px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#52c41a' }}>
                        {Math.floor(plan.estimatedDuration / 60)}h {plan.estimatedDuration % 60}m
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>duration</div>
                    </div>
                  </Col>
                </Row>
              )}

              {plan.carbonFootprint && (
                <div style={{
                  marginTop: '15px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(115, 209, 61, 0.1) 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CloudOutlined style={{ fontSize: '20px', color: '#52c41a', marginRight: '10px' }} />
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      CO₂ Footprint: <strong>{plan.carbonFootprint.estimatedCO2} kg</strong>
                    </span>
                  </div>
                  <Tag color="green">Eco-Friendly</Tag>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Trip Modal */}
      <Modal
        title={
          <span style={{ fontSize: '24px', fontWeight: '700' }}>
            <ThunderboltOutlined /> Create New Trip Plan
          </span>
        }
        visible={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => {
            setShowCreateModal(false);
            resetForm();
          }}>
            Cancel
          </Button>,
          <Button
            key="generate"
            onClick={generateRoute}
            style={{
              background: '#fa8c16',
              color: 'white',
              border: 'none'
            }}
          >
            Generate Route
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={createTripPlan}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Create Plan
          </Button>
        ]}
      >
        <div style={{ padding: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Trip Name *
              </label>
              <Input
                size="large"
                placeholder="e.g., Weekend Getaway"
                value={formData.tripName}
                onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
                style={{ borderRadius: '10px' }}
              />
            </Col>

            <Col span={24}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Start Location *
              </label>
              <Input
                size="large"
                placeholder="Enter start address"
                prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                value={formData.startLocation.address}
                onChange={(e) => setFormData({
                  ...formData,
                  startLocation: { address: e.target.value }
                })}
                style={{ borderRadius: '10px' }}
              />
            </Col>

            <Col span={24}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Destination *
              </label>
              <Input
                size="large"
                placeholder="Enter destination address"
                prefix={<EnvironmentOutlined style={{ color: '#ff4d4f' }} />}
                value={formData.destination.address}
                onChange={(e) => setFormData({
                  ...formData,
                  destination: { address: e.target.value }
                })}
                style={{ borderRadius: '10px' }}
              />
            </Col>

            <Col span={12}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Trip Type
              </label>
              <Select
                size="large"
                value={formData.tripType}
                onChange={(value) => setFormData({ ...formData, tripType: value })}
                style={{ width: '100%', borderRadius: '10px' }}
              >
                <Option value="OneWay">One Way</Option>
                <Option value="RoundTrip">Round Trip</Option>
                <Option value="MultiCity">Multi-City</Option>
              </Select>
            </Col>

            <Col span={12}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Car Type
              </label>
              <Select
                size="large"
                value={formData.carType}
                onChange={(value) => setFormData({ ...formData, carType: value })}
                style={{ width: '100%' }}
              >
                <Option value="Sedan">Sedan</Option>
                <Option value="SUV">SUV</Option>
                <Option value="Electric">Electric</Option>
                <Option value="Luxury">Luxury</Option>
              </Select>
            </Col>
          </Row>

          {/* Route Suggestion Display */}
          {routeSuggestion && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '15px',
              border: '2px solid #667eea'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>
                <ThunderboltOutlined style={{ color: '#667eea' }} /> AI-Generated Route Suggestion
              </h4>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: '10px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                      {routeSuggestion.estimatedDistance} km
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Distance</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: '10px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#52c41a' }}>
                      {Math.floor(routeSuggestion.estimatedDuration / 60)}h
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Duration</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: '10px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fa8c16' }}>
                      €{routeSuggestion.budget?.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Est. Budget</div>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ fontWeight: '600', marginBottom: '10px' }}>
                  <WarningOutlined style={{ color: '#fa8c16' }} /> Recommended Stops
                </h5>
                <List
                  size="small"
                  dataSource={routeSuggestion.recommendedStops || []}
                  renderItem={(stop) => (
                    <List.Item>
                      <Tag color={
                        stop.type === 'Gas' ? 'red' :
                        stop.type === 'Charging' ? 'green' :
                        stop.type === 'Food' ? 'orange' : 'blue'
                      }>
                        {stop.type}
                      </Tag>
                      <span style={{ marginLeft: '10px' }}>{stop.name}</span>
                    </List.Item>
                  )}
                />
              </div>

              {routeSuggestion.carbonFootprint && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(82, 196, 26, 0.1)',
                  borderRadius: '10px'
                }}>
                  <CloudOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <strong>Carbon Footprint:</strong> {routeSuggestion.carbonFootprint.estimatedCO2} kg CO₂
                  <br />
                  <small style={{ color: '#666' }}>
                    Offset cost: €{routeSuggestion.carbonFootprint.offsetCost}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default TripPlanner;
