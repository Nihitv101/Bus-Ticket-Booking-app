const router = require('express').Router();
const User = require('../models/user.model.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../client/src/middlewares/authMiddleware.js');



// register new user:

router.post('/register', async (req , res)=>{
    try{
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            return res.send({
                message:"User Already exists",
                success:false,
                data:null,
            })
        }

        // password encryption:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword;

        const newUser = await User(req.body);
        await newUser.save();

        return res.send({
            message:"User Created Successfully",
            success:true,
            data:null,
        })
        
    }
    catch(error){
        return res.send({
            message:error.message,
            success:false,
            data:null,
        })
    }
})



router.post('/login', async (req, res)=>{
    try{

        const userExists = await User.findOne({email:req.body.email});

        if(!userExists){
            return res.send({
                success:false,
                data:null,
                message:"User is not resgisterd",
            })
        }

        if (userExists.isBlocked) {
            return res.send({
              message: "Your account is blocked , please contact admin",
              success: false,
              data: null,
            });
          }
      


        
        // if user exists check for password:
        const isMatched = bcrypt.compare(req.body.password, userExists.password);

        if(!isMatched){
            return res.send({
                message:"Incorect Password",
                success:false,
                data:null,
            })
        }

        // then we authenticate using jwt we will send the jwt token with some payload like userid 

        const token =  jwt.sign({userId: userExists._id},process.env.jwt_secret,{
            expiresIn:'1d',
        })


        return res.send({
            message: "User logged in successfully",
            success: true,
            data: token,
          });
    
    }
    catch(error){

        
        res.send({
            message: error.message,
            success: false,
            data: null,
          })

    }
})



// get-user-by-id

router.post('/get-user-by-id', authMiddleware ,async(req, res, next)=>{
    try{
        const user = await User.findById(req.body.userId);

        return res.send(
            {
                message:"User fetched Successfullly",
                success:true,
                data:user,
            }
        )

    }
    catch(error){
        return res.send(
            {
                message:error.message,
                success:false,
                data:null,
            }
        )

    }

})



// get all users:

router.post('/get-all-users', authMiddleware, async (req , res)=>{
    try{
        const users = await User.find({});
        return res.send({
            success:true,
            message:"Users Fetched Successfully",
            data:users,
        })
    }
    catch(error){
        return res.send({
            success:false,
            message:error.message,
            data:null,
        })
    }
    
})




// update user:

router.post('/update-user-permissions', authMiddleware, async(req, res)=>{
    try{
        await User.findByIdAndUpdate(req.body._id, req.body);
        return res.send({
            message:"User Permission Updated Successfully",
            success:true,
            data:null,
        })
    }
    catch(error){
        return res.send({
            message:error.message,
            success:false,
            data:null,
        })
    }
})


module.exports =  router;
