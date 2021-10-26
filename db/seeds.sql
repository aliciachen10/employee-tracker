insert into department (id, name)
values (1, "Sales"),
(2, "Engineering"),
(3, "Finance"),
(4, "Legal");

insert into role (id, title, salary, department_id)
values (1, "Sales Lead", "Sales", 100000.00, 1),
(2, "Salesperson", "Sales", 80000.00, 1),
(3, "Lead Engineer", "Engineering", 150000.00, 2),
(4, "Software Engineer", "Engineering", 120000.00, 2),
(5, "Account Manager", "Finance", 160000.00, 3),
(6, "Accountant", "Finance", 125000.00, 3),
(7, "Legal Team Lead", "Legal", 250000.00, 4),
(8, "Lawyer", "Legal", 190000.00, 4);

insert into employee (id, first_name, last_name, role_id, manager_id)
values (1, "John", "Doe", 1),
(2, "Mike", "Chan", 2, 1),
(3, "Ashley", "Rodriguez", 3),
(4, "Kevin", "Tupik", 4, 3),
(5, "Kunal", "Singh", 5),
(6, "Malia", "Brown", 6, 5),
(7, "Sarah", "Lourd", 7),
(8, "Tom", "Allen", 8, 7);