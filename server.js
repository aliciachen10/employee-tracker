const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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


let array =[];

const getOnlyRoles = () => {

  return db.promise().query("select id, title from role;").then(rows => {
    rows[0].map((a) => {
      
      array.push(a.title)
      // return a.title
    });
    return array;
  }).catch(err => console.log("error"));
};

getOnlyRoles();

let managerArray = [];
// //was just working on this function
const getOnlyManagers = () => {

  return db.promise().query("select id, concat(first_name, \" \", last_name) as manager_name from employee_db.employee where manager_id is null;").then(rows => {
    // console.log(">>here are rows>>> ", rows[0])
    // console.log(rows[0])
    rows[0].map((a) => {
      // console.log("aaaaaaaaaaahhh", a)
      // return { name: a.manager_name, value: a.id };
      // console.log(a.title)
      managerArray.push(a.manager_name)
     
    });
    return managerArray;
  }).catch(err => console.log("error"));
};

getOnlyManagers();


const initialQuestion = [  {
  type: "list",
  message: "What would you like to do?",
  choices: [
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "View All Departments",
    "Add Department",
    "Quit",
  ],
  name: "choice",
}]

let employeeArray = [];
// //was just working on this function
const getOnlyEmployees = () => {

  return db.promise().query("select id, concat(first_name, \" \", last_name) as name from employee_db.employee;").then(rows => {
    // console.log(">>here are rows>>> ", rows[0])
    // console.log(rows[0])
    rows[0].map((a) => {
      // console.log("aaaaaaaaaaahhh", a)
      // return { name: a.manager_name, value: a.id };
      // console.log(a.title)
      employeeArray.push(a.name)
     
    });
    return employeeArray;
  }).catch(err => console.log("error"));
};

getOnlyEmployees();

let departmentArray = [];
// //was just working on this function
const getOnlyDepartments = () => {

  return db.promise().query("select name from employee_db.department;").then(rows => {
    // console.log(">>here are rows>>> ", rows[0])
    // console.log(rows[0])
    rows[0].map((a) => {
      // console.log("aaaaaaaaaaahhh", a)
      // return { name: a.manager_name, value: a.id };
      // console.log(a.title)
      departmentArray.push(a.name)
     
    });
    return departmentArray;
  }).catch(err => console.log("error"));
};

getOnlyDepartments();


const addEmployeeQuestions = [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "firstName",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "lastName",
  },
  {
    type: "list",
    message: "What is the employee's role?",
    name: "employeeRole",
    choices: array,
  },
  {
    // type: "input",
    type: 'list',
    message: "Who is the employee's manager?",
    name: "manager",
    choices: managerArray,
  }
];

const updateEmployeeQuestions = [
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "employeeName",
    choices: employeeArray,
  },
  {
    type: "list",
    message: "Which role do you want to assign the selected employee?",
    name: "newRoleAssign",
    choices: array,
  },
];

const questions = [
  {
    type: "input",
    message: "What is the name of your department?",
    name: "newDepartment",
    when: (answers) => answers.choice === "Add Department",
    // value: id from the database. if they select 'human resources' it returns in the db the actual id
    //update ____ where id = response.id
  },
];

const addRoleQuestions = [
  {
    type: "input",
    message: "What is the name of your role?",
    name: "newRole"
  },
  {
    type: "input",
    message: "What is the salary of the role?",
    name: "newSalary"
  },
  {
    type: "list",
    message: "What department does the role belong to?",
    name: "roleDepartment",
    choices: departmentArray
  },
]

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
const addDepartmentToDb = (newDepartment) => {
  // const dept_name = answers.newDepartment;
  const sql = `INSERT INTO department (name)
    VALUES (?)`;

  db.query(sql, newDepartment, (err, result) => {
    if (err) {
      console.log("error");
      // res.status(400).json({ error: err.message });
      return;
    }
    console.table(`successfully added ${newDepartment} into the database`);
    // res.json({
    //   message: 'success',
    //   data: req.body
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
    console.log("here's the id", rows[0][0].id);
    roleId = rows[0][0].id;
    console.log('convertToEmployeeId', roleId)
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
      // console.log(rows[0][0].id)
    managerId = rows[0][0].id;
    return rows[0][0].id;
  }).catch(err => console.log("managerid error"));
};

//convert from department name to department id
const convertToDepartmentId = (departmentId) => {

  return db.promise().query("SELECT id FROM employee_db.department where name = ?;", departmentId).then(rows => {
    console.log("here's the id", rows[0][0].id);
    return rows[0][0].id;
  }).catch(err => console.log("employeerole error"));
};

//ADD EMPLOYEE
const addEmployee = () => { 

  inquirer.prompt(addEmployeeQuestions).then(function(answers){
    console.log(answers)

    convertToManagerId(answers.manager).then((answer) => {
      convertToEmployeeId(answers.employeeRole).then((answer2)=>{
        addEmployeeToDb(answers.firstName, answers.lastName, answer, answer2)

  })
  });
  })
  
}
//UPDATE EMPLOYEE ROLE
const updateEmployeeRole = () => { 

  inquirer.prompt(updateEmployeeQuestions).then(function(answers){
    convertToManagerId(answers.employeeName).then((employeeId)=>{
      convertToEmployeeId(answers.newRoleAssign).then((newRole)=>{
        updateEmployeeInDb(newRole, employeeId)
      })
  })
})
}

//UPDATE EMPLOYEE ROLE
const addRole = () => { 

  inquirer.prompt(addRoleQuestions).then(function(answers){
    convertToDepartmentId(answers.roleDepartment).then((departmentId)=>{
      addRoleToDb(answers.newRole, answers.newSalary, departmentId)
  })
})
}



// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(initialQuestion).then(function (answers) {
    switch (answers.choice) {
      case "View All Departments": //finished 
        getAllDepartments();  
        return init();
        break;
      case "View All Employees": //finished 
        getAllEmployees();
        // init();
        break;
      case "View All Roles": //finished 
        getAllRoles();
        // init();
        break;
      case "Add Employee": //finished
        addEmployee();
        break;
      case "Update Employee Role": //finished
        updateEmployeeRole();
      case "Add Department": //finished
        addDepartment(answers.newDepartment);
        break;
      case "Add Role": // finished
        addRole();
      case "Quit":
        process.exit(0)
    }

    console.log("bye")
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

//to do:
//WORK ON ADD DEPARTMENT
//TEST EVERY SINGLE FUNCTION AND MAKE SURE IT STILL WORKS 
//call itself so that someone can select a menu option after they've already performed one action
//make sure the menu option is above the rest


// inquirer.prompt(initialQuestion).then(answers => {
//   switch (answers.choice) {
//   case addemployee:
//     addemployee();
//   }
  
  
//   }
//   )


//function call to initialize the app
init();
// convertToDepartmentId("data science");
