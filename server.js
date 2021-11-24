const express = require("express");
const inquirer = require("inquirer");
const myQuestions = require('./orm/inquirer_questions');
const PORT = process.env.PORT || 3001;
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { db } = require('./config');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Read all DEPARTMENTS
const getAllDepartments = () => {
  const sql = `SELECT * FROM department order by name asc;`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error");
      console.log(err)
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
const addDepartment = () => {

  inquirer.prompt(myQuestions.addDepartmentQuestion).then(function(answer){


  // const dept_name = answers.newDepartment;
  const sql = `INSERT INTO department (name)
    VALUES (?)`;

  db.query(sql, answer.newDepartment, (err, result) => {
    if (err) {
      console.log("error");
      // res.status(400).json({ error: err.message });
      return;
    }
    console.table(`successfully added ${answer.newDepartment} into the database`);
    // res.json({
    //   message: 'success',
    //   data: req.body

    init();
  });
  });
  
};

//ADD A ROLE
//currently working on this function
const addRoleToDb = (title, salary, departmentId) => {
  // const dept_name = answers.newDepartment;
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;

  db.query(sql, [title, salary, departmentId], (err, result) => {
    if (err) {
      console.log("error");
      // res.status(400).json({ error: err.message });
      return;
    }
    console.table(`successfully added ${title} into the database`);
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

const addEmployeeToDb = (firstName, lastName, employeeRole, manager) => {
  // values (1, "John", "Doe", 1, NULL),
  const sql = `insert into employee (first_name, last_name, role_id, manager_id)
  VALUES (?, ?, ?, ?)`;

  db.query(sql, [firstName, lastName, employeeRole, manager], (err, result) => {
    if (err) {
      console.log("error");
      // res.status(400).json({ error: err.message });
      return;
    }
    console.log(
      `successfully added ${firstName} ${lastName} with role ${employeeRole} and ${manager} into the database`
    );

  });
};

// update role 
// set role_id = CONVERT ROLE_NAME TO ROLE_ID
// where first_name = ENTRY
// and last_name = ENTRY
const updateEmployeeInDb = (roleId, employeeId) => {
  // values (1, "John", "Doe", 1, NULL),
  const sql = `
  update employee
  set role_id = ?
  where id = ?;`;

  db.query(sql, [roleId, employeeId], (err, result) => {
    if (err) {
      console.log("error");
      // res.status(400).json({ error: err.message });
      return;
    }
    console.log(
      `successfully updated employeeId ${employeeId} with roleId ${roleId} in the database`
    );

  });
};

//convert employeeRole to employeeId
let roleId;

const convertToEmployeeId = (roleTitle) => {

  return db.promise().query("SELECT id FROM employee_db.role where title = ?;", roleTitle).then(rows => {
    roleId = rows[0][0].id;
    return rows[0][0].id;
  }).catch(err => console.log("employeerole error"));
};

//convert manager name to managerId
//or employeename to employeeId
let managerId;

const convertToManagerId = (managerName) => {

  return db.promise().query(
    `SELECT id FROM employee_db.employee 
    where first_name = SUBSTRING_INDEX(SUBSTRING_INDEX(?, ' ', 1), ' ', -1) 
    and last_name = TRIM(SUBSTR(?, LOCATE(' ', ?)) );`, 
    [managerName, managerName, managerName]).then(rows => {
    managerId = rows[0][0].id;
    return rows[0][0].id;
  }).catch(err => console.log("managerid error"));
};

//convert from department name to department id
const convertToDepartmentId = (departmentId) => {

  return db.promise().query("SELECT id FROM employee_db.department where name = ?;", departmentId).then(rows => {
    return rows[0][0].id;
  }).catch(err => console.log("employeerole error"));
};

//ADD EMPLOYEE
const addEmployee = () => { 
  inquirer.prompt(myQuestions.addEmployeeQuestions).then(function(answers){

    convertToManagerId(answers.manager).then((answer) => {
      convertToEmployeeId(answers.employeeRole).then((answer2)=>{
        addEmployeeToDb(answers.firstName, answers.lastName, answer, answer2)

        init();

  })
  });
  })
  
}
//UPDATE EMPLOYEE ROLE
const updateEmployeeRole = () => { 

  inquirer.prompt(myQuestions.updateEmployeeQuestions).then(function(answers){
    convertToManagerId(answers.employeeName).then((employeeId)=>{
      convertToEmployeeId(answers.newRoleAssign).then((newRole)=>{
        updateEmployeeInDb(newRole, employeeId)

        init();
      })
  })
})
}

//UPDATE EMPLOYEE ROLE
const addRole = () => { 

  inquirer.prompt(myQuestions.addRoleQuestions).then(function(answers){
    convertToDepartmentId(answers.roleDepartment).then((departmentId)=>{
      addRoleToDb(answers.newRole, answers.newSalary, departmentId)

      init();
  })
})
}


// Create a function to initialize app
function init() {
  inquirer.prompt(myQuestions.initialQuestion).then(function (answers) {
    switch (answers.choice) {
      case "View All Departments":  //tested
        getAllDepartments(); 
        setTimeout(() => {return init()}, 200);
        break;
      case "View All Employees": //tested
        getAllEmployees();
        setTimeout(() => {return init()}, 200);
        break;
      case "View All Roles": //tested
        getAllRoles();
        setTimeout(() => {return init()}, 200);
        break;
      case "Add Employee": //tested
        addEmployee();
        break;
      case "Update Employee Role": //--
        updateEmployeeRole();
        break;
      case "Add Department": //--
        addDepartment();
        break;
      case "Add Role": //---
        addRole();
        break;
      case "Quit": //tested
        process.exit(0)
    }
  });
}

//ADD A ROLE
app.put("api/new-role", function (req, res) {
  const title = req.body.title;
  const salary = req.body.salary;
  const department_id = req.body.department_id;
  const sql = `INSERT INTO insert into role (title, salary, department_id) values (?, ?, ?)`;
  db.query(sql, [title, salary, department_id], (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.table(result);
    res.json({
      message: "success",
    });
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//function call to initialize the app
init();
