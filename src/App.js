const express = require('express');
const cors = require('cors');
const router = require('./Router');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log("access");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
    app.use(cors());
    next();
});
app.use(router);

module.exports = app;