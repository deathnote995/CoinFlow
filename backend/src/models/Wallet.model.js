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
        enum:['Savings','Wallet','CreditCard','Current','Salary','Cash','MutualFund_SIP'],
        default:'savings',
        required:[true,'Please specify the account type']
    },
    isActive:{
        type:Boolean,
        default:true
    },
    metadata:{
        interestRate:{type:Number},
        maturityDate:{type:Date},
        sipAmount:{type:Number},
        sipFrequency:{type:String,enum:['Monthly','Weekly','Daily']}
    }
},{timestamps:true})

const Wallet=mongoose.model('Wallet',walletSchema)

export default Wallet