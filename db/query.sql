SELECT * FROM department;

select * from role;

select * from employee a
left join role b
on a.role_id = b.id
left join employee c
on a.manager_id = c.id;

