import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Input, Modal, List, Avatar, Tag, Badge, Divider } from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  MessageOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';

function SocialBooking({ bookingId, userId, totalAmount }) {
  const [socialBooking, setSocialBooking] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (bookingId) {
      getSocialBookingDetails();
    }
  }, [bookingId]);

  const getSocialBookingDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/social-booking/${bookingId}`);
      setSocialBooking(response.data);
    } catch (error) {
      console.error("Error fetching social booking:", error);
    }
  };

  const createSocialBooking = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/social-booking/create`, {
        mainBookingId: bookingId,
        organizer: userId,
        participants: [],
        totalAmount: totalAmount,
        splitType: 'Equal'
      });
      
      if (response.data.success) {
        setSocialBooking(response.data.socialBooking);
        alert("Group booking created! Start inviting friends.");
      }
    } catch (error) {
      console.error("Error creating social booking:", error);
    }
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    try {
      const response = await axios.post(`${BASE_URL}/api/social-booking/chat/message`, {
        bookingId: socialBooking._id,
        userId: userId,
        message: chatMessage
      });
      
      if (response.data.success) {
        setChatMessages(response.data.chat);
        setChatMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const loadChatMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/social-booking/chat/${socialBooking._id}`);
      setChatMessages(response.data);
      setShowChatModal(true);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  if (!socialBooking) {
    return (
      <Card
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '2px dashed #667eea',
          textAlign: 'center',
          padding: '40px'
        }}
      >
        <TeamOutlined style={{ fontSize: '60px', color: '#667eea', marginBottom: '20px' }} />
        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
          Split the Cost with Friends!
        </h3>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '25px' }}>
          Turn your rental into a group adventure. Share the ride, split the cost.
        </p>
        <Button
          type="primary"
          size="large"
          icon={<TeamOutlined />}
          onClick={createSocialBooking}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '15px',
            height: '50px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Create Group Booking
        </Button>
      </Card>
    );
  }

  const calculateSplitAmount = () => {
    const totalParticipants = socialBooking.participants.length + 1; // +1 for organizer
    return (socialBooking.totalAmount / totalParticipants).toFixed(2);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: '700' }}>
            <TeamOutlined style={{ marginRight: '10px', color: '#667eea' }} />
            Group Booking
          </span>
        }
        extra={
          <Tag color={
            socialBooking.paymentStatus === 'Complete' ? 'success' :
            socialBooking.paymentStatus === 'Partial' ? 'processing' : 'default'
          }>
            {socialBooking.paymentStatus}
          </Tag>
        }
        style={{
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        {/* Payment Overview */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '25px',
          borderRadius: '15px',
          color: 'white',
          marginBottom: '25px'
        }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>
                  Total Amount
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>
                  €{socialBooking.totalAmount}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9', marginBottom: '5px' }}>
                  Your Share
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>
                  €{calculateSplitAmount()}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', opacity: 0.9', marginBottom: '5px' }}>
                  Participants
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>
                  {socialBooking.participants.length + 1}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Participants List */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
              Participants ({socialBooking.participants.length + 1})
            </h4>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setShowInviteModal(true)}
              style={{
                borderRadius: '10px',
                background: '#52c41a',
                border: 'none'
              }}
            >
              Invite Friends
            </Button>
          </div>

          <List
            dataSource={[
              { isOrganizer: true, status: 'Paid' },
              ...socialBooking.participants
            ]}
            renderItem={(participant, index) => (
              <List.Item
                style={{
                  padding: '15px',
                  background: index % 2 === 0 ? '#f9f9f9' : 'white',
                  borderRadius: '10px',
                  marginBottom: '8px'
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        background: participant.isOrganizer ? '#667eea' : '#52c41a',
                        fontSize: '18px'
                      }}
                    >
                      {participant.isOrganizer ? 'O' : 'P'}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '600' }}>
                        {participant.isOrganizer ? 'You (Organizer)' : participant.user?.username || 'Invited User'}
                      </span>
                      {participant.isOrganizer && (
                        <Tag color="purple">Organizer</Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <span style={{ marginRight: '15px' }}>
                        <DollarOutlined /> €{calculateSplitAmount()}
                      </span>
                      {participant.status === 'Paid' ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>Paid</Tag>
                      ) : participant.status === 'Accepted' ? (
                        <Tag color="processing">Accepted</Tag>
                      ) : participant.status === 'Declined' ? (
                        <Tag color="error" icon={<CloseCircleOutlined />}>Declined</Tag>
                      ) : (
                        <Tag color="default">Invited</Tag>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        {/* Group Chat */}
        <div style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '15px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
              <MessageOutlined style={{ marginRight: '8px', color: '#667eea' }} />
              Group Chat
            </h4>
            <Badge count={chatMessages.length} showZero color="#667eea" />
          </div>
          <Button
            block
            size="large"
            icon={<MessageOutlined />}
            onClick={loadChatMessages}
            style={{
              borderRadius: '12px',
              height: '50px',
              fontWeight: '600',
              background: 'white',
              borderColor: '#667eea',
              color: '#667eea'
            }}
          >
            Open Group Chat
          </Button>
        </div>

        {/* Booking Rules */}
        {socialBooking.rules && (
          <div style={{ marginTop: '25px' }}>
            <Divider>Booking Rules</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Tag color={socialBooking.rules.smokingAllowed ? 'success' : 'error'}>
                  Smoking: {socialBooking.rules.smokingAllowed ? 'Allowed' : 'Not Allowed'}
                </Tag>
              </Col>
              <Col span={12}>
                <Tag color={socialBooking.rules.petsAllowed ? 'success' : 'error'}>
                  Pets: {socialBooking.rules.petsAllowed ? 'Allowed' : 'Not Allowed'}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Chat Modal */}
      <Modal
        title="Group Chat"
        visible={showChatModal}
        onCancel={() => setShowChatModal(false)}
        footer={null}
        width={600}
      >
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          marginBottom: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '12px'
        }}>
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: msg.user._id === userId ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <Avatar style={{
                  background: msg.user._id === userId ? '#667eea' : '#52c41a'
                }}>
                  {msg.user.username?.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  background: msg.user._id === userId ? '#667eea' : 'white',
                  color: msg.user._id === userId ? 'white' : '#333',
                  borderRadius: '15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '5px',
                    opacity: msg.user._id === userId ? 0.9 : 0.7
                  }}>
                    {msg.user.username}
                  </div>
                  <div>{msg.message}</div>
                  <div style={{
                    fontSize: '10px',
                    marginTop: '5px',
                    opacity: 0.7
                  }}>
                    {moment(msg.timestamp).format('HH:mm')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            size="large"
            placeholder="Type your message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onPressEnter={sendMessage}
            style={{ borderRadius: '12px' }}
          />
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={sendMessage}
            style={{
              borderRadius: '12px',
              background: '#667eea',
              border: 'none'
            }}
          >
            Send
          </Button>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        title="Invite Friends"
        visible={showInviteModal}
        onCancel={() => setShowInviteModal(false)}
        footer={null}
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Share the booking link or enter email addresses to invite friends
          </p>
          <Input
            size="large"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ marginBottom: '15px', borderRadius: '10px' }}
          />
          <Button
            type="primary"
            block
            size="large"
            style={{
              borderRadius: '12px',
              background: '#52c41a',
              border: 'none',
              height: '50px',
              fontWeight: '600'
            }}
          >
            Send Invitation
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default SocialBooking;
