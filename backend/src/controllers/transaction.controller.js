import Wallet from '../models/Wallet.model.js'
import User from '../models/User.model.js'
import Transaction from '../models/Transaction.model.js'
import logger from '../utils/logger.js'


export const createTransaction=async(req,res)=>{
    // console.log('Hit this createTrans route',req.body)
    try {
        // const {userId,walletId,type,description,amount,category,date}=req.body
        const {walletId,type,description,amount,category,date}=req.body
        const userId=req.user._id

        if(!userId||!walletId||!amount||!type||!description)
            return res.status(400).json({success:false,message:'Please provide all required transaction feilds (userId, walletId, type, description, amount)'})
        
        const wallet=await Wallet.findOne({_id:walletId,userId})
        if(!wallet)
            return res.status(404).json({success:false,message:'Wallet not found or unauthorised'})

        const transaction=new Transaction({
            userId, 
            walletId, 
            amount:Number(amount), 
            type, 
            category:category||'General', description, 
            date:date||Date.now()
        })

        if(amount<=wallet.curBalance&&amount>0){

            const balanceChange = type==='income' ? Number(amount) : -Number(amount)
            
            wallet.curBalance+=balanceChange
            await wallet.save()
            
            await transaction.save()
            
            const user=await User.findById(userId)
            let alertTriggered=false
            
            if(user&&wallet.curBalance<user.balanceAlertThreshold){
                alertTriggered=true
                logger.warn(`LOW BALANCE ALERT: Wallet ${wallet.accName} ${wallet._id} balance dropped to ₹${wallet.curBalance} (Threshold is ₹${user.balanceAlertThreshold})`)
            }
            
            logger.info(`Transaction recorded: ${type.toUpperCase()} ₹${amount} for wallet ${wallet.accName}`)
            
            return res.status(201).json({
                success:true,
                message:'Transaction Successfull',
                date:{
                    transaction,
                    updatedWalletBalance:wallet.curBalance,
                    alertTriggered
                }
            })
        }
        if(amount<=0){
            logger.warn(`Entered amount should be greater than 0`)
            return res.status(400).json({success:false,message:`Entered amount should be greater than 0`})
        }
        logger.warn(`Available balance is less than amount, Current Balance: ${wallet.curBalance}`)
        return res.status(400).json({success:false,message:'Not enough balance'})

    } catch (error) {
        logger.error(`Error creating transaction: ${error.message}`)
        return res.status(500).json({
            success:false,
            message:'Some server error occured while doing transaction',
            error:error.message
        })
    }
}



export const getWalletTransactions=async(req,res)=>{
    // console.log('Hit wallet trans api',req.body)
    try {
        const {walletId}=req.params
        if(!walletId)
            return res.status(404).json({success:false,message:'Please send the walletId'})

        const transactions=await Transaction.find({walletId}).sort({date:-1})
        if(!transactions)
            return res.status(404).json({success:false,message:'No matching record of the wallet found'})

        return res.status(201).json({
            success:true,
            count:transactions.length,
            data:transactions})
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Some server error occured while fetching transactions',
            error:error.message})
    }
}