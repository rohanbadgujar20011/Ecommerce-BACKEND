const express = require('express')
const merchantRouter = express.Router();
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const { ROLES, MERCHANT_STATUS } = require('../../constants');
const Merchant = require("../../models/merchant");
const auth = require("../../middleware/auth")
const role = require("../../middleware/role")

merchantRouter.post('/add', async (req, res) => {
    try {
        const { name, business, phoneNumber, email, brandName } = req.body;
        if (!name || !email || !phoneNumber) {
            return res.status(400).json({ error: 'You must enter your name,email,phonenumber' })
        }
        if (!business) {
            return res.status(400).json({ error: 'You must enter your business name' })
        }
        const existingMerchant = await Merchant.findOne({ email });
        if (existingMerchant) {
            return res.status(400).json({ error: 'That email address is already in use' })

        }
        const merchant = new Merchant({
            name,
            email,
            business,
            phoneNumber,
            brandName
        })
        const merchantDoc = await merchant.save();

        res.status(200).json({
            success: true,
            message: `We recived your request we will reach you on your phone number ${phoneNumber}`,
            merchant: merchantDoc
        })

    } catch (error) {
        return res.status(400).json({
            error: 'Your request could not be processed. Please try again. '
        });
    }
});
module.exports=merchantRouter;
