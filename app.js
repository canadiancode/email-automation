// Installed packages
// express
// cors
// googleapis
// dotenv
// nodemailer
// axios

require('dotenv').config();
const express = require('express');
let cors = require("cors");
const axios = require('axios');
const querystring = require('querystring');
const nodemailer = require('nodemailer');

// Start Express app
const app = express();
const port = 2000;

// Middleware to enable CORS
app.use(cors());
app.options('*', cors());

// Middleware to set Access-Control-Allow-Origin header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route for handling POST requests
app.post('/email', async (req, res) => {

    // The email from the client
    const email = req.body.email;
    console.log('The email: ', email);

    // Sending the email to the user //
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
    });
    // Construct the email
    const mailOptions = {
    from: 'Learn2Earn',
    to: email,
    subject: 'Your Free PDF Awaits!',
    text: 'Click here to download your free PDF!',
    html: '<p><a href="https://cdn.shopify.com/s/files/1/0024/9551/2691/files/2022_07_24.pdf?v=1679598431">Click here</a> to download your free PDF!</p>'
    };
    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Email sent' });
    }
    });

    // Adding the email to Google Sheets //
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzDDCFAXLkv5XOGZJcjEiuMKz6PlXuLKw1zAGZJ0SBMVat-7z37eoIHATAX4m876beC/exec';
    axios.post(scriptUrl, querystring.stringify({ email }), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    })
    .then(response => {
        console.log('Response:', response.data);
        res.json(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
        res.json(error)
    });

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

