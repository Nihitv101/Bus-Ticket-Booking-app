import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";
import { Modal, Table, message } from "antd";
import PageTitle from "../components/PageTitle";


import {useReactToPrint} from 'react-to-print'



const Bookings = () => {

    const [showPrintModel , setShowPrintModel] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);



    const dispatch = useDispatch();
    const [booking, setBooking] = useState([]);


    const getBookings = async() =>{
        try{
            dispatch(showLoading());
            // api request:
            const response = await axiosInstance.post('/api/bookings/get-bookings-by-user-id', {});
            dispatch(hideLoading());


            if(response.data.success){
                const mappedData = response.data.data.map((booking)=>{
                    return {
                        ...booking,
                        ...booking.bus,
                        key:booking._id,
                    }
                }) 
                setBooking(mappedData);
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

    useEffect(()=>{
        getBookings();
    },[])


    // Columns for the table



    const columns = [
        {
            title:"Bus Name",
            dataIndex:"name",
            key:"bus",
            // render: (data)=> data?.bus?.name,
        },
        {
            title:"Bus Number",
            dataIndex:"number",
            key:"bus",
            // render: (data)=> data.number,
        },
        {
            title:"Journey Date",
            dataIndex:"journeyDate",
        },
        {
            title:"Journey Time",
            dataIndex:"departure",
        },

        {
            title:"Seats",
            dataIndex:"seats",
            render: (seats)=>{
                return seats.join(", ")
            }
        },

        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => (
              <div>
                <p
                  className="text-md underline"
                  onClick={() => {
                    setSelectedBooking(record);
                    setShowPrintModel(true);
                    
                  }}
                >
                  Print Ticket
                </p>
              </div>
            ),
          },

    ]

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });


  return (
    <div>
        <PageTitle title="Bookings" />

        <div className="mt-2">
            <Table dataSource={booking} columns={columns} />
        </div>


        {
            showPrintModel && 
            <>
            <Modal title="Print Ticket" onCancel={()=>{
            setSelectedBooking(null);
            setShowPrintModel(false);
        }}  open={showPrintModel} 
        okText="Print"
        onOk={handlePrint}
        >

            <div className="flex flex-column p-5" ref={componentRef}>
                <h1 className="text-lg">Bus : {selectedBooking?.name}</h1>
                <h1 className="text-md text-secondary">
                    {selectedBooking.from} - {selectedBooking.to}
                </h1>

                <hr />

                <p className="text-md">
                    <span className="text-secondary">Journey Date : </span>
                    {selectedBooking.journeyDate}
                </p>
                
                <p className="text-md">
                    <span className="text-secondary">Journey Time : </span>
                    {selectedBooking.departure}
                </p>

                <p className="text-md">
                    <span className="text-secondary text-lg">Seat Numbers : </span>
                    <br />

                    {selectedBooking.seats}

                    <hr />

                    <p>
                        <span className="text-secondary">Total Amount : </span>
                        {selectedBooking.fare * selectedBooking.seats.length} /-
                    </p>
                </p>

    
            </div>


            
        </Modal>
            </>
        }


        
    </div>
  )
}

export default Bookings;
