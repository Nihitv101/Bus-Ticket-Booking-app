import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import { Col, Row, message } from "antd";

import { useParams, useNavigate } from "react-router-dom";

import SeatSelection from "../components/SeatSelection";

// Stripe Payment Gateway

import StripeCheckout from "react-stripe-checkout";

const BookNow = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const params = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);

  const getBus = async () => {
    try {
      dispatch(showLoading());
      // api request:
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
      });

      dispatch(hideLoading());

      if (response.data.success) {
        setBus(response.data.data);
        console.log(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        transactionId,
      });
      dispatch(hideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        navigate('/bookings');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();

    console.log(bus);
  }, []);

  const onToken = async (token) => {
    console.log(token);
    try {
      dispatch(showLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare*100,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={[20]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl text-secondary">
              <h3>{bus.name}</h3>
            </h1>

            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="flex flex-column gap-3">
              <h1 className="text-lg">
                {" "}
                <b>Journey Date :</b> {bus.journeyDate}{" "}
              </h1>
              <h1 className="text-lg">
                {" "}
                <b>Fare</b> : ₹ {bus.fare} /-{" "}
              </h1>
              <h1 className="text-lg">
                {" "}
                <b>Departure Time</b> : {bus.departure}{" "}
              </h1>
              <h1 className="text-lg">
                {" "}
                <b>Arrival Time :</b> {bus.arrival}{" "}
              </h1>
              <h1 className="text-lg">
                {" "}
                <b>Total Seats :</b> {bus.capacity}{" "}
              </h1>
              <h1 className="text-lg">
                {" "}
                <b>Seats Left :</b> {bus.capacity - bus.seatsBooked.length}{" "}
              </h1>
            </div>
            <hr />

            <div className="flex flex-column gap-3">
              <h1 className="text-xl">
                <b>Selected Seats</b> : {selectedSeats.join(", ")}
              </h1>

              <h1 className="text-xl mt-3">
                Fare : <>₹ {bus.fare * selectedSeats.length}</>{" "}
              </h1>

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="inr"
                stripeKey="pk_test_51NQD91SAFIvBA5be3xiqC8XQdCR8Hxy9MGIVx1oBTOn2JIxY5vM6l5Dv1lz4OF2CATTIT7Bmevdelb4Bp6LYcVYO00uaGdD84Y"
              >
                <button
                  className={`btn btn-primary my-3 ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>



              
            </div>
          </Col>

          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BookNow;
