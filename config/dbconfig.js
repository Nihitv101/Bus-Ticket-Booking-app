const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);


const db = mongoose.connection;

db.on("connected",()=>{
    console.log('Database Connected');
})


db.on('error', ()=>{
    console.log("Database Connection failed");
})
