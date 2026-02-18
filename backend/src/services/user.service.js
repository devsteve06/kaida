//handles the user's bs logic 
import bcrypt from 'bcrypt'; //used for password hashing b4 storage
import jwt from 'jsonwebtoken';
import userModel from '../models/user.models.js';

const  sanitizeUser = (user) =>{
        if(!user) return null; //if user is null return null
        const {passwordHash, ...safeUser} = user; //exclude password from response
        return safeUser;    
    }


const userService = {
    async register({name, email, password}, adminUser) {
        const existingResult = await userModel.findByEmail(email);
        if (existingResult.rowCount > 0){
            throw new Error('email already in use.')
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const userResult = await userModel.create({name, email, passwordHash : hashedPassword},adminUser);

        return sanitizeUser(userResult.rows[0]);//exclude password from response
    },

    async login ({email, password}){
        const userResult = await userModel.findByEmail(email);
        const user = userResult.rows[0];

        if (!user) {
                throw new Error("Invalid Credentials");     
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if(!isMatch){
            throw new Error("Invalid Credentials");
        }

        //jwt goes here
        const token =  jwt.sign(
            {
                id: user.id,
                role : user.role
            },
            process.env.JWT_SECRET,
            {expiresIn : "1d"},
        );
        // return sanitizeUser(user); //exclude password from response 
        return {
            token,
            user : {
                id : user.id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        }
           
    }
}

export default userService; 
