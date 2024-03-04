const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../db');
const bcryptjs = require("bcryptjs");
const router = express.Router();

require('dotenv').config();

/**
 * @swagger
 * /forgotPassword:
 *  post:
 *      summary: api to send email to user to reset password
 *      description: Send email to user to reset password
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Email address of the user
 *      responses:
 *          '200':
 *              description: Email sent
 */
router.post('/', (req, res) => {
    const { email } = req.body;
    if (true) {
        sendEmail(email);
        res.send('Email sent');
    } else {
        res.send('Email not found');
    }
});

/**
 * @swagger
 * /forgotPassword/reset-password:
 *  post:
 *      summary: api to set new password for the user
 *      description: Set new password for the user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Email address of the user
 *                          password:
 *                              type: string
 *                              description: New password of the user
 *      responses:
 *          '200':
 *              description: Password reset successfully
 *          '500':
 *              description: Could not reset password
 */
router.post('/reset-password', (req, res) => {
    const { email, password } = req.body;
    const connection = db.connectToServer();
    const numSaltRounds = 1;
    const hash = bcryptjs.hashSync(password, numSaltRounds);

    connection.query(`update user set user_password = '${hash}' where user_email = '${email}'`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Could not reset password");
            return;
        }
        res.status(200).send("Password reset successfully");
    });

    db.disconnectFromServer(connection);
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'scunge352@gmail.com',
        pass: process.env.GMAIL_ACCOUNT_PASSWORD
    }
});

async function sendEmail(email) {
    const mailOptions = {
        from: 'scunge352@gmail.com',
        to: 'raisahil580@gmail.com',
        subject: 'Password Reset',
        text: 'Follow this link to reset your password: https://yourapp.com/reset-password?token=generatedToken'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;