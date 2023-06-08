const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const db = require('./config/connection');

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
        switch (answer.action) {
          case 'View all departments':
            viewAllDepartments();
            break;
          case 'View all roles':
            viewAllRoles();
            break;
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            db.end(); // Close the database connection
            return;
        }
      });
  }
  
  // Call the mainMenu function to start the application
  mainMenu();
  
  function viewAllDepartments() {
    db.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }

  function viewAllRoles() {
    const query = `
      SELECT roles.id, roles.title, departments.department_name, roles.salary
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.id
    `;
    db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
      
  function viewAllEmployees() {
    const query = `
      SELECT 
        employees.id, employees.first_name, employees.last_name,
        roles.title, departments.department_name AS department, roles.salary,
        CONCAT(managers.first_name, ' ', managers.last_name) AS manager
      FROM employees
      INNER JOIN roles ON employees.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees AS managers ON employees.manager_id = managers.id
    `;
    db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
 
  function addDepartment() {
    inquirer
      .prompt([
        {
          name: 'department_name',
          type: 'input',
          message: 'Enter the name of the department:',
        },
      ])
      .then((answer) => {
        db.query('INSERT INTO departments (department_name) VALUES (?)', [answer.department_name], (err) => {
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
        db.query('INSERT INTO roles SET ?', answer, (err) => {
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
        db.query('INSERT INTO employees SET ?', answer, (err) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          mainMenu();
        });
      });
  }
  
  function updateEmployeeRole() {
    // Fetch the list of employees for the prompt
    db.query('SELECT * FROM employees', (err, employees) => {
      if (err) throw err;
  
      // Prompt for employee selection
      inquirer
        .prompt([
          {
            name: 'employee_id',
            type: 'list',
            message: 'Select an employee to update:',
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: 'role_id',
            type: 'input',
            message: 'Enter the new role ID for the employee:',
            validate: (input) => {
              return !isNaN(input) || 'Please enter a valid number';
            },
          },
        ])
        .then((answer) => {
          db.query(
            'UPDATE employees SET role_id = ? WHERE id = ?',
            [answer.role_id, answer.employee_id],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              mainMenu();
            }
          );
        });
    });
  }
  