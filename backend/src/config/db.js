import mongoose from 'mongoose'
import logger from '../utils/logger.js'
// import dotenv from 'dotenv'
// dotenv.config()
mongoose.set('strictQuery',false)

// console.log(process.env.MONGO_URI)

const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI)
        logger.debug(`Connected to DB at : ${conn.connection.host}`)
    } catch (error) {
        logger.error(`Error while connecting to DB : ${error.message}`)
        process.exit(1)
    }
}

export default connectDB