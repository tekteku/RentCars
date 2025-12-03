import React from "react";
import { Menu, Dropdown, Button, Space, Row, Col, Avatar, Badge } from "antd";
import { Link } from "react-router-dom";
import { 
  UserOutlined, 
  LogoutOutlined, 
  LoginOutlined, 
  UserAddOutlined,
  DashboardOutlined,
  CarOutlined,
  CalendarOutlined,
  SettingOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  HeartOutlined,
  SwapOutlined,
  ProfileOutlined
} from "@ant-design/icons";

function DefaultLayout(props) {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    } catch (error) {}
  }, []);

  const menu = (
    <Menu style={{
      borderRadius: '15px',
      padding: '10px',
      minWidth: '220px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(102, 126, 234, 0.1)'
    }}>
      <Menu.Item 
        key="home"
        icon={<CarOutlined style={{ color: '#667eea' }} />}
        style={{ borderRadius: '10px', margin: '5px 0' }}
      >
        <Link to="/">Home</Link>
      </Menu.Item>
      
      {user ? (
        <>
          <Menu.Item 
            key="profile"
            icon={<ProfileOutlined style={{ color: '#667eea' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/profile">My Profile</Link>
          </Menu.Item>
          
          <Menu.Item 
            key="bookings"
            icon={<CalendarOutlined style={{ color: '#667eea' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/userbookings">My Bookings</Link>
          </Menu.Item>
          
          <Menu.Item 
            key="favorites"
            icon={<HeartOutlined style={{ color: '#ff4d4f' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/favorites">Favorites</Link>
          </Menu.Item>
          
          <Menu.Item 
            key="compare"
            icon={<SwapOutlined style={{ color: '#1890ff' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/compare">Compare Cars</Link>
          </Menu.Item>
          
          <Menu.Item 
            key="loyalty"
            icon={<TrophyOutlined style={{ color: '#fa8c16' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/loyalty">Rewards & Loyalty</Link>
          </Menu.Item>
          
          <Menu.Item 
            key="tripplanner"
            icon={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/trip-planner">Trip Planner</Link>
          </Menu.Item>
          
          {user?.role === "admin" && (
            <>
              <Menu.Divider />
              <Menu.Item 
                key="admin"
                icon={<DashboardOutlined style={{ color: '#764ba2' }} />}
                style={{ borderRadius: '10px', margin: '5px 0', background: 'rgba(102, 126, 234, 0.05)' }}
              >
                <Link to="/admin">Admin Dashboard</Link>
              </Menu.Item>
              <Menu.Item 
                key="addcar"
                icon={<CarOutlined style={{ color: '#764ba2' }} />}
                style={{ borderRadius: '10px', margin: '5px 0', background: 'rgba(102, 126, 234, 0.05)' }}
              >
                <Link to="/addcar">Add Car</Link>
              </Menu.Item>
            </>
          )}
          
          <Menu.Divider />
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined style={{ color: '#f5576c' }} />}
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            style={{ borderRadius: '10px', margin: '5px 0', color: '#f5576c' }}
          >
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item 
            key="login"
            icon={<LoginOutlined style={{ color: '#667eea' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item 
            key="register"
            icon={<UserAddOutlined style={{ color: '#667eea' }} />}
            style={{ borderRadius: '10px', margin: '5px 0' }}
          >
            <Link to="/register">Register</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <div>
      <div className="header bs1">
        <Row gutter={16} justify="space-between" align="middle">
          <Col lg={18} md={16} sm={12} xs={12}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
                }}>
                  <CarOutlined style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: '32px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  MyCars
                </h1>
              </div>
            </Link>
          </Col>
          
          <Col lg={6} md={8} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 20px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(102, 126, 234, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                {user && (
                  <span style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    color: '#1a202c',
                    display: window.innerWidth > 768 ? 'block' : 'none'
                  }}>
                    {user.username}
                  </span>
                )}
                <Badge dot={user ? true : false} color="#667eea">
                  <Avatar 
                    size="large" 
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                  />
                </Badge>
              </div>
            </Dropdown>
          </Col>
        </Row>
      </div>
      
      <div className="content">{props.children}</div>
      
      {/* Footer */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '40px 20px',
        marginTop: '60px',
        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
        textAlign: 'center'
      }}>
        <Row gutter={[32, 32]} justify="center">
          <Col lg={8} md={12} sm={24} xs={24}>
            <h3 style={{ color: '#1a202c', marginBottom: '15px' }}>About MyCars</h3>
            <p style={{ color: '#718096' }}>
              Your premium car rental service. Experience luxury and comfort on every journey.
            </p>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <h3 style={{ color: '#1a202c', marginBottom: '15px' }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/" style={{ color: '#667eea', fontWeight: '600' }}>Home</Link>
              {user && <Link to="/userbookings" style={{ color: '#667eea', fontWeight: '600' }}>My Bookings</Link>}
              {user?.role === "admin" && <Link to="/admin" style={{ color: '#667eea', fontWeight: '600' }}>Admin Panel</Link>}
            </div>
          </Col>
          <Col lg={8} md={12} sm={24} xs={24}>
            <h3 style={{ color: '#1a202c', marginBottom: '15px' }}>Contact</h3>
            <p style={{ color: '#718096' }}>
              📧 support@mycars.com<br />
              📞 +1 (555) 123-4567<br />
              🕒 24/7 Support
            </p>
          </Col>
        </Row>
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <p style={{ color: '#718096', margin: 0 }}>
            © 2025 MyCars. All rights reserved. Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
