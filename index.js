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
          name: 'action',
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

  function viewAllRoles() {
    const query = `
      SELECT roles.id, roles.title, departments.name AS department, roles.salary
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.id
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
  
  function viewAllEmployees() {
    const query = `
      SELECT 
        employees.id, employees.first_name, employees.last_name,
        roles.title, departments.name AS department, roles.salary,
        CONCAT(managers.first_name, ' ', managers.last_name) AS manager
      FROM employees
      INNER JOIN roles ON employees.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees AS managers ON employees.manager_id = managers.id
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
 
  function addDepartment() {
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'Enter the name of the department:',
        },
      ])
      .then((answer) => {
        connection.query('INSERT INTO departments SET ?', answer, (err) => {
          if (err) throw err;
          console.log('Department added successfully!');
          mainMenu();
        });
      });
  }
  
  function addRole() {
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for the role:',
          validate: (input) => {
            return !isNaN(input) || 'Please enter a valid number';
          },
        },
        {
          name: 'department_id',
          type: 'input',
          message: 'Enter the department ID for the role:',
          validate: (input) => {
            return !isNaN(input) || 'Please enter a valid number';
          },
        },
      ])
      .then((answer) => {
        connection.query('INSERT INTO roles SET ?', answer, (err) => {
          if (err) throw err;
          console.log('Role added successfully!');
          mainMenu();
        });
      });
  }
  
  function addEmployee() {
    inquirer
      .prompt([
        {
          name: 'first_name',
          type: 'input',
          message: "Enter the employee's first name:",
        },
        {
          name: 'last_name',
          type: 'input',
          message: "Enter the employee's last name:",
        },
        {
          name: 'role_id',
          type: 'input',
          message: "Enter the employee's role ID:",
          validate: (input) => {
            return !isNaN(input) || 'Please enter a valid number';
          },
        },
        {
          name: 'manager_id',
          type: 'input',
          message: "Enter the employee's manager ID:",
          validate: (input) => {
            return !isNaN(input) || 'Please enter a valid number';
          },
        },
      ])
      .then((answer) => {
        connection.query('INSERT INTO employees SET ?', answer, (err) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          mainMenu();
        });
      });
  }
  