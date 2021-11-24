// config.js
const dotenv = require('dotenv');
const mysql = require("mysql2");
dotenv.config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

module.exports = {
  db
};