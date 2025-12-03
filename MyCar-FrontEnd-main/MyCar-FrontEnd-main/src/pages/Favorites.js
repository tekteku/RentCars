import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Tag, Rate, Modal, Input, message, Empty } from 'antd';
import { HeartOutlined, HeartFilled, DeleteOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { TextArea } = Input;

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5000/api/users/favorites/${user._id}`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Load from localStorage as fallback
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(localFavorites);
    }
    setLoading(false);
  };

  const removeFavorite = async (carId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`http://localhost:5000/api/users/remove-favorite`, {
        userId: user._id,
        carId: carId
      });
      
      const updatedFavorites = favorites.filter(car => car._id !== carId);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      message.success('Removed from favorites!');
    } catch (error) {
      message.error('Failed to remove favorite');
    }
  };

  const openReviewModal = (car) => {
    setSelectedCar(car);
    setReviewModal(true);
  };

  const submitReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`http://localhost:5000/api/cars/add-review`, {
        carId: selectedCar._id,
        userId: user._id,
        userName: user.username,
        rating: rating,
        comment: review,
        date: moment().format('YYYY-MM-DD')
      });
      
      message.success('Review submitted successfully!');
      setReviewModal(false);
      setReview('');
      setRating(5);
    } catch (error) {
      message.error('Failed to submit review');
    }
  };

  return (
    <DefaultLayout>
      <div style={{ padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '900',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            ❤️ My Favorite Cars
          </h1>
          <p style={{ textAlign: 'center', color: '#fff', fontSize: '18px' }}>
            {favorites.length} cars in your wishlist
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card style={{ borderRadius: '20px', textAlign: 'center', padding: '60px' }}>
            <Empty 
              description="No favorite cars yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/">
                <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
                  Browse Cars
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {favorites.map((car) => (
              <Col key={car._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                      <img 
                        alt={car.name} 
                        src={car.image} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Button
                        type="primary"
                        danger
                        shape="circle"
                        icon={<HeartFilled />}
                        size="large"
                        style={{ 
                          position: 'absolute', 
                          top: '15px', 
                          right: '15px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                        onClick={() => removeFavorite(car._id)}
                      />
                    </div>
                  }
                  style={{ 
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: '#fff'
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '5px' }}>
                      {car.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                      <Tag color="blue">{car.fuelType}</Tag>
                      <Tag color="green">{car.capacity} seats</Tag>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <Rate disabled defaultValue={car.averageRating || 4.5} style={{ fontSize: '14px' }} />
                      <span style={{ marginLeft: '8px', color: '#666' }}>
                        ({car.reviews?.length || 0})
                      </span>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '15px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: '800', color: '#667eea' }}>
                        €{car.rentPerHour}
                      </span>
                      <span style={{ fontSize: '14px', color: '#999' }}>/hour</span>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <Button 
                        type="default"
                        icon={<StarOutlined />}
                        onClick={() => openReviewModal(car)}
                      >
                        Review
                      </Button>
                      <Link to={`/booking/${car._id}`}>
                        <Button type="primary">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Review Modal */}
        <Modal
          title="Write a Review"
          open={reviewModal}
          onOk={submitReview}
          onCancel={() => setReviewModal(false)}
          okText="Submit Review"
        >
          {selectedCar && (
            <div>
              <h3>{selectedCar.name}</h3>
              <div style={{ marginTop: '20px' }}>
                <p>Rating:</p>
                <Rate value={rating} onChange={setRating} style={{ fontSize: '24px' }} />
              </div>
              <div style={{ marginTop: '20px' }}>
                <p>Your Review:</p>
                <TextArea 
                  rows={4} 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this car..."
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
}

export default Favorites;
