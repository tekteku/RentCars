import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { deleteCar, getAllCars } from "../redux/actions/carsActions";
import { Col, Row, Divider, DatePicker, Checkbox } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, message } from "antd";
const { RangePicker } = DatePicker;

function AdminHome() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);

  const  [totalCars, setTotalcars] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCars());
  }, []);


  // cars || []

  useEffect(() => {
  console.log("cars data", cars);

    setTotalcars(cars);
  }, [cars]);

  function setFilter(values) {
    var selectedFrom = moment(values[0], "MM DD YYYYY  HH:mm");
    var selectedTo = moment(values[1], "MM DD YYYYY  HH:mm ");
    var temp = [];

    for (var car of cars) {
      if (car.bookedTimeSlots.length == 0) temp.push(car);
      else {
        for (var booking of car.bookedTimeSlots) {
          if (
            selectedFrom.isBetween(booking.From, booking.to) ||
            selectedTo.isBetween(booking.from, booking.to) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo)
          ) {
          } else {
            temp.push(car);
          }
        }
      }
    }

    setTotalcars(temp);
  }

  return (
    <DefaultLayout>
      <Col lg={20} sm={24}>
        <div className="text-right">
          <button className="btn1">
            <a href="addcar">ADD CAR</a>
          </button>
        </div>
      </Col>

      <Row justify="center" gutter={16} className="mt5">
        {Array.isArray(totalCars) && totalCars.map((car, index) => {
          return (
            <Col key={index} lg={5} sm={24} xs={24}>
              <div className="car p-2 bs1 my-3">
                <img src={car.image} className="carimg" />
                <div className="car-content d-flex align-items-center justify-content-between">
                  <div className="text left pl-2">
                    <p>{car.name}</p>
                    <p> Rent Per hour{car.rentPerHour}/- </p>
                  </div>

                  <div className="mr-4">
                   

                    <Popconfirm
                      title="Are you sure to delete this car?"
                      onConfirm={() => {
                        dispatch(deleteCar({ carid: car._id }));
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </Popconfirm>
                    <Link to={`/editcar/${car._id}`} >
                    <EditOutlined
                      className="mr-3"
                      style={{ color: "green", cursor: "pointer" }}
                    >  </EditOutlined>
                       </Link>
                    
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
        </Row>
      {loading == true && <Spinner />}
  
    </DefaultLayout>
  );
}

export default AdminHome;
