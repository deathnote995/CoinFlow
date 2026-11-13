import './config/env.js'
// import dotenv from 'dotenv'
// dotenv.config()

import express, { json } from 'express'
import logger from './utils/logger.js'
import connectDB from './config/db.js'
import transactionRoutes from './routes/transaction.route.js'
import userRoutes from './routes/user.route.js'
import walletRoutes from './routes/wallet.route.js'
import authRoutes from './routes/auth.route.js'


const app=express()
const PORT=process.env.PORT||3000
app.use(express.json())
connectDB()

app.use('/api/transactions',transactionRoutes)
app.use('/api/users',userRoutes)
app.use('/api/wallets',walletRoutes)
app.use('/api/auth',authRoutes)

app.get('/api/health',(req,res)=>{
    logger.info("Health check api responded succesfully")
    logger.debug(`Env is ${process.env.NODE_ENV}`)
    res.json({
        status:'SUCCESS',
        message:'CoinFlow health api is running smoothly',
        timestamp:new Date().toISOString()
    })
})


app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})

