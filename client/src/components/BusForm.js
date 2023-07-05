import React from "react";

import { Col, Form, Modal, Row, message } from "antd";
import { useDispatch } from "react-redux";
import axios from "axios";

import { axiosInstance } from "../helpers/axiosInstance";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const BusForm = ({
  showBusForm,
  setShowBusForm,
  type,
  selectedBus,
  getData,
  setSelectedBus,
}) => {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/buses/add-bus", values);
      } else {
        response = await axiosInstance.post("/api/buses/update-bus", {
          ...values,
          _id: selectedBus._id,
        });
      }

      // console.log(response.data);

      if (response.data.success) {
        // console.log('responseeee', response.data)
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }

      getData();
      setShowBusForm(false);
      setSelectedBus(null);
      dispatch(hideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(hideLoading());
    }
  };

  return (
    <Modal
      width={800}
      title="Add Bus"
      open={showBusForm}
      onCancel={() => {
        setSelectedBus(null);
        setShowBusForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedBus}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Bus Name" name="name">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Bus Number" name="number">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Bus Capacity" name="capacity">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="From" name="from">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="To" name="to">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Journey Date" name="journeyDate">
              <input type="date" />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Departure" name="departure">
              <input type="time" />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Arrival" name="arrival">
              <input type="time" />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Type" name="type">
            <select name="" id="">
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="AC-Seater">AC-Seater</option>
                <option value="Double Dekker">Double Dekker</option>
                <option value="Sleeper">Sleeper</option>
            </select>
            </Form.Item>
          </Col>


          <Col lg={12} xs={24}>
            <Form.Item label="Fare" name="fare">
              <input type="text" />
            </Form.Item>
          </Col>


          <Col lg={12} xs={24}>
            <Form.Item label="Status" name='status'>
              <select name="" id="">
                <option value="Yet To Start">Yet To Start</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
            </Form.Item>
          </Col>




        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn mt-5" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default BusForm;
