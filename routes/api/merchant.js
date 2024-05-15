const express = require('express')
const merchantRouter = express.Router();
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const { ROLES, MERCHANT_STATUS } = require('../../constants');
const Merchant = require("../../models/merchant");
const Brand = require('../../models/brand');
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

// search merchants api
merchantRouter.get('/search', auth, role.check(ROLES.Admin), async (req, res) => {
    try {
        const { search } = req.query;
        const regex = new RegExp(search, 'i');
        const merchants = await Merchant.find({
            $or: [
                { phoneNumber: { $regex: regex } },
                { email: { $regex: regex } },
                { name: { $regex: regex } },
                { brandName: { $regex: regex } },
                { status: { $regex: regex } }
            ]
        }).populate('brand', 'name');
        res.status(200).json({ merchants })
    } catch (error) {
        res.status(400).json({
            error: "Your request not be proceed. Please try again."
        })

    }
});
// fetch all merchants api
merchantRouter.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const merchants = await Merchant.find()
            .populate('brand')
            .sort('created')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
    } catch (error) {

    }
})
module.exports = merchantRouter;
