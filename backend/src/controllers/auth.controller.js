import User from '../models/User.model.js';
import { sendEmailAlert } from '../utils/email.service.js';
import logger from '../utils/logger.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Register User & Trigger Email 2FA OTP
export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, balanceAlertThreshold } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const otp = generateOTP();
        const otpExpire = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

        const user = await User.create({
            name,
            email,
            phone: phone || '',
            password,
            balanceAlertThreshold: balanceAlertThreshold || 500,
            otpCode: otp,
            otpExpire,
            isEmailVerified: false
        });

        // Send 2FA verification OTP via Email (Free of cost!)
        await sendEmailAlert(
            email, 
            'Verify Your CoinFlow Account', 
            `<h3>Welcome to CoinFlow, ${name}</h3><p>Your email verification OTP is: <b>${otp}</b></p><p>This code is valid for 10 minutes.</p>`
        );

        logger.info(`User registered, awaiting email 2FA verification: ${email}`);
        return res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for the verification OTP.',
            userId: user._id
        });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
};

// 2. Verify Email 2FA OTP
export const verifyEmailOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified.' });
        }

        if (user.otpCode !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        user.isEmailVerified = true;
        user.otpCode = undefined;
        user.otpExpire = undefined;
        await user.save();

        logger.info(`Email successfully verified for user: ${user.email}`);
        return res.status(200).json({ success: true, message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        logger.error(`OTP verification error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error during verification' });
    }
};

// 3. Request Password Reset OTP (Forgot Password)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account associated with this email.' });
        }

        const otp = generateOTP();
        user.otpCode = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendEmailAlert(
            email,
            'CoinFlow Password Reset Request',
            `<p>You requested a password reset for your CoinFlow account.</p><p>Your reset OTP is: <b>${otp}</b></p><p>Valid for 10 minutes.</p>`
        );

        return res.status(200).json({ success: true, message: 'Password reset OTP sent to your email.' });
    } catch (error) {
        logger.error(`Forgot password error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error processing request' });
    }
};

// 4. Reset Password with OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide email, otp, and newPassword.' });
        }

        const user = await User.findOne({ email });
        if (!user || user.otpCode !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        user.password = newPassword; // Automatically hashed by pre-save hook!
        user.otpCode = undefined;
        user.otpExpire = undefined;
        await user.save();

        logger.info(`Password successfully reset for user: ${email}`);
        return res.status(200).json({ success: true, message: 'Password reset successfully. Please log in.' });
    } catch (error) {
        logger.error(`Reset password error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Server error resetting password' });
    }
};