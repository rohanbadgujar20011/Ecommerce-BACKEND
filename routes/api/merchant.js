const express=require('express')
const merchantRouter=express.Router();
const bcrypt =require('bcryptjs')
const crypto=require('crypto')

const {ROLES,MERCHANT_STATUS}=require('../../constants');
const Merchant=require("../../models/merchant");
const auth=require("../../middleware/auth")
const role=require("../../middleware/role")