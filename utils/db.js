require("dotenv").config();
const mongoose = require("mongoose");
const keys = require("../config/keys");
const clc = require("cli-color");
const { database } = keys
const setupDB = async () => {
    try {

        mongoose.connect(database.url).then(() => console.log(`${clc.green('✓')} ${clc.blue('MongoDB Connected!')}`)).catch(err => console.log(err))
    } catch (error) {
        console.log(error);

    }
}
module.exports = setupDB