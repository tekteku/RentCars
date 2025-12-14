import React, { useState, useEffect } from "react";
import { Card, Row, Col, Progress, Button, Tag, Badge, Divider, Modal, Tabs } from "antd";
import {
  TrophyOutlined,
  GiftOutlined,
  CrownOutlined,
  ShareAltOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';
const { TabPane } = Tabs;

function LoyaltyDashboard({ userId }) {
  const [loyalty, setLoyalty] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    if (userId) {
      getLoyaltyDetails();
      getAvailableRewards();
    }
  }, [userId]);

  const getLoyaltyDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/loyalty/details/${userId}`);
      setLoyalty(response.data);
    } catch (error) {
      console.error("Error fetching loyalty details:", error);
    }
  };

  const getAvailableRewards = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/loyalty/rewards`);
      setRewards(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const redeemReward = async (reward) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/loyalty/redeem`, {
        userId,
        rewardType: reward.name,
        pointsCost: reward.points
      });
      
      if (response.data.success) {
        alert(response.data.message);
        getLoyaltyDetails();
        setShowRewardsModal(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to redeem reward");
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0',
      'Gold': '#ffd700',
      'Platinum': '#e5e4e2',
      'Diamond': '#b9f2ff'
    };
    return colors[tier] || '#667eea';
  };

  const getPointsToNextTier = () => {
    const tiers = {
      'Bronze': { next: 'Silver', required: 1000 },
      'Silver': { next: 'Gold', required: 2000 },
      'Gold': { next: 'Platinum', required: 3000 },
      'Platinum': { next: 'Diamond', required: 5000 },
      'Diamond': { next: 'Max Level', required: 0 }
    };
    return tiers[loyalty?.tier] || tiers['Bronze'];
  };

  if (!loyalty) return <div>Loading...</div>;

  const nextTier = getPointsToNextTier();
  const progressPercent = loyalty.tier === 'Diamond' ? 100 : 
    (loyalty.totalSpent / nextTier.required) * 100;

  return (
    <div style={{ padding: '40px 20px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(135deg, ${getTierColor(loyalty.tier)}20 0%, ${getTierColor(loyalty.tier)}40 100%)`,
        borderRadius: '30px',
        padding: '40px',
        marginBottom: '30px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '20px'
        }}>
          <CrownOutlined style={{ color: getTierColor(loyalty.tier) }} />
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          marginBottom: '10px',
          color: getTierColor(loyalty.tier)
        }}>
          {loyalty.tier} Member
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          You're doing amazing! Keep earning points and enjoy exclusive benefits.
        </p>
        
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={8}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#667eea' }}>
                {loyalty.points.toLocaleString()}
              </div>
              <div style={{ color: '#666', marginTop: '5px' }}>Points Balance</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#52c41a' }}>
                {loyalty.totalBookings}
              </div>
              <div style={{ color: '#666', marginTop: '5px' }}>Total Bookings</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#fa8c16' }}>
                €{loyalty.totalSpent.toLocaleString()}
              </div>
              <div style={{ color: '#666', marginTop: '5px' }}>Total Spent</div>
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* Progress to Next Tier */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ marginRight: '10px', color: '#667eea' }} />
                Tier Progress
              </span>
            }
            style={{
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            {loyalty.tier !== 'Diamond' ? (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  <span>{loyalty.tier}</span>
                  <span>{nextTier.next}</span>
                </div>
                <Progress
                  percent={Math.min(100, progressPercent)}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                  strokeWidth={15}
                  style={{ marginBottom: '15px' }}
                />
                <p style={{ textAlign: 'center', color: '#666' }}>
                  Spend €{(nextTier.required - loyalty.totalSpent).toFixed(2)} more to reach {nextTier.next} tier!
                </p>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <StarOutlined style={{ fontSize: '60px', color: '#ffd700', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Congratulations!</h3>
                <p style={{ color: '#666' }}>You've reached the highest tier!</p>
              </div>
            )}
          </Card>
        </Col>

        {/* Referral Program */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <ShareAltOutlined style={{ marginRight: '10px', color: '#52c41a' }} />
                Referral Program
              </span>
            }
            style={{
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>Your Referral Code</div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                letterSpacing: '3px',
                marginBottom: '10px'
              }}>
                {loyalty.referralCode}
              </div>
              <Button
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(loyalty.referralCode);
                  alert('Referral code copied!');
                }}
              >
                Copy Code
              </Button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
              Share your code and earn <strong>500 points</strong> for each friend who signs up!
            </p>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Tag color="green" style={{ fontSize: '14px', padding: '5px 15px' }}>
                {loyalty.referredUsers.length} Friends Referred
              </Tag>
            </div>
          </Card>
        </Col>

        {/* Badges */}
        <Col xs={24}>
          <Card
            title={
              <span>
                <StarOutlined style={{ marginRight: '10px', color: '#fa8c16' }} />
                Your Badges
              </span>
            }
            style={{
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Row gutter={[16, 16]}>
              {loyalty.badges.length > 0 ? (
                loyalty.badges.map((badge, index) => (
                  <Col xs={12} sm={8} md={6} key={index}>
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      borderRadius: '15px'
                    }}>
                      <Badge
                        count={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                        offset={[-10, 10]}
                      >
                        <div style={{
                          fontSize: '40px',
                          marginBottom: '10px'
                        }}>
                          🏆
                        </div>
                      </Badge>
                      <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {badge.description}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>
                        {moment(badge.earnedDate).format('MMM DD, YYYY')}
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    Complete your first booking to earn badges!
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </Col>

        {/* Rewards Catalog */}
        <Col xs={24}>
          <Card
            title={
              <span>
                <GiftOutlined style={{ marginRight: '10px', color: '#eb2f96' }} />
                Rewards Catalog
              </span>
            }
            extra={
              <Button
                type="primary"
                onClick={() => setShowRewardsModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                View All Rewards
              </Button>
            }
            style={{
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Row gutter={[16, 16]}>
              {rewards.slice(0, 4).map((reward) => (
                <Col xs={24} sm={12} md={6} key={reward.id}>
                  <div style={{
                    padding: '20px',
                    border: '2px solid #e8e8e8',
                    borderRadius: '15px',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎁</div>
                    <div style={{ fontWeight: '600', marginBottom: '10px' }}>
                      {reward.name}
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#667eea',
                      marginBottom: '10px'
                    }}>
                      {reward.points} pts
                    </div>
                    <Button
                      size="small"
                      disabled={loyalty.points < reward.points}
                      onClick={() => redeemReward(reward)}
                      style={{
                        borderRadius: '8px',
                        background: loyalty.points >= reward.points ? '#667eea' : '#e8e8e8',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      Redeem
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Rewards Modal */}
      <Modal
        title="All Available Rewards"
        visible={showRewardsModal}
        onCancel={() => setShowRewardsModal(false)}
        footer={null}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {rewards.map((reward) => (
            <Col xs={24} sm={12} key={reward.id}>
              <Card
                hoverable
                style={{
                  borderRadius: '15px',
                  border: loyalty.points >= reward.points ? '2px solid #52c41a' : '1px solid #e8e8e8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '5px' }}>{reward.name}</h4>
                    <Tag color={loyalty.points >= reward.points ? 'success' : 'default'}>
                      {reward.points} points
                    </Tag>
                  </div>
                  <Button
                    type="primary"
                    disabled={loyalty.points < reward.points}
                    onClick={() => redeemReward(reward)}
                    style={{
                      borderRadius: '10px',
                      background: loyalty.points >= reward.points ? '#52c41a' : undefined
                    }}
                  >
                    {loyalty.points >= reward.points ? 'Redeem' : 'Locked'}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
}

export default LoyaltyDashboard;
