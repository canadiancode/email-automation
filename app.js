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
const port = process.env.PORT || 2000;

// Middleware to set Access-Control-Allow-Origin header and handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(express.json()); // Middleware to parse JSON bodies

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
        subject: 'Alpha',
        text: 
        `Hi there, Please see the materials you requested. Gentle reminder: this communication does not constitute a fiduciary relationship. Conversely, this an educational document which reflects upon what I have learnt in my eight years of cryptocurrency experience. Distribute the email registration as you please. Forever thankful, Learn2Earn
        `,
        html: 
        `
        <p>Hi there,
        <br>
        <p>Please see <a href="https://docs.google.com/document/d/1IMaF8xFNu881S_BJRVjZ_-BWf2d8we5y3qjIxDRiOmk/edit?usp=sharing">the materials you requested</a>. Gentle reminder: this communication does not constitute a fiduciary relationship.
        <br>
        <p>Conversely, this an educational document which reflects upon what I have learnt in my eight years of cryptocurrency experience.
        <br>
        <p>Distribute the email registration as you please.
        <br>
        <p>Forever thankful,
        <br>
        <p>Learn2Earn
        `,
    };
    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent: ' + info.response);
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