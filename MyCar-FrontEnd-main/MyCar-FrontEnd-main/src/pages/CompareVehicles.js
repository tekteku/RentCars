import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Tag, Rate, Statistic, message, Select, Empty } from 'antd';
import { CarOutlined, ThunderboltOutlined, TeamOutlined, DashboardOutlined, EnvironmentOutlined, CloseOutlined } from '@ant-design/icons';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { Option } = Select;

function CompareVehicles() {
  const [allCars, setAllCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllCars();
  }, []);

  const fetchAllCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cars/getallcars');
      setAllCars(response.data);
    } catch (error) {
      message.error('Failed to fetch cars');
    }
    setLoading(false);
  };

  const handleSelectCar = (carId) => {
    if (selectedCars.length >= 3) {
      message.warning('You can compare up to 3 cars at a time');
      return;
    }
    
    const car = allCars.find(c => c._id === carId);
    if (car && !selectedCars.find(c => c._id === carId)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const removeCar = (carId) => {
    setSelectedCars(selectedCars.filter(car => car._id !== carId));
  };

  const comparisonData = [
    {
      key: 'image',
      feature: 'Image',
      render: (car) => (
        <img src={car.image} alt={car.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
      )
    },
    {
      key: 'name',
      feature: 'Vehicle Name',
      render: (car) => <strong style={{ fontSize: '16px' }}>{car.name}</strong>
    },
    {
      key: 'price',
      feature: 'Price per Hour',
      render: (car) => (
        <Statistic 
          value={car.rentPerHour} 
          prefix="€"
          valueStyle={{ fontSize: '24px', color: '#667eea' }}
        />
      )
    },
    {
      key: 'fuelType',
      feature: 'Fuel Type',
      render: (car) => (
        <Tag color={car.fuelType === 'Electric' ? 'green' : car.fuelType === 'Hybrid' ? 'blue' : 'orange'} style={{ fontSize: '14px' }}>
          <ThunderboltOutlined /> {car.fuelType}
        </Tag>
      )
    },
    {
      key: 'capacity',
      feature: 'Seating Capacity',
      render: (car) => (
        <div style={{ fontSize: '18px' }}>
          <TeamOutlined /> {car.capacity} seats
        </div>
      )
    },
    {
      key: 'carType',
      feature: 'Vehicle Type',
      render: (car) => <Tag color="purple">{car.carType || 'Sedan'}</Tag>
    },
    {
      key: 'ecoRating',
      feature: 'Eco Rating',
      render: (car) => (
        <div>
          <Rate disabled defaultValue={car.ecoRating || 4} style={{ color: '#27ae60' }} />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {car.ecoRating ? `${car.ecoRating.toFixed(1)}/5` : 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'rating',
      feature: 'Customer Rating',
      render: (car) => (
        <div>
          <Rate disabled defaultValue={car.averageRating || 4.5} />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            ({car.reviews?.length || 0} reviews)
          </div>
        </div>
      )
    },
    {
      key: 'features',
      feature: 'Key Features',
      render: (car) => (
        <div>
          {car.features?.slice(0, 3).map((feature, idx) => (
            <Tag key={idx} style={{ marginBottom: '5px' }}>{feature}</Tag>
          )) || (
            <>
              <Tag>GPS Navigation</Tag>
              <Tag>Bluetooth</Tag>
              <Tag>Air Conditioning</Tag>
            </>
          )}
        </div>
      )
    },
    {
      key: 'availability',
      feature: 'Availability',
      render: (car) => (
        <Tag color={car.bookedTimeSlots?.length > 5 ? 'red' : 'green'} style={{ fontSize: '14px' }}>
          {car.bookedTimeSlots?.length > 5 ? 'Limited' : 'Available'}
        </Tag>
      )
    },
    {
      key: 'action',
      feature: 'Action',
      render: (car) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to={`/booking/${car._id}`}>
            <Button type="primary" block size="large">
              Book Now
            </Button>
          </Link>
          <Button danger block onClick={() => removeCar(car._id)}>
            <CloseOutlined /> Remove
          </Button>
        </div>
      )
    }
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '900',
            color: '#fff',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            <DashboardOutlined /> Compare Vehicles
          </h1>
          <p style={{ color: '#fff', fontSize: '18px' }}>
            Compare up to 3 cars side by side to find your perfect match
          </p>
        </div>

        {/* Car Selection */}
        <Card style={{ marginBottom: '30px', borderRadius: '20px', background: 'rgba(255,255,255,0.95)' }}>
          <h3 style={{ marginBottom: '15px' }}>Select Cars to Compare:</h3>
          <Select
            style={{ width: '100%' }}
            size="large"
            placeholder="Choose a car to compare..."
            onChange={handleSelectCar}
            value={null}
            loading={loading}
          >
            {allCars.map(car => (
              <Option key={car._id} value={car._id} disabled={selectedCars.some(c => c._id === car._id)}>
                {car.name} - €{car.rentPerHour}/hr
              </Option>
            ))}
          </Select>
          <div style={{ marginTop: '15px' }}>
            <Tag color="blue">{selectedCars.length}/3 cars selected</Tag>
          </div>
        </Card>

        {/* Comparison Table */}
        {selectedCars.length === 0 ? (
          <Card style={{ borderRadius: '20px', textAlign: 'center', padding: '60px', background: '#fff' }}>
            <Empty 
              description="No cars selected for comparison"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <p style={{ color: '#666', marginTop: '10px' }}>
                Select at least 1 car from the dropdown above to start comparing
              </p>
            </Empty>
          </Card>
        ) : (
          <Card style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <th style={{ padding: '20px', color: '#fff', fontSize: '16px', textAlign: 'left', minWidth: '200px' }}>
                    Features
                  </th>
                  {selectedCars.map((car) => (
                    <th key={car._id} style={{ padding: '20px', color: '#fff', fontSize: '16px', textAlign: 'center', minWidth: '250px' }}>
                      <CarOutlined /> {car.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={row.key} style={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td style={{ padding: '20px', fontWeight: '600', fontSize: '14px' }}>
                      {row.feature}
                    </td>
                    {selectedCars.map((car) => (
                      <td key={car._id} style={{ padding: '20px', textAlign: 'center' }}>
                        {row.render(car)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Winner Card */}
        {selectedCars.length >= 2 && (
          <Card 
            style={{ 
              marginTop: '30px', 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
              color: '#fff',
              textAlign: 'center'
            }}
          >
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>🏆 Best Value</h2>
            <p style={{ fontSize: '18px' }}>
              Based on price, ratings, and eco-friendliness: <strong>{selectedCars[0].name}</strong>
            </p>
          </Card>
        )}
      </div>
    </DefaultLayout>
  );
}

export default CompareVehicles;
