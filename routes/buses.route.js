const router = require('express').Router();
const authMiddleware = require('../client/src/middlewares/authMiddleware.js');
const Bus = require('../models/bus.model.js');


// add bus:

router.post('/add-bus', async(req, res)=>{
    try{
        const existingBus = await Bus.findOne({
            number:req.body.number
        })

        if(existingBus){
            // no bus will be added:
            return res.status(200).send({
                success:false,
                message:"Bus Already exists",
            })


        }
        else{
            // add the bus:
            const newbus = new Bus(req.body);
            await newbus.save();

            return res.status(200).send({
                success:true,
                message:'Bus Added Sucessfully',
            })

        }


    }
    catch(error){
        return res.status(500).send({
            success:false,
            message:error.message,
        })
    }
})




// get all buses:

router.post('/get-all-buses', authMiddleware, async (req, res)=>{
    try{



        const buses = await Bus.find(req.body.myfilter);
        return res.status(200).send({
            success:true,
            message:"Buses fetched Successfully",
            data:buses,

        })
        


    }
    catch(error){
        return res.status(500).send({
            success:false,
            message:error.messge,
        })
    }
})




// update buses:


router.post('/update-bus', authMiddleware,async(req, res)=>{
    try{
        await Bus.findByIdAndUpdate(req.body._id, req.body);
        return res.status(200).send({
            success:true,
            message:"Bus updated Successfully",
        });


    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error.message,
        })
    }
});




// delete route:

router.post('/delete-bus', authMiddleware, async (req, res)=>{
    try{
        await Bus.findByIdAndDelete(req.body._id);

        return res.status(200).send({
            success:true,
            message:"Bus delted Successfully",
        })
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error.message,
        })
    }
})



// get bus by id:


router.post('/get-bus-by-id', authMiddleware, async (req, res)=>{
    try{

    const bus = await Bus.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Bus fetched successfully",
      data: bus,
    });

    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error.message,
        })
    }
})






module.exports = router;
