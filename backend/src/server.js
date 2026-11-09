import express, { json } from 'express'
import logger from './utils/logger.js'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

const app=express()
const PORT=process.env.PORT||3000
connectDB()
 
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

