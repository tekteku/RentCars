import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Checkbox, Progress, Divider, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../redux/actions/userActions";
import { UserOutlined, LockOutlined, UserAddOutlined, CheckCircleOutlined, MailOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import AOS from "aos";
import Spinner from "../components/Spinner";

import "aos/dist/aos.css";
AOS.init();

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading } = useSelector((state) => state.alertsReducer);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [form] = Form.useForm();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      history.push('/');
    }
  }, [history]);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return '#ff4d4f';
    if (passwordStrength < 60) return '#fa8c16';
    if (passwordStrength < 80) return '#1890ff';
    return '#52c41a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  function onFinish(values) {
    if (values.password !== values.cpassword) {
      message.error("Passwords do not match!");
      return;
    }
    if (!agreeTerms) {
      message.error("Please agree to the Terms & Conditions");
      return;
    }
    dispatch(userRegister({
      username: values.username,
      password: values.password,
      email: values.email
    }));
  }

  return (
    <div className="login">
      {loading && <Spinner message="Creating your account..." />}
      <Row gutter={16} className="d-flex align-items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Col lg={12} md={12} sm={24} xs={24} style={{ position: "relative", height: '750px' }}>
          <img
            data-aos="slide-left"
            data-aos-duration="1000"
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
            alt="Luxury Car"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '30px 0 0 30px'
            }}
          />
          <div className="login-logo">
            <h1>MyCars</h1>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Premium Car Rental</p>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24} className="text-left">
          <div className="login-Form" style={{ padding: '40px 50px' }}>
            <div data-aos='fade-up' data-aos-duration='800'>
              <h1 style={{ marginBottom: '10px', fontSize: '32px' }}>
                <UserAddOutlined style={{ marginRight: '10px' }} />
                Create Account
              </h1>
              <p style={{ fontSize: '16px', color: '#718096', marginBottom: '25px' }}>
                Join us and start your journey with premium car rentals
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              data-aos='fade-up'
              data-aos-duration='1000'
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: 'Please enter your username' },
                  { min: 3, message: 'Username must be at least 3 characters' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#667eea' }} />}
                  placeholder='Choose a unique username'
                  size='large'
                  autoComplete='username'
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email (Optional)"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined style={{ color: '#667eea' }} />}
                  placeholder='Enter your email address'
                  size='large'
                  autoComplete='email'
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#667eea' }} />}
                  placeholder='Create a strong password'
                  size='large'
                  autoComplete='new-password'
                  onChange={(e) => {
                    setPasswordStrength(calculatePasswordStrength(e.target.value));
                    const cpassword = form.getFieldValue('cpassword');
                    if (cpassword) {
                      setPasswordMatch(e.target.value === cpassword);
                    }
                  }}
                />
              </Form.Item>

              {passwordStrength > 0 && (
                <div style={{ marginTop: '-15px', marginBottom: '15px' }}>
                  <Progress 
                    percent={passwordStrength} 
                    showInfo={false} 
                    strokeColor={getPasswordStrengthColor()}
                    size="small"
                  />
                  <span style={{ fontSize: '12px', color: getPasswordStrengthColor() }}>
                    Password strength: {getPasswordStrengthText()}
                  </span>
                </div>
              )}

              <Form.Item
                name="cpassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<CheckCircleOutlined style={{ color: passwordMatch === true ? '#52c41a' : passwordMatch === false ? '#ff4d4f' : '#667eea' }} />}
                  placeholder='Confirm your password'
                  size='large'
                  autoComplete='new-password'
                  onChange={(e) => {
                    const password = form.getFieldValue('password');
                    setPasswordMatch(password === e.target.value);
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Checkbox 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                >
                  I agree to the <a href="#" style={{ color: '#667eea' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#667eea' }}>Privacy Policy</a>
                </Checkbox>
              </Form.Item>

              <button 
                className="btn1" 
                style={{ width: '100%', height: '50px' }}
                disabled={loading || !agreeTerms}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <Divider style={{ margin: '20px 0', color: '#a0aec0' }}>
                or sign up with
              </Divider>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <button 
                  type='button'
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => alert('Google signup coming soon!')}
                >
                  <GoogleOutlined style={{ fontSize: '20px', color: '#ea4335' }} />
                  Google
                </button>
                <button 
                  type='button'
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => alert('GitHub signup coming soon!')}
                >
                  <GithubOutlined style={{ fontSize: '20px' }} />
                  GitHub
                </button>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '15px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '15px'
              }}>
                <p style={{ margin: '0', color: '#4a5568' }}>
                  Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>Login here</Link>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
