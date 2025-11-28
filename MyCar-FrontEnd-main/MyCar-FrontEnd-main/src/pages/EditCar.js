import { Col, Row, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { addCar, editcar, getAllCars } from "../redux/actions/carsActions";

function EditCar(props) {
  const { cars } = useSelector((state) => state.carsReducer);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState();
  const [totalcars, settotalcars] = useState([]);
  useEffect(() => {

    const carId = props?.match?.params?.carid;
   
    if(!carId) return;
    if (Array.isArray(cars) && cars.length == 0) {
      dispatch(getAllCars());
    } else {
      console.log(cars);
      settotalcars(cars);
      setcar(cars.find((o) => o._id == carId));
    }
  }, [cars]);

  function onFinish(values) {
    values._id = car._id;

    dispatch(editcar(values));

    console.log(values);
  }
  console.log(car);
  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center  mt-5">
        <Col lg={12} sm={24}>
          {totalcars.length > 0 && (
            <Form
              initialValues={car}
              className="bs1 p-2"
              layout="vertical"
              onFinish={onFinish}
            >
              <h3>Edit Car</h3>
              {car.name}
              {cars.length}
              <hr />
              <Form.Item
                name="name"
                label="Car name"
                rules={[{ require: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="image"
                label="image url"
                rules={[{ require: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="rentPerHour"
                label="Rent per hour"
                rules={[{ require: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[{ require: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="fuelType"
                label="Fuel Type"
                rules={[{ require: true }]}
              >
                <Input />
              </Form.Item>

              <div className="text-right">
                <button className="btn1">EDIT CAR</button>
              </div>
            </Form>
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}
export default EditCar;
