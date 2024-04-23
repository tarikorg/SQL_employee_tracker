//connect database

const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_details_db',
    port: 4324,
})

//connect to the database
client.connect()
.then(()=>{
    console.log('connected to the SQL')
})
//then i am presented with : view all departments/roles/employees, add a department , add a role , add an employee


// functions to display specific data out of database
const viewAllDepartments = async () => {
    const departments = await client.query('SELECT * FROM department');
    return departments.rows
}

const viewAllRoles = async () => {
    const roles = await client.query('SELECT * FROM role');
    return roles.rows
}

const viewAllEmployees = async () => {
    const employees = await client.query(
        `
    SELECT 
        e.id AS employee_id, 
        e.first_name, 
        e.last_name, 
        r.title AS job_title, 
        d.name AS department,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM 
        employee e
    INNER JOIN 
        role r ON e.role_id = r.id
    INNER JOIN 
        department d ON r.department_id = d.id
    LEFT JOIN 
        employee m ON e.manager_id = m.id
  `
    );
    return employees.rows
}

const addDepartment = async (name) => {
    const add = await client.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
    return add.rows[0]
}

const addRole = async (title, salary, department_id) => {
    const add = await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',[title, salary, department_id]);
    return add.rows[0]
}

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
    const add = await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
    return add.rows[0]
}


// update employeRole

module.exports = {
    viewAllDepartments,
    viewAllEmployees,
    viewAllRoles,
    addDepartment,
    addEmployee,
    addRole,
}
