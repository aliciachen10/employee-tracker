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
    password: 'Syzygy666!',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

// Read all DEPARTMENTS
app.get('/api/departments', (req, res) => {
  const sql = `SELECT * FROM department order by name asc;`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Read all ROLES
app.get('/api/roles', (req, res) => {
  const sql = `select a.id, a.title, b.name as department, salary from role a
  left join department b 
  on a.department_id = b.id
  order by id, salary;`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

//READ ALL EMPLOYEES
app.get('/api/employees', (req, res) => {
  const sql = `select a.id, a.first_name, a.last_name, b.title, c.name as department, b.salary, d.manager from employee a
  left join role b
  on a.role_id = b.id
  left join department c 
  on b.department_id = c.id
  left join (select a.id, a.first_name, a.last_name, concat(b.first_name, " ", b.last_name) as manager from employee a 
  left join employee b 
  on a.manager_id = b.id) d
  on a.id = d.id;`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

//ADD A DEPARTMENT
app.post('/api/new-department', (req, res) => {
  const dept_name = req.body.dept_name;
  const sql = `INSERT INTO department (name)
    VALUES (?)`;
  
  db.query(sql, dept_name, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: req.body
    });
  });
});

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
db.query('SELECT * FROM department order by name asc;', function (err, results) {
  console.table(results);
  console.log('^^ query')
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
