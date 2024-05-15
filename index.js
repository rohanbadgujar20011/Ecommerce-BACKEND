const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const clc = require("cli-color");
require("dotenv").config();
const keys = require("./config/keys");
const setupDB = require("./utils/db")
const routes = require('./routes');

const { port } = keys;
const app = express();
setupDB();
require('./config/passport')(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: false,
    frameElement: true,
}));
app.use(cors());
app.use(routes);

const server = app.listen(port, () => {
    console.log(clc.blue(`${clc.green("✓")} Listening on Port ${port}. Visit http://localhost:${port}/ in your browser.`)); // Using cli-color to colorize text
});
