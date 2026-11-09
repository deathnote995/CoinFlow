import mongoose from "mongoose";

const walletSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    accName:{
        type:String,
        required:[true,'Please add an account name'],
        trim:true
    },
    accNumber:{
        type:String,
        required:[true,'Please add an account number'],
        trim:true
    },
    curBalance:{
        type:Number,
        required:true,
        default:0
    },
    accType:{
        type:String,
        enum:['savings','wallet','credit','current','salary'],
        default:'savings'
    }
},{timestamps:true})

const Wallet=mongoose.model('Wallet',walletSchema)

export default Wallet