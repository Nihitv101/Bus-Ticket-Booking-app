import React from 'react'
import {Form, message} from 'antd'
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';





const Login = () => { 


    const navigate = useNavigate();

    const dispatch = useDispatch();



    const onFinish = async (values)=>{
      try{

        dispatch(showLoading());
        const response = await axios.post('/api/users/login', values);
        dispatch(hideLoading());
        
        if(response?.data?.success){
          message.success(response.data.message);
          localStorage.setItem('token', response.data.data);
          window.location.href="/";
          // navigate('/');
        }
        else{
          dispatch(hideLoading());
          message.error(response.data.message);
        }

      }
      catch(error){
        message.error(error.message);

      }
    }


  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">Login</h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <input type="text" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/register">Click Here To Register</Link>
            <button className="secondary-btn" type="submit">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login;
