import nodemailer from 'nodemailer'
import logger from './logger.js'

const tranporter=nodemailer.createTransport({
    host:process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port:process.env.SMTP_PORT || 587,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})

// logger.debug("SMTP Config Check:", {
//     mongo:process.env.MONGO_URI,
//     host: process.env.SMTP_HOST,
//     user: process.env.SMTP_USER,
//     passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
// })
// console.log("SMTP Config Check:", {
//     mongo:process.env.MONGO_URI,
//     host: process.env.SMTP_HOST,
//     user: process.env.SMTP_USER,
//     passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
// })

export const sendEmailAlert=async(toEmail,subject,htmlContent)=>{
    try {
        if(!process.env.SMTP_USER||process.env.NODE_ENV==='production'){ //remember to change it later to development
            logger.info(`[DEV MOCK EMAIL] To: ${toEmail} | Subject: "${subject}" | Content: "${htmlContent}"`)
            return {success:true,mock:true}
        }

        const info=await tranporter.sendMail({
            from: '"Coinflow Financial Intelligence" <rajat.cavisson2003@gmail.com  >',
            to:toEmail,
            subject:subject,
            html:htmlContent
        })

        logger.info(`Email sent successfully to ${toEmail}: ${info.messageId}`)
        return {success:true}
    } catch (error) {
        logger.error(`Failed to send Email to ${toEmail}: ${error.message}`)
        return {success:false,error:error.message}
    }
}