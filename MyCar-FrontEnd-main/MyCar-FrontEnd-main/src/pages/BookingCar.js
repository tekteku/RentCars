import { Col, Row, Divider, DatePicker, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import { useParams } from "react-router-dom";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import Modal from "antd/lib/modal/Modal";
import StripeCheckout from "react-stripe-checkout";
const { RangePicker } = DatePicker;

function BookingCar({ match }) {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState({});
  const dispatch = useDispatch();
  const { carid } = useParams();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const [showModal, setShowModal] = useState(false);




  useEffect(() => {
    if (Array.isArray(cars) && cars.length === 0) {
      dispatch(getAllCars());
    }
  }, []);

  useEffect(() => {
    if (!carid && cars.length === 0) return;
    const carObj = cars.find((car) => car._id === carid);
    console.log("carObj", carObj);
    if(carObj) {
      setcar(carObj);
    }
  }, [cars, carid]);

  useEffect(() => {
    if(Object.keys(car).length === 0) return;
    setTotalAmount(totalHours * parseInt(car.rentPerHour));
    if (driver) {
      setTotalAmount(totalAmount + totalHours * 30);
    }
  }, [driver, totalHours, car]);

  function selectTimeSlots(values) {
    setFrom(moment(values[0]).format("MMM DD YYYY HH::mm"));
    setTo(moment(values[1]).format("MMM DD YYYY HH::mm"));
    setTotalHours(values[1].diff(values[0], "hours"));
  }

  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: car._id,
      totalHours,
      totalAmount,
      driverRequire: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };
    dispatch(bookCar(reqObj));
  }

  return (
    <DefaultLayout>
      {(loading || !car) && <Spinner />}
      <Row
        justify="center"
        className=" d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24}>
          <img src={car?.image} className="carimg 2 bs1" />
        </Col>
        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal" dashed>
            {" "}
            car info{" "}
          </Divider>
          <div style={{ textAlign: "right" }}>
            <p>{car?.name}</p>
            <p>{car?.rentPerHour}Rent Per Hour/-</p>
            <p>Fuel Type: {car?.fuelType}</p>
            <p>Max Persons: {car?.capacity}</p>
          </div>
          <Divider type="horizontal" dashed>
            Select Time Slots
          </Divider>
          <RangePicker
            ShowTime={{ format: "HH:mm" }}
            format="MM DD YYYY HH:mm"
            onChange={selectTimeSlots}
          />
          <br />
          <button
            className="btn1 mt-2"
            onClick={() => {
              setShowModal(true);
            }}
          >
            {" "}
            See Booked Slots
          </button>
          <div>
            <p>
              Total Hours:<b>{totalHours}</b>
            </p>
            <p>
              Rent Per Hour:<b>{car?.rentPerHour}</b>
            </p>
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  setdriver(true);
                } else {
                  setdriver(false);
                }
              }}
            >
              Driver Required
            </Checkbox>
            <h3>Total Amount :{totalAmount}</h3>
            <StripeCheckout
              shippingAddress
              token={onToken}
              currency="eur"
              amount={totalAmount * 100}
              stripeKey="pk_test_51KC2YVHMZjcwCZXiokXzAOGeyq9r11rbhOwFHIbwRM7Lk486cgfW8GKee5EBAwjz3NzOg45PNkQ9uLpI0OdI6vrn00csAdOc3x"
            >
              <button classeName="btn1">Book Now</button>
            </StripeCheckout>
          </div>
        </Col>
        {car.name && (
          <Modal
            visible={showModal}
            closable={false}
            foorter={false}
            title="Booked time slots"
          >
            {cars.length && (
              <div className="p-2">
                {car.bookedTimeSlots.map((slot, index) => {
                  return (
                    <button key={index} className="btn1 mt-2">
                      {slot.from}-{slot.to}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="text-right mt-5">
              <button
                className="btn1"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                CLOSE
              </button>
            </div>
          </Modal>
        )}
        {loading}
      </Row>
    </DefaultLayout>
  );
}

export default BookingCar;
