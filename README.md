# 12 SQL: Employee Tracker

## objective/description

Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called **content management systems (CMS)**. I built a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL (and console.table). The application includes a company's departments, roles, and employees.

Walkthrough video here: INSERT LINK TO WALKTHROUGH IVDEO 

Instructions: 
1. clone the repo to your normal machine using git clone 
2. connect to your db using mysql -u root -p and source db/schema.sql
3. run source db/seeds.sql
4. now run node server.js to get your app started

## more information about the application

This application allows the user to do the following: 
1. view all departments
2. view all roles
3. view all employees
4. add a department
5. add a role
6. add an employee
7. update an employee role

## Mock-Up

The following video shows an example of the application being used from the command line:

[![A video thumbnail shows the command-line employee management application with a play button overlaying the view.](./Assets/12-sql-homework-video-thumbnail.png)](https://2u-20.wistia.com/medias/2lnle7xnpk)

![Database schema includes tables labeled “employee,” role,” and “department.”](./Assets/12-sql-homework-demo-01.png)

Schema contains the following three tables: 

* `department`

    * `id`: `INT PRIMARY KEY`

    * `name`: `VARCHAR(30)` to hold department name

* `role`

    * `id`: `INT PRIMARY KEY`

    * `title`: `VARCHAR(30)` to hold role title

    * `salary`: `DECIMAL` to hold role salary

    * `department_id`: `INT` to hold reference to department role belongs to

* `employee`

    * `id`: `INT PRIMARY KEY`

    * `first_name`: `VARCHAR(30)` to hold employee first name

    * `last_name`: `VARCHAR(30)` to hold employee last name

    * `role_id`: `INT` to hold reference to employee role

    * `manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)
