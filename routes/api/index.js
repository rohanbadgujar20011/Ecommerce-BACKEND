const router = require('express').Router();
const authRoutes = require('./auth')
const merchantRouts=require('./merchant')
router.use("/auth", authRoutes);
router.use("/merchant", merchantRouts);
module.exports = router;
