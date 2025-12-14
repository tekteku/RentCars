import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { addcar } from "../redux/actions/carsActions";
import { Col, Row, Input, Form } from "antd";

function AddCar() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);
  function onFinish(values) {
    values.bookedTimeSlots = [];

    dispatch(addcar(values));

    console.log(values);
  }
  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center  mt-5">
        <Col lg={12} sm={24}>
          <Form className="bs1 p-2" layout="vertical" onFinish={onFinish}>
            <h3>Add New Car</h3>

            <hr />
            <Form.Item name="name" label="Car name" rules={[{ require: true }]}>
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
              name="cpacity"
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
              <button className="btn1">ADD CAR</button>
            </div>
          </Form>
        </Col>
      </Row>
    </DefaultLayout>
  );
}
export default AddCar;
// update