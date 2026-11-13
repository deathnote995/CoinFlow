import User from "../models/User.model.js";
import Wallet from "../models/Wallet.model.js";
import logger from "../utils/logger.js";

//Create wallet/asset
export const createWallet=async(req,res)=>{
    try{

        const {userId,accName,accNumber,currentBalance,accType,metadata}=req.body
        
        if(!userId||!accName||!accNumber||!accType)
            return res.status(400).json({success:false,message:'userId, AccountName,Number,Type are necessay feilds'}) 
        
        const user=await User.findById(userId)
        if(!user)
            return res.status(404).json({success:false,message:'Associated user not found'})
        
        const wallet=await Wallet.create({userId,accName,accNumber,curBalance:currentBalance||0,accType,metadata:metadata||{}})
        logger.info(`Wallet created successfully: ${accName} for user ${userId}`)
        return res.status(201).json({success:true,message:'Wallet creation successfull',data:wallet})

    } catch(error){
        logger.error(`Error while wallet creation: ${error.message}`)
        return res.status(500).json({success:false,message:'Some server error while wallet creation',error:error.message})
    }
}

// Fetch all wallets and assets belonging to a specific user
export const getUserWallets = async (req, res) => {
    try {
        const { userId } = req.params;

        const wallets = await Wallet.find({ userId, isActive: true });
        return res.status(200).json({
            success: true,
            count: wallets.length,
            data: wallets
        });
    } catch (error) {
        logger.error(`Error fetching user wallets: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Some Server error occured', error: error.message });
    }
}

// Aggregated summary for the dashboard KPI ribbon (Net Worth, FD counts, SIP counts)
export const getDashboardSummary = async (req, res) => {
    try {
        const { userId } = req.params;

        const wallets = await Wallet.find({ userId, isActive: true });

        let totalNetWorth = 0;
        let activeWalletsCount = 0;
        let runningFDsCount = 0;
        let activeSIPsCount = 0;

        wallets.forEach(wallet => {
            totalNetWorth += wallet.curBalance || 0;

            if (['Savings', 'Current', 'Cash', 'CreditCard'].includes(wallet.accountType)) {
                activeWalletsCount++;
            } else if (wallet.accountType === 'FD') {
                runningFDsCount++;
            } else if (wallet.accountType === 'MutualFund_SIP') {
                activeSIPsCount++;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                totalNetWorth,
                activeWalletsCount,
                runningFDsCount,
                activeSIPsCount,
                allAssets: wallets
            }
        });
    } catch (error) {
        logger.error(`Error generating dashboard summary: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Some Server error occured', error: error.message });
    }
}
