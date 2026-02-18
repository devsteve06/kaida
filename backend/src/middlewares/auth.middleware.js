//implies authentication not authorization

import { verifyToken } from "../utils/jwt.js";

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Bearer ")) { //check presence of authHeader or it's syntax compliance
        return res.status(401).json({message : "Unauthorized"})
    }

    const token = authHeader.split(" ")[1]; //obtain token by splitting the authHeader

    //why try-catch in the presence of global eror-handler??
    try{
        const decoded = verifyToken(token);
        
        //attach user info to request
        req.user = {
            id: decoded.id,
            email : decoded.email
        };
        next();// passes control to the next function in the chain of execution
    
    }catch(error){
        return res.status(400).json({message : "Invalid or Expired token"})
    }
}

export default authenticate
