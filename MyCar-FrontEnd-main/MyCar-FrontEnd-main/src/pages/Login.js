import React from 'react'
import { Row, Col, Form, Input } from 'antd'
import {Link} from 'react-router-dom'
import {useDispatch,useSelector} from  'react-redux'
import {userLogin} from '../redux/actions/userActions'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import AOS from 'aos';
import Spinner from '../components/Spinner';

import 'aos/dist/aos.css'; 
AOS.init();

function Login() {
   const  dispatch = useDispatch()
   const stateAlerts= useSelector(state=>state.alertsReducer) 
   console.log(stateAlerts)
    function onFinish (values){
        dispatch(userLogin(values))
   console.log(values)
    }
    return ( 
        <div className='login'>
            {/*loading== true &&  (<Spinner/>)*/} 

            <Row gutter={16} className='d-flex align-items-center' style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Col lg={12} md={12} sm={24} xs={24} style={{position:'relative', height: '600px'}} >
                    <img 
                        data-aos='slide-right'
                        data-aos-duration='1000'
                        src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
                        alt='Luxury Car'
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '30px 0 0 30px'
                        }}
                    />
                    <h1 className='login-logo'>MyCars</h1>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24} className='text-left'> 
                    <div className='login-Form' style={{ padding: '60px 50px' }}>
                        <div data-aos='fade-up' data-aos-duration='800'>
                            <h1 style={{ marginBottom: '10px' }}>
                                <LoginOutlined style={{ marginRight: '10px' }} />
                                Welcome Back
                            </h1>
                            <p style={{ fontSize: '16px', color: '#718096', marginBottom: '40px' }}>
                                Login to access your account
                            </p>
                        </div>

                        <Form layout='vertical' onFinish={onFinish} data-aos='fade-up' data-aos-duration='1000'>
                            <Form.Item 
                                name='username' 
                                label='Username' 
                                rules={[{ required: true, message: 'Please enter your username' }]}
                            >
                                <Input 
                                    prefix={<UserOutlined style={{ color: '#667eea' }} />}
                                    placeholder='Enter your username'
                                    size='large'
                                />
                            </Form.Item>

                            <Form.Item 
                                name='password' 
                                label='Password' 
                                rules={[{ required: true, message: 'Please enter your password' }]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#667eea' }} />}
                                    placeholder='Enter your password'
                                    size='large'
                                />
                            </Form.Item>

                            <button className='btn1' style={{ width: '100%', marginTop: '20px', height: '50px' }}>
                                Login
                            </button>

                            <div style={{
                                marginTop: '30px',
                                textAlign: 'center',
                                padding: '20px',
                                background: 'rgba(102, 126, 234, 0.05)',
                                borderRadius: '15px'
                            }}>
                                <p style={{ margin: '0', color: '#4a5568' }}>
                                    Don't have an account? <Link to='/register'>Register here</Link>
                                </p>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Login 