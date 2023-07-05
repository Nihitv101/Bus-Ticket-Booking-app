import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/usersSlice";
import { hideLoading, showLoading } from "../redux/alertsSlice";

import DefaultLayout from "./DefaultLayout";


const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch(); // for settign the payload using functions

  // const { loading } = useSelector((state) => state.alerts);


  const {user} = useSelector((state)=>state.users);


  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/users/get-user-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response?.data?.success) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.removeItem("token");
        message.error(response.data.message);

        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.removeItem("token");

      message.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);

  return <div>{user &&  <DefaultLayout>{children}</DefaultLayout>}</div>;
};

export default ProtectedRoute;
