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
import { generateTransactionHash } from '../utils/hash.util.js';

// 1. Create a Single Transaction (Manual or Webhook)
export const createTransaction = async (req, res) => {
    try {
        const { walletId, type, description, amount, category, date } = req.body;
        const userId = req.user._id;
        let alertTriggered = false;

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


        //Additional code to prevent duplicacy of transactions
        // 1. Generate or use the provided referenceId/fingerprint
        const txDate = date ? new Date(date) : new Date();
        const fingerprint = referenceId?.trim() || generateTransactionHash({
            walletId,
            date: txDate,
            amount: numAmount,
            type,
            description
        })

        // 2. IDEMPOTENCY CHECK: See if this exact transaction already exists
        const existingTransaction = await Transaction.findOne({ userId, referenceId: fingerprint });
        if (existingTransaction) {
            logger.info(`Duplicate single transaction ignored for user ${userId} (Hash: ${fingerprint})`);
            return res.status(200).json({
                success: true,
                message: 'Transaction already recorded (Idempotent duplicate skipped)',
                data: {
                    transaction: existingTransaction,
                    updatedWalletBalance: wallet.curBalance,
                    alertTriggered: false
                }
            })
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
/*export const getWalletTransactions = async (req, res) => {
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
}*/

//New get wallet transaction controller
export const getFilteredWalletTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { walletId, startDate, endDate, category, type, page = 1, limit = 20 } = req.query;

        let query = { userId };

        if (walletId) query.walletId = walletId;
        if (category) query.category = category;
        if (type) query.type = type;

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalCount = await Transaction.countDocuments(query);

        return res.status(200).json({
            success: true,
            currentPage: Number(page),
            totalPages: Math.ceil(totalCount / Number(limit)),
            count: transactions.length,
            totalCount,
            data: transactions
        });

    } catch (error) {
        logger.error(`Error fetching filtered transactions: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching transaction history',
            error: error.message
        });
    }
}

// 3. Bulk Transaction Ingestion (CSV / Automated UPI Sync)
// export const bulkCreateTransactions = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { walletId, transactions } = req.body;

//         if (!walletId || !transactions || !Array.isArray(transactions) || transactions.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please provide a valid walletId and a non-empty transactions array.'
//             });
//         }

//         const wallet = await Wallet.findOne({ _id: walletId, userId });
//         if (!wallet) {
//             return res.status(404).json({ success: false, message: 'Wallet not found or unauthorized.' });
//         }

//         const user = await User.findById(userId);
//         let processedTransactions = [];
//         let netBalanceChange = 0;

//         for (const tx of transactions) {
//             const { description, amount, type, date, merchant } = tx;
//             if (!amount || !type || !description) continue;

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
//                 isAutomated: true
//             });
//         }

//         if (wallet.curBalance + netBalanceChange < 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Bulk import failed: Resulting balance would drop below zero (Current Balance: ₹${wallet.curBalance}).`
//             });
//         }

//         const insertedTransactions = await Transaction.insertMany(processedTransactions);

//         wallet.curBalance += netBalanceChange;
//         await wallet.save();

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

//new Bulk controller
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
        const candidateMap = new Map();
        let invalidCount = 0;

        // 1. Normalize valid rows, validate amounts, and generate unique referenceIds/fingerprints
        for (const tx of transactions) {
            const { description, amount, type, date, merchant, referenceId } = tx;
            const numAmount = Number(amount);

            if (!amount || !type || !description || numAmount <= 0) {
                invalidCount++;
                continue;
            }

            const txDate = date ? new Date(date) : new Date();
            const fingerprint = referenceId?.trim() || generateTransactionHash({
                walletId,
                date: txDate,
                amount: numAmount,
                type,
                description
            });

            // Skip duplicates within the same payload batch
            if (candidateMap.has(fingerprint)) continue;

            const assignedCategory = tx.category || autoCategorizeTransaction(description, merchant);

            candidateMap.set(fingerprint, {
                userId,
                walletId,
                amount: numAmount,
                type,
                category: assignedCategory,
                description: description.trim(),
                date: txDate,
                isAutomated: true,
                referenceId: fingerprint
            });
        }

        if (candidateMap.size === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid transactions found in payload. Amounts must be greater than 0.'
            });
        }

        // 2. Query MongoDB in one batch for already-imported referenceIds
        const candidateRefs = Array.from(candidateMap.keys());
        const existingDocs = await Transaction.find({
            userId,
            referenceId: { $in: candidateRefs }
        }).select('referenceId');

        const existingRefSet = new Set(existingDocs.map(doc => doc.referenceId));

        // 3. Filter out existing database duplicates and compute precise net balance change
        const newTransactions = [];
        let netBalanceChange = 0;

        for (const [ref, txDoc] of candidateMap.entries()) {
            if (existingRefSet.has(ref)) continue;

            newTransactions.push(txDoc);
            netBalanceChange += txDoc.type === 'income' ? txDoc.amount : -txDoc.amount;
        }

        const duplicateCount = transactions.length - invalidCount - newTransactions.length;

        // If every row was already imported, exit cleanly with 200 OK
        if (newTransactions.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'All transactions were already synced. No duplicate entries added.',
                data: {
                    importedCount: 0,
                    duplicateCount,
                    invalidCount,
                    updatedWalletBalance: wallet.curBalance,
                    alertTriggered: false
                }
            });
        }

        // 4. Verify resulting balance won't drop below zero for bulk expenses
        if (wallet.curBalance + netBalanceChange < 0) {
            return res.status(400).json({
                success: false,
                message: `Bulk import failed: Resulting balance would drop below zero (Current Balance: ₹${wallet.curBalance}).`
            });
        }

        // 5. Commit new records in bulk and update wallet balance
        const insertedTransactions = await Transaction.insertMany(newTransactions);
        wallet.curBalance += netBalanceChange;
        await wallet.save();

        // 6. Low-Balance Alert Check
        let alertTriggered = false;
        if (user && wallet.curBalance < user.balanceAlertThreshold) {
            alertTriggered = true;
            logger.warn(`LOW BALANCE ALERT: Wallet ${wallet.accName} dropped to ₹${wallet.curBalance} after bulk sync.`);

            await sendEmailAlert(
                user.email,
                '⚠️ CoinFlow Low Balance Warning',
                `<h3>Low Balance Alert</h3><p>Your wallet <b>${wallet.accName}</b> has dropped to <b>₹${wallet.curBalance}</b>, which is below your threshold of ₹{user.balanceAlertThreshold}.</p>`
            );
        }

        logger.info(`Bulk sync complete: ${insertedTransactions.length} imported, ${duplicateCount} duplicates skipped.`);

        return res.status(201).json({
            success: true,
            message: `Processed ${insertedTransactions.length} new transactions (${duplicateCount} duplicates skipped).`,
            data: {
                importedCount: insertedTransactions.length,
                duplicateCount,
                invalidCount,
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
}