const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();
const { db } = require('../config');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



let array =[];
const getOnlyRoles = () => {

  return db.promise().query("select id, title from role;").then(rows => {
    rows[0].map((a) => {
      
      array.push(a.title)
    });
    return array;
  }).catch(err => console.log("error"));
};
getOnlyRoles();

let managerArray = [];
const getOnlyManagers = () => {

  return db.promise().query("select id, concat(first_name, \" \", last_name) as manager_name from employee_db.employee where manager_id is null;").then(rows => {

    rows[0].map((a) => {
      managerArray.push(a.manager_name)
     
    });
    return managerArray;
  }).catch(err => console.log("error"));
};
getOnlyManagers();


let employeeArray = [];
const getOnlyEmployees = () => {

  return db.promise().query("select id, concat(first_name, \" \", last_name) as name from employee_db.employee;").then(rows => {

    rows[0].map((a) => {
      employeeArray.push(a.name)
     
    });
    return employeeArray;
  }).catch(err => console.log("error"));
};
getOnlyEmployees();

let departmentArray = [];
const getOnlyDepartments = () => {

  return db.promise().query("select name from employee_db.department;").then(rows => {
    rows[0].map((a) => {
      departmentArray.push(a.name)
     
    });
    return departmentArray;
  }).catch(err => console.log("error"));
};
getOnlyDepartments();


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

const addDepartmentQuestion = [
  {
    type: "input",
    message: "What is the name of your department?",
    name: "newDepartment",
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

module.exports = {
  initialQuestion,
  addEmployeeQuestions,
  updateEmployeeQuestions,
  addDepartmentQuestion,
  addRoleQuestions,
  array,
  managerArray,
  employeeArray,
  departmentArray
}
