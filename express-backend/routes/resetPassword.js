function resetPassword(email){
    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    const verificationLink = `http://localhost:3000/verify/passwordReset/${token}`;
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: 25,
        auth: {
            user: 'ecommerceapp@163.com',
            pass: "IUTNMQHFYGFFWULG"
        }
    });
    const message = {
        from: 'ecommerceapp@163.com',
        to: email,
        subject: 'Reset your password',
        text: `Click on this link to Reset your password: ${verificationLink}`,
        html: `Click <a href="${verificationLink}">here</a> to Reset your password.`
    };
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return token;
}
module.exports=resetPassword