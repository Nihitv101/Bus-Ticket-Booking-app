import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import BusForm from '../../components/BusForm';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import { axiosInstance } from '../../helpers/axiosInstance';
import { Table, message } from 'antd';


const AdminBuses = () => {

    const [showBusForm, setShowBusForm] = useState(false);
    const [buses, setBuses] = useState([]);
    const dispatch = useDispatch();

    const [selectedBus, setSelectedBus] = useState(null);










    const getAllBuses = async() =>{
        try{
            dispatch(showLoading());
            // api request:
            const response = await axiosInstance.post('/api/buses/get-all-buses', {});
            dispatch(hideLoading());


            if(response.data.success){
                setBuses(response.data.data);
                console.log(response.data.data);
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



    // Delete bus:


    const deleteBus = async(id)=>{
        try{

            dispatch(showLoading());

            const response = await axiosInstance.post('/api/buses/delete-bus', {_id:id});
            
            dispatch(hideLoading());

            if(response.data.success){
                message.success(response.data.message);
                getAllBuses();
            }
            else{
                message.error(response.data.message);
            }
        }
        catch(error){
            dispatch(hideLoading());
            message.error(error.message);
        }
    }

    // columns of the table:


    const columns = [
        {
            title:"Name",
            dataIndex:"name",
        },
        {
            title:"Number",
            dataIndex:"number",
        },
        {
            title:"From",
            dataIndex:"from",
        },
        {
            title:"To",
            dataIndex:"to",
        },
        {
            title:"Journey Date",
            dataIndex:"journeyDate",
        },
        {
            title:"Status",
            dataIndex:"status",
        },
        {
            title:"Action",
            dataIndex:"action",
            render: (action,record)=>(
                <div className='d-flex gap-3'>
                    <i class="ri-delete-bin-line"

                    onClick={()=>{
                        deleteBus(record._id);
                    }}
                    
                    ></i>
                    <i class="ri-pencil-line"
                    onClick={()=>{
                        setSelectedBus(record);
                        setShowBusForm(true);
                    }}
                    ></i>
                </div>
            )
        },


    ]


    useEffect(()=>{
        getAllBuses();
    },[])



  return (
    <div>
        <div className="d-flex justify-content-between">
            <PageTitle title="Buses" />
            <button className='primary-btn m-3'
                onClick={()=>{
                    setShowBusForm(true)
                }}
            >Add Bus</button>
        </div>

        {/* Table */}


        <Table
        columns={columns}
        dataSource={buses}
        >

        </Table>

        {
            showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type={selectedBus ? "edit" : "add"}
            selectedBus={selectedBus}
            getData = {getAllBuses}
            setSelectedBus={setSelectedBus}
             />


        }

    </div>
  )
}

export default AdminBuses