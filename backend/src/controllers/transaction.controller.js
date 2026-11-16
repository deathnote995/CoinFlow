// import Wallet from '../models/Wallet.model.js'
// import User from '../models/User.model.js'
// import Transaction from '../models/Transaction.model.js'
// import logger from '../utils/logger.js'
// import { sendEmailAlert } from '../utils/email.service.js'
// import { autoCategorizeTransaction } from '../services/categorisation.service.js'


// export const createTransaction=async(req,res)=>{
//     // console.log('Hit this createTrans route',req.body)
//     try {
//         // const {userId,walletId,type,description,amount,category,date}=req.body
//         const {walletId,type,description,amount,category,date}=req.body
//         const userId=req.user._id

//         if(!userId||!walletId||!amount||!type||!description)
//             return res.status(400).json({success:false,message:'Please provide all required transaction feilds (userId, walletId, type, description, amount)'})
        
//         const wallet=await Wallet.findOne({_id:walletId,userId})
//         if(!wallet)
//             return res.status(404).json({success:false,message:'Wallet not found or unauthorised'})

//         const transaction=new Transaction({
//             userId, 
//             walletId, 
//             amount:Number(amount), 
//             type, 
//             category:category||'General', description, 
//             date:date||Date.now()
//         })

//         if(amount<=wallet.curBalance&&amount>0){

//             const balanceChange = type==='income' ? Number(amount) : -Number(amount)
            
//             wallet.curBalance+=balanceChange
//             await wallet.save()
            
//             await transaction.save()
            
//             const user=await User.findById(userId)
//             let alertTriggered=false
            
//             if(user&&wallet.curBalance<user.balanceAlertThreshold){
//                 alertTriggered=true
//                 logger.warn(`LOW BALANCE ALERT: Wallet ${wallet.accName} ${wallet._id} balance dropped to ₹${wallet.curBalance} (Threshold is ₹${user.balanceAlertThreshold})`)

//                 await sendEmailAlert(
//                     user.email,
//                     '⚠️ CoinFlow Low Balance Warning',
//                     `<h3>Low Balance Alert</h3><p>Your wallet <b>${wallet.accName}</b> has dropped to <b>₹${wallet.curBalance}</b>, which is below your threshold of ₹${user.balanceAlertThreshold}.</p>`
//                 )
//             }
            
//             logger.info(`Transaction recorded: ${type.toUpperCase()} ₹${amount} for wallet ${wallet.accName}`)
            
//             return res.status(201).json({
//                 success:true,
//                 message:'Transaction Successfull',
//                 date:{
//                     transaction,
//                     updatedWalletBalance:wallet.curBalance,
//                     alertTriggered
//                 }
//             })
//         }
//         if(amount<=0){
//             logger.warn(`Entered amount should be greater than 0`)
//             return res.status(400).json({success:false,message:`Entered amount should be greater than 0`})
//         }
//         logger.warn(`Available balance is less than amount, Current Balance: ${wallet.curBalance}`)
//         return res.status(400).json({success:false,message:'Not enough balance'})

//     } catch (error) {
//         logger.error(`Error creating transaction: ${error.message}`)
//         return res.status(500).json({
//             success:false,
//             message:'Some server error occured while doing transaction',
//             error:error.message
//         })
//     }
// }



// export const getWalletTransactions=async(req,res)=>{
//     // console.log('Hit wallet trans api',req.body)
//     try {
//         const {walletId}=req.params
//         if(!walletId)
//             return res.status(404).json({success:false,message:'Please send the walletId'})

//         const transactions=await Transaction.find({walletId}).sort({date:-1})
//         if(!transactions)
//             return res.status(404).json({success:false,message:'No matching record of the wallet found'})

//         return res.status(201).json({
//             success:true,
//             count:transactions.length,
//             data:transactions})
//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:'Some server error occured while fetching transactions',
//             error:error.message})
//     }
// }

// //Bulk transaction ingetsion
// export const bulkCreateTransactions = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { walletId, transactions } = req.body; 
//         // transactions is an array: [{ description: "Swiggy Order", amount: 450, type: "expense", date: "..." }, ...]

//         if (!walletId || !transactions || !Array.isArray(transactions) || transactions.length === 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Please provide a valid walletId and a non-empty transactions array.' 
//             });
//         }

//         // 1. Verify wallet ownership
//         const wallet = await Wallet.findOne({ _id: walletId, userId });
//         if (!wallet) {
//             return res.status(404).json({ success: false, message: 'Wallet not found or unauthorized.' });
//         }

