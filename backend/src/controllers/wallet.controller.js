import User from "../models/User.model.js";
import Wallet from "../models/Wallet.model.js";
import logger from "../utils/logger.js";

export const createWallet=async(req,res)=>{
    try{

        const {userId,accName,accNumber,currentBalance,accType}=req.body
        
        if(!userId||!accName||!accNumber||!accType)
            return res.status(400).json({success:false,message:'userId, AccountName,Number,Type are necessay feilds'}) 
        
        const user=await User.findById(userId)
        if(!user)
            return res.status(404).json({success:false,message:'Associated user not found'})
        
        const wallet=await Wallet.create({userId,accName,accNumber,curBalance:currentBalance||0,accType})
        logger.info(`Wallet created successfully: ${accName} for user ${userId}`)
        return res.status(201).json({success:true,message:'Wallet creation successfull',data:wallet})

    } catch(error){
        logger.error(`Error while wallet creation: ${error.message}`)
        return res.status(500).json({success:false,message:'Some server error while wallet creation',error:error.message})
    }
}
