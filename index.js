const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

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

function mainMenu() {
    inquirer
      .prompt([
        {
          name: 'choice',
          type: 'list',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit',
          ],
        },
      ])
      .then((answer) => {
        switch (answer.choice) {
          case 'View all departments':
            // Call the function to view all departments
            break;
          case 'View all roles':
            // Call the function to view all roles
            break;
          case 'View all employees':
            // Call the function to view all employees
            break;
          case 'Add a department':
            // Call the function to add a department
            break;
          case 'Add a role':
            // Call the function to add a role
            break;
          case 'Add an employee':
            // Call the function to add an employee
            break;
          case 'Update an employee role':
            // Call the function to update an employee role
            break;
          case 'Exit':
            connection.end(); // Close the database connection
            return;
        }
      });
  }
  
  // Call the mainMenu function to start the application
  mainMenu();
  
  function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
  