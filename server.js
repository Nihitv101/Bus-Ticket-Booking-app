const express = require('express');
const app = express();
require('dotenv').config();

const dbconfig = require('./config/dbconfig.js');
const PORT = process.env.PORT || 5000;

const userRoute = require('./routes/users.route.js');
const busesRoute = require('./routes/buses.route.js');
const bookingRoute = require('./routes/bookings.route.js');


app.use(express.json());
app.use('/api/users',userRoute);
app.use('/api/buses', busesRoute);
app.use('/api/bookings',bookingRoute);




// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}


app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}`);
})
