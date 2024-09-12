/*const express = require('express');
const cron = require('node-cron');

const app = express();
let myVariable = 0;

// Schedule a task to run every minute
cron.schedule('* * * * * *', () => {
  myVariable++;
  console.log(`Variable updated to: ${myVariable}`);
});

// Define a route to access the variable
app.get('/variable', (req, res) => {
  res.send(`Current value of the variable is: ${myVariable}`);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/










require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const mysql = require('mysql2');
const {dev,prod} = require('./constants')

const app = express();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.NODE_ENV === 'development' ? dev.host : prod.host,
  user: process.env.NODE_ENV === 'development' ? dev.user : prod.user,
  password: process.env.NODE_ENV === 'development' ? dev.password : prod.password,
  database: process.env.NODE_ENV === 'development' ? dev.database : prod.database,
  port: process.env.NODE_ENV === 'development' ? dev.port : prod.port,
});

// Connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');

  // Create table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS timestamps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp DATETIME
    )
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Table created or already exists');
  });
});

// Schedule a task to run every second
cron.schedule('* * * * * *', () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
  const insertQuery = 'INSERT INTO timestamps (timestamp) VALUES (?)';
  connection.query(insertQuery, [formattedDate], (err, results) => {
    if (err) throw err;
    console.log(`Timestamp stored: ${formattedDate}`);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});