//         const user = await User.findById(userId);
//         let processedTransactions = [];
//         let netBalanceChange = 0;

//         // 2. Process and auto-categorize each transaction
//         for (const tx of transactions) {
//             const { description, amount, type, date, merchant } = tx;

//             if (!amount || !type || !description) continue; // Skip malformed rows

//             // Auto-categorize using our smart service if category wasn't explicitly provided
//             const assignedCategory = tx.category || autoCategorizeTransaction(description, merchant);

//             const balanceDelta = type === 'income' ? Number(amount) : -Number(amount);
//             netBalanceChange += balanceDelta;

//             processedTransactions.push({
//                 userId,
//                 walletId,
//                 amount: Number(amount),
//                 type,
//                 category: assignedCategory,
//                 description,
//                 date: date || Date.now(),
//                 isAutomated: true // Flag to distinguish automated vs manual cash entries
//             });
//         }

//         // 3. Check if bulk expense exceeds available balance
//         if (wallet.curBalance + netBalanceChange < 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: `Bulk import failed: Resulting balance would drop below zero (Current Balance: ₹${wallet.curBalance}).` 
//             });
//         }

//         // 4. Save transactions in batch & update wallet balance
//         const insertedTransactions = await Transaction.insertMany(processedTransactions);
        
//         wallet.curBalance += netBalanceChange;
//         await wallet.save();

//         // 5. Check Low-Balance Threshold & Trigger Brevo Email if needed
//         let alertTriggered = false;
//         if (user && wallet.curBalance < user.balanceAlertThreshold) {
//             alertTriggered = true;
//             logger.warn(`LOW BALANCE ALERT: Wallet ${wallet.accName} dropped to ₹${wallet.curBalance} after bulk sync.`);
            
//             await sendEmailAlert(
//                 user.email,
//                 '⚠️ CoinFlow Low Balance Warning',
//                 `<h3>Low Balance Alert</h3><p>Your wallet <b>${wallet.accName}</b> has dropped to <b>₹${wallet.curBalance}</b>, which is below your threshold of ₹${user.balanceAlertThreshold}.</p>`
//             );
//         }

//         logger.info(`Successfully bulk-imported ${insertedTransactions.length} transactions for user ${userId}`);

//         return res.status(201).json({
//             success: true,
//             message: `Successfully processed and categorized ${insertedTransactions.length} transactions.`,
//             data: {
//                 importedCount: insertedTransactions.length,
//                 updatedWalletBalance: wallet.curBalance,
//                 alertTriggered
//             }
//         });

//     } catch (error) {
//         logger.error(`Bulk ingestion error: ${error.message}`);
//         return res.status(500).json({ 
//             success: false, 
//             message: 'Server error during bulk transaction ingestion', 
//             error: error.message 
//         });
//     }
// }


import Wallet from '../models/Wallet.model.js';
import User from '../models/User.model.js';
import Transaction from '../models/Transaction.model.js';
import logger from '../utils/logger.js';
import { sendEmailAlert } from '../utils/email.service.js';
import { autoCategorizeTransaction } from '../services/categorisation.service.js';

