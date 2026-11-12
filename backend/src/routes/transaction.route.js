import express from 'express'
import { createTransaction, getWalletTransactions } from '../controllers/transaction.controller.js'

const router=express.Router()

// POST /api/transactions - Record a new income/expense & update wallet balance
router.post('/',createTransaction)

// GET /api/transactions/wallet/:walletId - Fetch transaction history for a specific wallet
router.get('/wallet/:walletId',getWalletTransactions)

export default router