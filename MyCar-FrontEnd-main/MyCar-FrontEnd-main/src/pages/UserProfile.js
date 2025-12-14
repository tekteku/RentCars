import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Tabs, Statistic, Progress, Tag, Timeline, Button, Form, Input, Upload, message } from 'antd';
import { UserOutlined, TrophyOutlined, CarOutlined, EnvironmentOutlined, StarOutlined, UploadOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import moment from 'moment';

const { TabPane } = Tabs;

function UserProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    carbonSaved: 0,
    favoriteCarType: 'SUV'
  });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    form.setFieldsValue(userData);
    fetchUserStats();
    fetchBookingHistory();
  }, []);

  const fetchUserStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5000/api/users/stats/${userData._id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('http://localhost:5000/api/bookings/getallbookings', {
        userId: userData._id
      });
      setBookingHistory(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(`http://localhost:5000/api/users/update/${userData._id}`, values);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      message.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      message.error('Failed to update profile');
    }
    setLoading(false);
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('Avatar uploaded successfully');
    }
  };

  return (
    <DefaultLayout>
      <div style={{ padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        {/* Profile Header */}
        <Card 
          style={{ 
            marginBottom: '30px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  marginBottom: '15px'
                }}
              />
              <Upload onChange={handleAvatarUpload}>
                <Button icon={<UploadOutlined />} size="small">Change Avatar</Button>
              </Upload>
            </Col>
            <Col xs={24} sm={18}>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                {user.username}
              </h1>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '15px' }}>
                {user.email}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Tag color="purple" style={{ fontSize: '14px', padding: '5px 15px' }}>
                  <TrophyOutlined /> Gold Member
                </Tag>
                <Tag color="green" style={{ fontSize: '14px', padding: '5px 15px' }}>
                  <StarOutlined /> Verified Driver
                </Tag>
                <Tag color="blue" style={{ fontSize: '14px', padding: '5px 15px' }}>
                  <EnvironmentOutlined /> Eco Warrior
                </Tag>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Stats Cards */}
        <Row gutter={16} style={{ marginBottom: '30px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '15px', background: '#fff' }}>
              <Statistic
                title="Total Bookings"
                value={stats.totalBookings}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#667eea' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '15px', background: '#fff' }}>
              <Statistic
                title="Total Spent"
                value={stats.totalSpent}
                prefix="€"
                precision={2}
                valueStyle={{ color: '#764ba2' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '15px', background: '#fff' }}>
              <Statistic
                title="Loyalty Points"
                value={stats.loyaltyPoints}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#f39c12' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '15px', background: '#fff' }}>
              <Statistic
                title="Carbon Saved"
                value={stats.carbonSaved}
                suffix="kg CO₂"
                valueStyle={{ color: '#27ae60' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Card 
          style={{ 
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Tabs defaultActiveKey="1" size="large">
            {/* Profile Info Tab */}
            <TabPane tab="Profile Information" key="1">
              <div style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2>Personal Details</h2>
                  <Button 
                    type={editMode ? 'primary' : 'default'}
                    icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                    onClick={() => editMode ? form.submit() : setEditMode(true)}
                  >
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  disabled={!editMode}
                >
                  <Form.Item label="Username" name="username">
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input size="large" type="email" />
                  </Form.Item>
                  <Form.Item label="Phone" name="phone">
                    <Input size="large" placeholder="+1 234 567 8900" />
                  </Form.Item>
                  <Form.Item label="Address" name="address">
                    <Input.TextArea rows={3} size="large" />
                  </Form.Item>
                  <Form.Item label="Driver License" name="driverLicense">
                    <Input size="large" placeholder="License Number" />
                  </Form.Item>
                </Form>
              </div>
            </TabPane>

            {/* Booking History Tab */}
            <TabPane tab="Booking History" key="2">
              <Timeline mode="left">
                {bookingHistory.slice(0, 10).map((booking, index) => (
                  <Timeline.Item 
                    key={index}
                    color={booking.status === 'completed' ? 'green' : 'blue'}
                    label={moment(booking.createdAt).format('MMM DD, YYYY')}
                  >
                    <Card size="small" hoverable>
                      <h4>{booking.car?.name}</h4>
                      <p>Duration: {booking.totalHours} hours</p>
                      <p>Amount: €{booking.totalAmount}</p>
                      <Tag color={booking.status === 'completed' ? 'success' : 'processing'}>
                        {booking.status}
                      </Tag>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TabPane>

            {/* Achievements Tab */}
            <TabPane tab="Achievements" key="3">
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <Card hoverable style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <TrophyOutlined style={{ fontSize: '48px', color: '#f39c12', marginBottom: '10px' }} />
                    <h3>Early Adopter</h3>
                    <p>One of the first users!</p>
                    <Progress percent={100} status="success" />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card hoverable style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <EnvironmentOutlined style={{ fontSize: '48px', color: '#27ae60', marginBottom: '10px' }} />
                    <h3>Eco Warrior</h3>
                    <p>Reduced 100kg CO₂</p>
                    <Progress percent={75} status="active" />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card hoverable style={{ textAlign: 'center', borderRadius: '15px' }}>
                    <StarOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '10px' }} />
                    <h3>5 Star Renter</h3>
                    <p>Perfect rating streak</p>
                    <Progress percent={60} />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            {/* Preferences Tab */}
            <TabPane tab="Preferences" key="4">
              <h3>Rental Preferences</h3>
              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col span={12}>
                  <Card>
                    <h4>Favorite Car Types</h4>
                    <div style={{ marginTop: '10px' }}>
                      <Tag color="blue">SUV</Tag>
                      <Tag color="purple">Sedan</Tag>
                      <Tag color="green">Electric</Tag>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <h4>Budget Range</h4>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                      €30 - €100 per day
                    </p>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </DefaultLayout>
  );
}

export default UserProfile;
