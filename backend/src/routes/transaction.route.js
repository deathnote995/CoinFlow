import express from 'express'
import { bulkCreateTransactions, createTransaction, getFilteredWalletTransactions } from '../controllers/transaction.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router=express.Router()

router.use(protect)

// POST /api/transactions - Record a new income/expense & update wallet balance
router.post('/',createTransaction)
router.post('/bulk',bulkCreateTransactions)

// GET /api/transactions/wallet/:walletId - Fetch transaction history for a specific wallet
router.get('/',getFilteredWalletTransactions)

export default router