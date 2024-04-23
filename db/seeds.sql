INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Marketing');

INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 65000, 1),
('Sales Representative', 45000, 1),
('Software Engineer', 100000, 2),
('Electrical Engineer', 120000, 2),
('Finance Advisor', 80000, 3),
('Financial Analyst', 79000, 3),
('Marketing Director' 109000, 4),
('Marketing Coordinator', 52000, 4);

 
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Tarik', 'Orgerim', 1, NULL),
('Wesley', 'Goat', 2, 1),
('Trevor', 'Irwin', 3, 3),
('Naruto', 'Uzumaki', 4, 2);