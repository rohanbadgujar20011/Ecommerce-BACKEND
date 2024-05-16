const express = require('express');
const crypto = require('crypto')
const authrouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/auth")
const User = require("../../models/user")
const keys = require('../../config/keys')
const { EMAIL_PROVIDER } = require("../../constants")
const { sendEmail } = require('../../services/mail')

const { secret, tokenLife } = keys.jwt;
authrouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({ error: "You must enter an email" })
        }
        if (!password) {
            return res.status(400).send({ error: "You must enter a password" })

        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "No User For this email address" })
        }
        if (user && user.provider !== EMAIL_PROVIDER.Email) {
            return res.status(400).send({ error: `That email address is already in use using  ${user.provider} provider` })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ success: false, error: "Password Incorrect" })
        }
        const payload = {
            id: user.id
        }

        const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
        if (!token) {
            throw new Error();
        }
        return res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user: {
                id: user.id,
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                role: user.role

            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: 'Your request can not be proceed .Please try again'
        })
    }
})

authrouter.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: "You must enter an email address" })
        }
        if (!firstName || !lastName) {
            return res.status(400).json({ error: "You must enter full name" })
        }
        if (!password) {
            return res.status(400).json({ error: 'You must enter password' })
        }
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ error: "Email Id already present" })
        }
        const user = new User({
            email, password, firstName, lastName
        })
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        const registeredUser = await user.save();
        const payload = {
            id: registeredUser.id
        }
        const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
        res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user: {
                id: registeredUser.id,
                firstName: registeredUser.firstName,
                lastName: registeredUser.lastName,
                email: registeredUser.email,
                role: registeredUser.role
            }
        })

    } catch (error) {

        res.status(400).json({ error: 'Your request could not be processed. Please try again.' })

    }
})
authrouter.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res
                .status(400)
                .json({ error: 'You must enter an email address.' });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res
                .status(400)
                .send({ error: 'No user found for this email address.' });
        }

        const buffer = crypto.randomBytes(48);
        const resetToken = buffer.toString('hex');


        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpires = Date.now() + 3600000;

        existingUser.save();

        await sendEmail(
            existingUser.email,
            'reset',
            req.headers.host,
            resetToken
        );

        res.status(200).json({
            success: true,
            message: 'Please check your email for the link to reset your password.'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});
module.exports = authrouter;