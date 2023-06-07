require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Test the database connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

module.exports = db;
