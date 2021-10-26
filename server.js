const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const questions = [
  {
    type: 'input',
    message: 'What is the name of your department?',
    name: 'newDepartment',
  },
  {
    type: 'input',
    message: 'What is the name of your role?',
    name: 'newRole',
  },
  {
    type: 'input',
    message: 'What is the salary of the role?',
    name: 'newSalary'
  },
  {
    type: 'input',
    message: 'What department does the role belong to?',
    name: 'roleDepartment'
  },
  {
    type: 'input',
    message: 'What is the employee\'s first name?',
    name: 'firstName'
  },
  {
    type: 'input',
    message: 'What is the employee\'s last name?',
    name: 'lastName'
  },
  {
    type: 'input',
    message: 'What is the employee\'s role?',
    name: 'employeeRole'
  },
  {
    type: 'list',
    message: 'Who is the employee\'s manager?',
    name: 'manager',
    choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown']
  },
  {
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
    name: 'choice'
  },
  {
    type: 'list',
    message: 'Which employee\'s role do you want to update?',
    name: 'roleUpdate',
    choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen']
  },
  {
    type: 'list',
    message: 'Which role do you want to assign the selected employee?',
    name: 'newRoleAssign',
    choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
  }
];

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the employee_db database.`)
);

app.put('api/:title/:salary/:department', function (req, res) {
  const title = req.body.title;
  const salary = req.params.salary;
  const department = req.params.department;
  db.query(`INSERT INTO insert into role (id, title, salary, department_id) values (1, ?, ?, ?)`, 
  [title, salary, department_id], (err, result) => {
    if (err) throw error;
    res.json({
      message: 'success'
    })
    console.log(result);
  });
})


// Query database
db.query('SELECT database();', function (err, results) {
  console.log(results);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
