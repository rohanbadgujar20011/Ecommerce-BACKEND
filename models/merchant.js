const Mongoose=require('mongoose');
const {MERCHANT_STATUS}=require('../constants');
const MerchantSchema=new Mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String
    },
    phoneNumber:{
        type : String
    },
    brandName:{
        type:String
    },
    business:{
        type:String,
        trim:true
    },
    isActive:{
        type : Boolean,
        default:false
    },
    brand:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        default:null
    },
    status:{
        type : String,
        default: MERCHANT_STATUS.Waiting_Approval,
        enum:[
            MERCHANT_STATUS.Waiting_Approval,
            MERCHANT_STATUS.Rejected,
            MERCHANT_STATUS.Approved
        ]
    },
    updated:Date,
    created:{
        type:Date,
        default:Date.now
    }
})
module.exports=Mongoose.model('Merchant',MerchantSchema);