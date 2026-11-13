import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please add a valid email'],
        lowercase:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Please add a secure password'],
        minlength:[8,'Password must be atleast 8 characters long'],
        unique:true,
    },
    phone:{ //Optional
        type:String,
        trim:true
    },

    //2FA and Verification status
    isEmailVerified:{
        type:Boolean,
        default:false
    },

    //Temporay otp storage for 2FA and pass resets
    otpCode:{type:String},
    otpExpire:{type:Date},

    balanceAlertThreshold:{
        type:Number,
        default:500
    },
    themePreference:{
        type:String,
        enum:['light','dark'],
        default:'light'
    }
},{timestamps:true})

userSchema.pre('save',async function(){
    if(!this.isModified('password'))
        return
    try {
        const salt=await bcrypt.genSalt(10)
        this.password=await bcrypt.hash(this.password,salt)
    } catch (error) {
        throw error
    }
})

const User=mongoose.model('User',userSchema)

export default User