import User from "../models/User.model.js"
import logger from "../utils/logger.js"

export const createUser=async(req,res)=>{
    try {
        
        const {name, email, passwordHash, balanceAlertThreshold}=req.body
        
        if(!name||!email||!passwordHash)
            return res.status(400).json({success:false,message:'One of the necessary feilds is missing'})
        
        const existingUser=await User.findOne({email})
        if(existingUser)
            return res.status(400).json({success:false,message:'User with this email already exist'})
        
        const user=await User.create({name, email, password:passwordHash, balanceAlertThreshold:balanceAlertThreshold||500})
        logger.info(`User created successfully: ${email}`)
        return res.status(201).json({success:true,message:'User created successfully',data:user})
        
    } catch (error) {
        logger.error(`Error in creating user: ${error.message}`)
        return res.status(500).json({success:false,message:'Some server error occured while creating user'})
    }
    
}