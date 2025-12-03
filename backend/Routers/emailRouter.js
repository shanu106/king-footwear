const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,

    },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;