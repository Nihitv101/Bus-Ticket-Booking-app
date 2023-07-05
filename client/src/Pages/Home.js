import React, { useEffect, useState } from 'react'
import { useSelector , useDispatch} from 'react-redux'

import { Col, Row, message } from 'antd';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { axiosInstance } from '../helpers/axiosInstance';
import axios from 'axios';
import Bus from '../components/Bus';




const Home = () => {



  const {user} = useSelector(state=>state.users);
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);


  const [filters={}, setFilters] = useState({});




  

const getAllBuses = async() =>{

  const tempFilters = {};
  Object.keys(filters).forEach((key)=>{
    if(filters[key]){
      tempFilters[key] = filters[key];
    }
  })

    try{




        dispatch(showLoading());
        // api request:
        const response = await axios.post('/api/buses/get-all-buses', {myfilter:tempFilters}
        ,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        dispatch(hideLoading());


        if(response.data.success){
            setBuses(response.data.data);
        }
        else{
            message.error(response.data.message)
        }
        
 

    }
    catch(error){
        dispatch(hideLoading());
        message.error(error.message);
    }
}



useEffect(()=>{
  getAllBuses();
},[])



  return (
    <div> 

    {/* filter purpose */}
      <div className='my-3 card px-2 py-3'>
        <Row gutter={[10]} align="center" >


          <Col lg={6} sm={24} xs={24}>
              <input type="text" placeholder='From'
              value={filters.from}
              onChange={(e)=> setFilters({...filters, from:e.target.value})}
               />



          </Col>
          
          <Col lg={6} sm={24}>
            <input type="text" 
                placeholder='To'
                value={filters.to}
                onChange={(e)=>setFilters({...filters, to:e.target.value})}
            />
          </Col>
          
          <Col lg={6} sm={24}>
            <input type="date" 
                placeholder='Date'
                value={filters.journeyDate}
                onChange={(e)=>setFilters({...filters, journeyDate:e.target.value})}
            />
          </Col>




            <Col lg={6} sm={24}>

            <div className="d-flex gap-2">
              <button className="primary-btn" onClick={() => getAllBuses()}>
                    Filter
                  </button>

              <button className="secondary-btn" onClick={() => {
                setFilters({
                  from:"",
                  to:"",
                  journeyDate:"",
                });
              }}>
                    Clear
              </button>

            </div>
            </Col>






        </Row>
      </div>      


    {/* display purpose */}
      <div>
          <Row gutter={[15,15]}>
            {
              buses.filter(bus=>bus.status==="Yet To Start").map(bus=>(
                <Col lg={12} xs={24} sm={24}> 
                    <Bus bus={bus} />
                </Col>
              ))
            }
          </Row>
      </div>
    </div>
  )
}

export default Home