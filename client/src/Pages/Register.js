import React from 'react';
import {Form, message} from 'antd'
import { Link ,useNavigate} from 'react-router-dom';

import axios from 'axios';

import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';



const Register = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  


    const onFinish = async (values)=>{
      try{

        dispatch(showLoading());
        const response = await axios.post('/api/users/register', values);
        dispatch(hideLoading());
        
        console.log(response);
        if(response?.data?.success){
          // console.log(response.success);
          message.success(response?.data.message);
          navigate('/login');
        }
        else{
          console.log(response.data.success);
          message.error(response.data.message);
        }
        
      }
      catch(error){
        dispatch(hideLoading());
        message.error(error.message);
      }
    }

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">Register</h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <input type="text" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <input type="text" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/login">Click Here To Login</Link>
            <button className="secondary-btn" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register