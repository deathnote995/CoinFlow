import User from "../models/User.model.js"
import logger from "../utils/logger.js"

//Create User logic moved to auth.controler.js
/* 
export const createUser=async(req,res)=>{
    try {
        
        const {name, email, passwordHash, balanceAlertThreshold}=req.body
        
        if(!name||!email||!passwordHash)
            return res.status(400).json({success:false,message:'One of the necessary feilds is missing'})
        
        const existingUser=await User.findOne({email})
        if(existingUser)
            return res.status(400).json({success:false,message:'User with this email already exist'})
        
        const user=await User.create({name, email, password:passwordHash, balanceAlertThreshold:balanceAlertThreshold||500})
        logger.info(`User created successfully: ${email}`)
        return res.status(201).json({success:true,message:'User created successfully',data:user})
        
    } catch (error) {
        logger.error(`Error in creating user: ${error.message}`)
        return res.status(500).json({success:false,message:'Some server error occured while creating user'})
    }
}
*/

// Get user profile details
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        logger.error(`Error fetching user profile: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Update user settings (name, phone, balanceAlertThreshold, themePreference)
export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, phone, balanceAlertThreshold, themePreference } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (balanceAlertThreshold !== undefined) updateData.balanceAlertThreshold = balanceAlertThreshold;
        if (themePreference && ['light', 'dark'].includes(themePreference)) {
            updateData.themePreference = themePreference;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        logger.info(`User profile updated: ${userId}`);
        return res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedUser });
    } catch (error) {
        logger.error(`Error updating user profile: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// Standalone theme update controller
export const userThemeUpdate=async(req,res)=>{
    try{
        const {userId}=req.params
        const {themePreference}=req.body

        if(!['light','dark'].includes(themePreference))
            return res.status(400).json({success:false,message:'Invalid theme preference'})

        const updateUser=await User.findByIdAndUpdate(
            userId,
            {themePreference},
            {new:true,runValidators:true}).select('-password')

        if(!updateUser)
            return res.status(404).json({success:false,message:'User not found'})
        
        return res.status(201).json({
            success:true,
            message:`Theme successfully updated to ${themePreference}`,
            data:{themePreference:updateUser.themePreference}
        })
    } catch(error){
        logger.error(`Error updating theme: ${error.message}`)
        res.status(500).json({success:false,message:'Some server error occured',error:error.message})
    }
}