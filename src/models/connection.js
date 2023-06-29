const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST
const MYSQL_USER = process.env.MYSQL_USER
const MYSQL_PASS = process.env.MYSQL_PASS
const MYSQL_DATABASE = process.env.MYSQL_DATABASE

const cronnos = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DATABASE
});

const artemis = mysql.createPool({
    host: process.env.ARTEMIS_MYSQL_HOST,
    user: process.env.ARTEMIS_MYSQL_USER,
    password: process.env.ARTEMIS_MYSQL_PASS,
    database: process.env.ARTEMIS_MYSQL_DATABASE
})

module.exports = {
    cronnos,
    artemis
}
