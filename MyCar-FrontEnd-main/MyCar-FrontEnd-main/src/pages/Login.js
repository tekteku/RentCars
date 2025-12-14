import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Checkbox, Divider } from 'antd'
import {Link, useHistory} from 'react-router-dom'
import {useDispatch,useSelector} from  'react-redux'
import {userLogin} from '../redux/actions/userActions'
import { UserOutlined, LockOutlined, LoginOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons'
import AOS from 'aos';
import Spinner from '../components/Spinner';

import 'aos/dist/aos.css'; 
AOS.init();

function Login() {
   const dispatch = useDispatch();
   const history = useHistory();
   const { loading } = useSelector(state => state.alertsReducer);
   const [rememberMe, setRememberMe] = useState(false);

   // Check if user is already logged in
   useEffect(() => {
     const user = localStorage.getItem('user');
     if (user) {
       history.push('/');
     }
   }, [history]);

   // Load remembered username
   useEffect(() => {
     const rememberedUser = localStorage.getItem('rememberedUser');
     if (rememberedUser) {
       setRememberMe(true);
     }
   }, []);

   function onFinish(values) {
     if (rememberMe) {
       localStorage.setItem('rememberedUser', values.username);
     } else {
       localStorage.removeItem('rememberedUser');
     }
     dispatch(userLogin(values));
   }

   return ( 
     <div className='login'>
       {loading && <Spinner message="Logging you in..." />}

       <Row gutter={16} className='d-flex align-items-center' style={{ maxWidth: '1200px', margin: '0 auto' }}>
         <Col lg={12} md={12} sm={24} xs={24} style={{position:'relative', height: '650px'}} >
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
           <div className='login-logo'>
             <h1>MyCars</h1>
             <p style={{ fontSize: '14px', opacity: 0.9 }}>Premium Car Rental</p>
           </div>
         </Col>
         <Col lg={12} md={12} sm={24} xs={24} className='text-left'> 
           <div className='login-Form' style={{ padding: '50px 50px' }}>
             <div data-aos='fade-up' data-aos-duration='800'>
               <h1 style={{ marginBottom: '10px', fontSize: '32px' }}>
                 <LoginOutlined style={{ marginRight: '10px' }} />
                 Welcome Back
               </h1>
               <p style={{ fontSize: '16px', color: '#718096', marginBottom: '30px' }}>
                 Login to access your account and manage your bookings
               </p>
             </div>

             <Form 
               layout='vertical' 
               onFinish={onFinish} 
               data-aos='fade-up' 
               data-aos-duration='1000'
               initialValues={{
                 username: localStorage.getItem('rememberedUser') || '',
                 remember: !!localStorage.getItem('rememberedUser')
               }}
             >
               <Form.Item 
                 name='username' 
                 label='Username' 
                 rules={[
                   { required: true, message: 'Please enter your username' },
                   { min: 3, message: 'Username must be at least 3 characters' }
                 ]}
               >
                 <Input 
                   prefix={<UserOutlined style={{ color: '#667eea' }} />}
                   placeholder='Enter your username'
                   size='large'
                   autoComplete='username'
                 />
               </Form.Item>

               <Form.Item 
                 name='password' 
                 label='Password' 
                 rules={[
                   { required: true, message: 'Please enter your password' },
                   { min: 6, message: 'Password must be at least 6 characters' }
                 ]}
               >
                 <Input.Password 
                   prefix={<LockOutlined style={{ color: '#667eea' }} />}
                   placeholder='Enter your password'
                   size='large'
                   autoComplete='current-password'
                 />
               </Form.Item>

               <Form.Item>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Checkbox 
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)}
                   >
                     Remember me
                   </Checkbox>
                   <Link to='/forgot-password' style={{ color: '#667eea' }}>
                     Forgot password?
                   </Link>
                 </div>
               </Form.Item>

               <button 
                 className='btn1' 
                 style={{ width: '100%', marginTop: '10px', height: '50px' }}
                 disabled={loading}
               >
                 {loading ? 'Logging in...' : 'Login'}
               </button>

               <Divider style={{ margin: '25px 0', color: '#a0aec0' }}>
                 or continue with
               </Divider>

               <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                 <button 
                   type='button'
                   className='social-btn'
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
                   onClick={() => alert('Google login coming soon!')}
                 >
                   <GoogleOutlined style={{ fontSize: '20px', color: '#ea4335' }} />
                   Google
                 </button>
                 <button 
                   type='button'
                   className='social-btn'
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
                   onClick={() => alert('GitHub login coming soon!')}
                 >
                   <GithubOutlined style={{ fontSize: '20px' }} />
                   GitHub
                 </button>
               </div>

               <div style={{
                 textAlign: 'center',
                 padding: '20px',
                 background: 'rgba(102, 126, 234, 0.05)',
                 borderRadius: '15px'
               }}>
                 <p style={{ margin: '0', color: '#4a5568' }}>
                   Don't have an account? <Link to='/register' style={{ color: '#667eea', fontWeight: '600' }}>Register here</Link>
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