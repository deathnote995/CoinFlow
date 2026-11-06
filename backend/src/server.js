import express, { json } from 'express'
import logger from './utils/logger.js'
import dotenv from 'dotenv'

dotenv.config()

const app=express()
const PORT=process.env.PORT||3000
 
app.get('/api/health',(req,res)=>{
    logger.info("Health check api responded succesfully")
    res.json({
        status:'SUCCESS',
        message:'CoinFlow health api is running smoothly',
        timestamp:new Date().toISOString()
    })
})

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})