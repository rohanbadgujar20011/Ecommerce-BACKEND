const express = require('express')
const merchantRouter = express.Router();
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const { ROLES, MERCHANT_STATUS } = require('../../constants');
const Merchant = require("../../models/merchant");
const Brand = require('../../models/brand');
const auth = require("../../middleware/auth")
const role = require("../../middleware/role");
const { status } = require('express/lib/response');
const { sendEmail } = require('../../services/mail')

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
merchantRouter.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const merchants = await Merchant.find()
            .populate('brand')
            .sort('created')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count = await Merchant.countDocuments();
        res.status(200).json({
            merchants,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            count

        })
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });

    }
});
// disable merchant account
merchantRouter.put('/:id/active', auth, async (req, res) => {
    try {
        const merchantId = req.params.id;
        const update = req.body.merchant;
        const query = { _id: merchantId };
        const merchantDoc = await Merchant.findByIdAndUpdate(merchantId, update, {
            new: true
        })

        if (!update.isActive) {
            await deactiveBrand(merchantId);
            await sendEmail(merchantDoc.email, 'merchant-deactivate-account');

        }
        res.status(200).json({
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Your request could not be processed. Please try again.' })
    }
})
//approve merchant
merchantRouter.put('/approve/:id', auth, async (req, res) => {
    try {
        const merchantId = req.params.id;
        const query = { _id: merchantId }
        const update = {
            status: MERCHANT_STATUS.Approved,
            isActive: true
        }
        const merchantDoc = await Merchant.findOneAndUpdate(query, update, {
            new: true
        });


    } catch (error) {

    }

})
//approve merchant
merchantRouter.put('/approve/:id', auth, async (req, res) => {
    try {
      const merchantId = req.params.id;
      const query = { _id: merchantId };
      const update = {
        status: MERCHANT_STATUS.Approved,
        isActive: true
      };
  
      const merchantDoc = await Merchant.findOneAndUpdate(query, update, {
        new: true
      });
  
      await createMerchantUser(
        merchantDoc.email,
        merchantDoc.name,
        merchantId,
        req.headers.host
      );
  
      res.status(200).json({
        success: true
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  });
  
const deactiveBrand = async merchantId => {
    const merchantDoc = await Merchant.findOne({ _id: merchantId })
        .populate('brand', '_id');
    if (!merchantDoc || !merchantDoc.brand) return
    const brandId = merchantDoc.brand._id;
    const query = { _id: brandId }
    const update = {
        isActive: false
    };
    return await Brand.findOneAndDelete(query, update, {
        new: true
    })

}

const createMerchantUser=async(email,name,_id,host)=>{
    const firstName=name;
    const lastName='';
    c
}
module.exports = merchantRouter;
