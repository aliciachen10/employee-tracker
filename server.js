const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

const questions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
    name: 'choice'
  },
  {
    type: 'input',
    message: 'What is the name of your department?',
    name: 'newDepartment',
    when: (answers) => answers.choice === 'Add Department'
    // value: id from the database. if they select 'human resources' it returns in the db the actual id
    //update ____ where id = response.id  
  },
  {
    type: 'input',
    message: 'What is the name of your role?',
    name: 'newRole',
    when: (answers) => answers.choice === 'Add Role'
  },
  {
    type: 'input',
    message: 'What is the salary of the role?',
    name: 'newSalary',
    when: (answers) => answers.choice === 'Add Role'
  },
  {
    type: 'input',
    message: 'What department does the role belong to?',
    name: 'roleDepartment',
    when: (answers) => answers.choice === 'Add Role'
  },
  {
    type: 'input',
    message: 'What is the employee\'s first name?',
    name: 'firstName',
    when: (answers) => answers.choice === 'Add Employee'
  },
  {
    type: 'input',
    message: 'What is the employee\'s last name?',
    name: 'lastName',
    when: (answers) => answers.choice === 'Add Employee'
  },
  {
    type: 'list',
    message: 'What is the employee\'s role?',
    name: 'employeeRole',
    choices: db.query(`select title from role;`, (err, rows) => {console.log(rows.map(a => a.title))}),
    when: (answers) => answers.choice === 'Add Employee'
  },
  {
    type: 'input',
    // type: 'list',
    message: 'Who is the employee\'s manager?',
    name: 'manager',
    // choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown'],
    when: (answers) => answers.choice === 'Add Employee'
  },
  {
    type: 'list',
    message: 'Which employee\'s role do you want to update?',
    name: 'roleUpdate',
    choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen'],
    when: (answers) => answers.choice === 'Update Employee Role'
  },
  {
    type: 'list',
    message: 'Which role do you want to assign the selected employee?',
    name: 'newRoleAssign',
    choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer'],
    when: (answers) => answers.choice === 'Update Employee Role'
  }
];

// Read all DEPARTMENTS
const getAllDepartments = () => {
  const sql = `SELECT * FROM department order by name asc;`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error");
      // res.status(500).json({ error: err.message });
       return;
    }
    console.table(rows);
    // res.json({
    //   message: 'success',
    //   data: rows
    // });
  });
};

//ADD A DEPARTMENT
const addDepartment = newDepartment => {
  // const dept_name = answers.newDepartment;
  const sql = `INSERT INTO department (name)
    VALUES (?)`;
  
  db.query(sql, newDepartment, (err, result) => {
    if (err) {
      console.log("error")
      // res.status(400).json({ error: err.message });
      return;
    }
    console.table(`successfully added ${newDepartment} into the database`)
    // res.json({
    //   message: 'success',
    //   data: req.body
    });
  };

// Read all ROLES
const getAllRoles = () => {
  const sql = `select a.id, a.title, b.name as department, salary from role a
  left join department b 
  on a.department_id = b.id
  order by id, salary;`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error")
      // res.status(500).json({ error: err.message });
       return;
    }
    console.table(rows)
    // res.json({
    //   message: 'success',
    //   data: rows
    // });
  });
};

//READ ALL EMPLOYEES
const getAllEmployees = () => {
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
      console.log("error")
      // res.status(500).json({ error: err.message });
       return;
    }
    console.table(rows)
    // res.json({
    //   message: 'success',
    //   data: rows
    // });
  });
};

//ADD AN EMPPLOYEE
const addEmployee = (firstName, lastName, employeeRole, manager) => {
  // values (1, "John", "Doe", 1, NULL),
  const sql = `insert into employee (first_name, last_name, role_id, manager_id)
  VALUES (?, ?, ?, ?)`;
  
  db.query(sql, [firstName, lastName, employeeRole, manager], (err, result) => {
    if (err) {
      console.log("error")
      // res.status(400).json({ error: err.message });
      return;
    }
    console.table(`successfully added ${firstName} ${lastName} into the database`)
    // res.json({
    //   message: 'success',
    //   data: req.body
    });
  };

// TODO: Create a function to initialize app
function init() {
  inquirer
  .prompt(questions)
  .then(function (answers) {
    // potential answers 
    // 'Add Employee' (NEEDS TOUCHING UP), 'Update Employee Role', 'Add Role', 'Quit'
    switch (answers.choice) {
      case "View All Departments": 
        getAllDepartments();
        // return init();
        break;
      case "View All Employees": 
        getAllEmployees();
        // init();
        break;
      case "View All Roles": 
        getAllRoles(answers.roleUpdate, answers.newRoleAssign);
        // init();
        break;
      case "Add Employee":
        addEmployee(answers.firstName, answers.lastName, answers.employeeRole, answers.manager);
        break;
      case "Update Employee Role":
        updateEmployeeRole();
      case "Add Department":
        addDepartment(answers.newDepartment);
        break;
      // case "Quit":
      //   return init();
      //   // break;
      //   // if (answer.moreQuery) return init();
    }
  }
  );
}

//ADD A ROLE
app.put('api/new-role', function (req, res) {
  const title = req.body.title;
  const salary = req.body.salary;
  const department_id = req.body.department_id;
  const sql = `INSERT INTO insert into role (title, salary, department_id) values (?, ?, ?)`
  db.query(sql, 
  [title, salary, department_id], (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.table(result)
    res.json({
      message: 'success'
    })
  });
})


// Query database
// db.query('SELECT * FROM department order by name asc;', function (err, results) {
//   console.table(results);
//   console.log('^^ query')
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});


// Function call to initialize app
init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//to do:
//make quit work
//call itself so that someone can select a menu option after they've already performed one action
//make sure the menu option is above the rest 