// 1. Create a Single Transaction (Manual or Webhook)
export const createTransaction = async (req, res) => {
    try {
        const { walletId, type, description, amount, category, date } = req.body;
        const userId = req.user._id;

        if (!walletId || !amount || !type || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required transaction fields (walletId, type, description, amount)' 
            });
        }

        const numAmount = Number(amount);
        if (numAmount <= 0) {
            logger.warn(`Entered amount should be greater than 0`);
            return res.status(400).json({ success: false, message: 'Entered amount should be greater than 0' });
        }

        // Verify wallet exists and belongs to the authenticated user
        const wallet = await Wallet.findOne({ _id: walletId, userId });
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found or unauthorized' });
        }

        // Only block if it's an EXPENSE exceeding the current balance
        if (type === 'expense' && numAmount > wallet.curBalance) {
            logger.warn(`Available balance is less than amount, Current Balance: ${wallet.curBalance}`);
            return res.status(400).json({ success: false, message: 'Not enough balance' });
        }

        // Auto-categorize if the client didn't explicitly pass a category
        const finalCategory = category || autoCategorizeTransaction(description);

        const transaction = new Transaction({
            userId,
            walletId,
            amount: numAmount,
            type,
            category: finalCategory,
            description,
            date: date || Date.now()
        });

        const balanceChange = type === 'income' ? numAmount : -numAmount;
        wallet.curBalance += balanceChange;

        await wallet.save();
        await transaction.save();

        // Check Low Balance Alert (only relevant when balance drops on an expense)
        const user = await User.findById(userId);
        let alertTriggered = false;

        if (type === 'expense' && user && wallet.curBalance < user.balanceAlertThreshold) {
            alertTriggered = true;
            logger.warn(`LOW BALANCE ALERT: Wallet ${wallet.accName} (${wallet._id}) balance dropped to ₹${wallet.curBalance}`);

            await sendEmailAlert(
                user.email,
                '⚠️ CoinFlow Low Balance Warning',
                `<h3>Low Balance Alert</h3><p>Your wallet <b>${wallet.accName}</b> has dropped to <b>₹${wallet.curBalance}</b>, which is below your threshold of ₹${user.balanceAlertThreshold}.</p>`
            );
        }

        logger.info(`Transaction recorded: ${type.toUpperCase()} ₹${numAmount} [${finalCategory}] for wallet ${wallet.accName}`);

        return res.status(201).json({
            success: true,
            message: 'Transaction Successful',
            data: {
                transaction,
                updatedWalletBalance: wallet.curBalance,
                alertTriggered
            }
        });

    } catch (error) {
        logger.error(`Error creating transaction: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Some server error occurred while doing transaction',
            error: error.message
        });
    }
};

// 2. Fetch Transactions for a Specific Wallet (User-Isolated)
export const getWalletTransactions = async (req, res) => {
    try {
        const { walletId } = req.params;
        const userId = req.user._id;

        if (!walletId) {
            return res.status(400).json({ success: false, message: 'Please send the walletId' });
        }

        // Ensure transactions belong to BOTH the wallet and the authenticated user
        const transactions = await Transaction.find({ walletId, userId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        logger.error(`Error fetching wallet transactions: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Some server error occurred while fetching transactions',
            error: error.message
        });
    }
};

// 3. Bulk Transaction Ingestion (CSV / Automated UPI Sync)
export const bulkCreateTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { walletId, transactions } = req.body;

        if (!walletId || !transactions || !Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid walletId and a non-empty transactions array.'
            });
        }

        const wallet = await Wallet.findOne({ _id: walletId, userId });
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found or unauthorized.' });
        }

        const user = await User.findById(userId);
        let processedTransactions = [];
        let netBalanceChange = 0;

        for (const tx of transactions) {
            const { description, amount, type, date, merchant } = tx;
            if (!amount || !type || !description) continue;

            const assignedCategory = tx.category || autoCategorizeTransaction(description, merchant);
            const balanceDelta = type === 'income' ? Number(amount) : -Number(amount);
            netBalanceChange += balanceDelta;

            processedTransactions.push({
                userId,
                walletId,
                amount: Number(amount),
                type,
                category: assignedCategory,
                description,
                date: date || Date.now(),
                isAutomated: true
            });
        }

        if (wallet.curBalance + netBalanceChange < 0) {
            return res.status(400).json({
                success: false,
                message: `Bulk import failed: Resulting balance would drop below zero (Current Balance: ₹${wallet.curBalance}).`
            });
        }

        const insertedTransactions = await Transaction.insertMany(processedTransactions);

        wallet.curBalance += netBalanceChange;
        await wallet.save();

        let alertTriggered = false;
        if (user && wallet.curBalance < user.balanceAlertThreshold) {
            alertTriggered = true;
            logger.warn(`LOW BALANCE ALERT: Wallet ${wallet.accName} dropped to ₹${wallet.curBalance} after bulk sync.`);

            await sendEmailAlert(
                user.email,
                '⚠️ CoinFlow Low Balance Warning',
                `<h3>Low Balance Alert</h3><p>Your wallet <b>${wallet.accName}</b> has dropped to <b>₹${wallet.curBalance}</b>, which is below your threshold of ₹${user.balanceAlertThreshold}.</p>`
            );
        }

        logger.info(`Successfully bulk-imported ${insertedTransactions.length} transactions for user ${userId}`);

        return res.status(201).json({
            success: true,
            message: `Successfully processed and categorized ${insertedTransactions.length} transactions.`,
            data: {
                importedCount: insertedTransactions.length,
                updatedWalletBalance: wallet.curBalance,
                alertTriggered
            }
        });

    } catch (error) {
        logger.error(`Bulk ingestion error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Server error during bulk transaction ingestion',
            error: error.message
        });
    }
};