SELECT * FROM department 
order by name asc;

select a.id, a.title, b.name as department, salary from role a
left join department b 
on a.department_id = b.id
order by id, salary;

--is there a more efficient way to write this query? 
select a.id, a.first_name, a.last_name, b.title, c.name as department, b.salary, d.manager from employee a
left join role b
on a.role_id = b.id
left join department c 
on b.department_id = c.id
left join (select a.id, a.first_name, a.last_name, concat(b.first_name, " ", b.last_name) as manager from employee a 
left join employee b 
on a.manager_id = b.id) d
on a.id = d.id;