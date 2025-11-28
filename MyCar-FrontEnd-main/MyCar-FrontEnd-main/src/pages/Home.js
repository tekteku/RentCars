import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";
import { Col, Row, DatePicker, Input, Badge } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined, CalendarOutlined, CarOutlined, ThunderboltOutlined } from "@ant-design/icons";
import Spinner from "../components/Spinner";
import moment from "moment";

const { RangePicker } = DatePicker;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);

  const [totalCars, setTotalcars] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  useEffect(() => {
    setTotalcars(cars);
  }, [cars]);

  function setFilter(values) {
    if (!values) {
      setTotalcars(cars);
      return;
    }

    var selectedFrom = moment(values[0], "MM DD YYYYY HH:mm");
    var selectedTo = moment(values[1], "MM DD YYYYY HH:mm");
    var temp = [];

    for (var car of cars) {
      if (car.bookedTimeSlots.length === 0) {
        temp.push(car);
      } else {
        for (var booking of car.bookedTimeSlots) {
          if (
            selectedFrom.isBetween(booking.from, booking.to) ||
            selectedTo.isBetween(booking.from, booking.to) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo) ||
            moment(booking.to).isBetween(selectedFrom, selectedTo)
          ) {
          } else {
            temp.push(car);
          }
        }
      }
    }
    setTotalcars(temp);
  }

  const filteredCars = totalCars.filter((car) =>
    car.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        padding: '60px 20px',
        borderRadius: '30px',
        marginBottom: '40px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'fadeIn 0.8s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Circles */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.2) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '1s',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="text-gradient-animate" style={{
            fontSize: '56px',
            fontWeight: '900',
            marginBottom: '20px',
            animation: 'fadeInUp 1s ease'
          }}>
            <CarOutlined className="bounce" style={{ marginRight: '15px' }} />
            Find Your Perfect Ride
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#4a5568',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            animation: 'fadeInUp 1s ease 0.2s both'
          }}>
            Discover our premium collection of vehicles. Book now and experience luxury on wheels.
          </p>

          {/* Search and Filter Section */}
          <Row gutter={[16, 16]} justify="center" style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeInUp 1s ease 0.4s both' }}>
            <Col lg={10} md={12} sm={24} xs={24}>
              <Input
                size="large"
                placeholder="Search for your dream car..."
                prefix={<SearchOutlined style={{ color: '#667eea', fontSize: '18px' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="glow"
                style={{
                  borderRadius: '15px',
                  padding: '15px 20px',
                  fontSize: '16px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              />
            </Col>
            <Col lg={10} md={12} sm={24} xs={24}>
              <RangePicker
                size="large"
                onChange={setFilter}
                format="MMM DD, YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
                className="glow"
                style={{
                  width: '100%',
                  borderRadius: '15px',
                  padding: '15px 20px',
                  fontSize: '16px'
                }}
                placeholder={['Pick-up Date', 'Return Date']}
                suffixIcon={<CalendarOutlined style={{ color: '#667eea', fontSize: '18px' }} />}
              />
            </Col>
          </Row>

          {/* Stats */}
          <Row gutter={[32, 16]} justify="center" style={{ marginTop: '50px', maxWidth: '800px', margin: '50px auto 0' }}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <div className="hover-lift" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '25px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                animation: 'fadeInUp 1s ease 0.6s both',
                cursor: 'pointer'
              }}>
                <h2 className="text-gradient-animate" style={{ fontSize: '42px', fontWeight: '800', margin: '0' }}>
                  {Array.isArray(totalCars) ? totalCars.length : 0}+
                </h2>
                <p style={{ color: '#718096', fontSize: '16px', fontWeight: '600', margin: '5px 0 0' }}>
                  Premium Cars
                </p>
              </div>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <div className="hover-lift" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '25px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(118, 75, 162, 0.2)',
                animation: 'fadeInUp 1s ease 0.8s both',
                cursor: 'pointer'
              }}>
                <h2 className="text-gradient-animate" style={{ fontSize: '42px', fontWeight: '800', margin: '0' }}>
                  24/7
                </h2>
                <p style={{ color: '#718096', fontSize: '16px', fontWeight: '600', margin: '5px 0 0' }}>
                  Support
                </p>
              </div>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <div className="hover-lift" style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '25px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(240, 147, 251, 0.2)',
                animation: 'fadeInUp 1s ease 1s both',
                cursor: 'pointer'
              }}>
                <h2 className="text-gradient-animate" style={{ fontSize: '42px', fontWeight: '800', margin: '0' }}>
                  <ThunderboltOutlined className="bounce" />
                </h2>
                <p style={{ color: '#718096', fontSize: '16px', fontWeight: '600', margin: '5px 0 0' }}>
                  Instant Booking
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {loading && <Spinner />}

      {/* Cars Grid */}
      <div style={{ marginBottom: '30px' }}>
        <h2 className="text-gradient-animate" style={{
          fontSize: '36px',
          fontWeight: '700',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Available Cars ({filteredCars.length})
        </h2>
      </div>

      <Row justify="center" gutter={[24, 24]}>
        {Array.isArray(filteredCars) && filteredCars.length > 0 ? (
          filteredCars.map((car, index) => {
            return (
              <Col key={index} lg={6} md={8} sm={12} xs={24}>
                <div className="car ripple" style={{
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                }}>
                  <Badge.Ribbon 
                    text="Available" 
                    color="#667eea"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img src={car.image} className="carimg" alt={car.name} />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none'
                      }} className="car-overlay"></div>
                    </div>
                  </Badge.Ribbon>
                  
                  <div className="car-content">
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c',
                      marginBottom: '15px'
                    }}>
                      {car.name}
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '16px',
                        color: '#718096',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>Rent Per Hour</span>
                        <span className="text-gradient-animate" style={{
                          fontSize: '24px',
                          fontWeight: '700'
                        }}>
                          ${car.rentPerHour}
                        </span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Link to={`/booking/${car._id}`} style={{ width: '100%' }}>
                        <button className="btn1 ripple" style={{ width: '100%' }}>
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })
        ) : (
          <Col span={24}>
            <div className="hover-lift" style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              animation: 'fadeIn 0.8s ease'
            }}>
              <CarOutlined className="float" style={{ fontSize: '80px', color: '#667eea', marginBottom: '20px' }} />
              <h3 className="text-gradient-animate" style={{ fontSize: '24px', marginBottom: '10px' }}>
                No cars found
              </h3>
              <p style={{ fontSize: '16px', color: '#718096' }}>
                Try adjusting your search or date filters
              </p>
            </div>
          </Col>
        )}
      </Row>
    </DefaultLayout>
  );
}

export default Home;
