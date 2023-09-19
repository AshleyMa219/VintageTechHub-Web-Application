function resetPasswordConfirm(email,password){
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
        subject: 'Reset Password Confirm!',
        text: 'Your Account Password has been changed.',
    };
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return "Success";
}
module.exports=resetPasswordConfirm