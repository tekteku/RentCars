import React from "react";
import { Row, Col, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../redux/actions/userActions";
import { UserOutlined, LockOutlined, UserAddOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AOS from "aos";
import Spinner from "../components/Spinner";

import "aos/dist/aos.css";
AOS.init();

function Register() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  function onFinish(values) {
    if (values.password !== values.cpassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(userRegister(values));
  }

  return (
    <div className="login">
      {loading && <Spinner />}
      <Row gutter={16} className="d-flex align-items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Col lg={12} md={12} sm={24} xs={24} style={{ position: "relative", height: '700px' }}>
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
          <h1 className="login-logo">MyCars</h1>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24} className="text-left">
          <div className="login-Form" style={{ padding: '60px 50px' }}>
            <div data-aos='fade-up' data-aos-duration='800'>
              <h1 style={{ marginBottom: '10px' }}>
                <UserAddOutlined style={{ marginRight: '10px' }} />
                Create Account
              </h1>
              <p style={{ fontSize: '16px', color: '#718096', marginBottom: '40px' }}>
                Join us and start your journey
              </p>
            </div>

            <Form
              layout="vertical"
              onFinish={onFinish}
              data-aos='fade-up'
              data-aos-duration='1000'
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#667eea' }} />}
                  placeholder='Choose a username'
                  size='large'
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
                  placeholder='Create a password'
                  size='large'
                />
              </Form.Item>

              <Form.Item
                name="cpassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: 'Please confirm your password' }
                ]}
              >
                <Input.Password 
                  prefix={<CheckCircleOutlined style={{ color: '#667eea' }} />}
                  placeholder='Confirm your password'
                  size='large'
                />
              </Form.Item>

              <button className="btn1" style={{ width: '100%', marginTop: '20px', height: '50px' }}>
                Create Account
              </button>

              <div style={{
                marginTop: '30px',
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '15px'
              }}>
                <p style={{ margin: '0', color: '#4a5568' }}>
                  Already have an account? <Link to="/login">Login here</Link>
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
