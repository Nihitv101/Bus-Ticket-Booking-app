import { Button } from "antd";
import "./resources/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";

import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";


import { useSelector } from "react-redux";
import AdminHome from "./Pages/Admin/AdminHome";
import AdminBuses from "./Pages/Admin/AdminBuses";
import AdminUsers from "./Pages/Admin/AdminUsers";


import BookNow from "./Pages/BookNow";
import Bookings from "./Pages/Bookings";


const App = () => {

  const {loading} = useSelector(state=>state.alerts);


  return (
    <div>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute>}   />



          <Route path="/book-now/:id" element={ <ProtectedRoute> <BookNow /> </ProtectedRoute>}   />

          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/buses"
            element={
              <ProtectedRoute>
                <AdminBuses />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />


          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />




        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
