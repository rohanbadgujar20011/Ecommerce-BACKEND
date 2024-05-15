const { type, contentType } = require('express/lib/response');
const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const merchant = require('./merchant');
const options = {
    separator: '-',
    lang: 'en',
    truncate: 120
};

const BrandSchema = new Mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
        trim: true

    },
    isActive: {
        type: Boolean,
        default: true
    },
    merchant: {

        type: Schema.Types.ObjectId,
        ref: 'Merchant',
        default: null
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }

}

)