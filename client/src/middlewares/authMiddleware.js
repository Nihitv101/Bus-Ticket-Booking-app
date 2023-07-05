const jwt = require('jsonwebtoken');


module.exports = (req, res, next)=>{

    try{
        // decode the token:
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).send({
                message:"Authentication Failed",
                success:false,
            })
        }
    
        const decoded =  jwt.verify(token , process.env.jwt_secret);
        // console.log("Decoded", decoded);
        req.body.userId = decoded.userId;
        next();

    }
    catch(error){
        return res.status(401).send({
            message:"Authentication Failed",
            success:false,
        })
    }


}