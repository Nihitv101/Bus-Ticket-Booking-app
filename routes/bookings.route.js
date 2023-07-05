const router = require('express').Router();
const authMiddleware = require('../client/src/middlewares/authMiddleware.js');
const Booking = require('../models/bookings.model.js');
const Bus = require('../models/bus.model.js');

const stripe = require('stripe')(process.env.stripe_key);
const {v4: uuidv4} = require('uuid');




// Book a seat:

router.post('/book-seat', authMiddleware,async (req, res)=>{
    try{
        const newBooking = new Booking({
            ...req.body,
            user:req.body.userId,
        });

        await newBooking.save();


        const bus = await Bus.findById(req.body.bus);

        bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];

        await bus.save();


        return res.status(200).send({
            success:true,
            message:"Booking Successful",
            data:newBooking,
        })
        

    }
    catch(error){

        return res.status(500).send({
            success:false,
            message:"Booking Failed",
            data:error,
        })

    }

})




// Make Payment
router.post("/make-payment", authMiddleware, async (req, res) => {
    try {
      const { token, amount } = req.body;
      const customer = await stripe.customers.create({
        email: token?.email,
        source: token?.id,
      });

      



      const payment = await stripe.paymentIntents.create(
        {
          amount: amount,
          currency: "inr",
          customer: customer?.id,
          receipt_email: token.email,


          // payment_method_types: ["card"],
          // payment_method: token.card.id, // Use the card ID from the token
        
        },
        {
          idempotencyKey: uuidv4(),
        }
      );
  
      if (payment) {
        // console.log("pAYMENT inTNET", payment);
        res.status(200).send({
          message: "Payment successful",
          data: {
            transactionId: payment.source?.id,
          },
          success: true,
        });
      } else {
        res.status(500).send({
          message: "Payment failed",
          data: error,
          success: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Payment failed",
        data: error,
        success: false,
      });
    }
  });




  // get bookings by user id:

  router.post('/get-bookings-by-user-id', authMiddleware, async (req, res)=>{
    try{
      const bookings = await Booking.find({user:req.body.userId})
      .populate('bus')
      .populate('user');

      res.status(200).send({
        success:true,
        message:"Bookings fetched Successfully",
        data:bookings,
      })
    }
    catch(error){
      return res.status(500).send({
        message:"Bookings fetched failed",
        data:error,
        success:false,
      })
    }
  })




module.exports = router;
