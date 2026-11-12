import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    walletId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Wallet'
    },
    amount:{
        type:Number,
        required:[true,'Pease specify a transaction amount']
    },
    type:{
        type:String,
        enum:['income','expense','transfer'],
        required:[true,'Please specify whether this is an income, expense or transfer']
    },
    category:{
        type:String,
        required:[true,'Please specify a category for insights'],
        default:'General',
        trim:true
    },
    description:{
        type:String,
        required:[true,'Please add a merchant or transaction description'],
        trim:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    isAutoFetched:{
        type:Boolean,
        default:false
    }
},{timeseries:true})

const Transaction=mongoose.model('Transaction',transactionSchema)

export default Transaction