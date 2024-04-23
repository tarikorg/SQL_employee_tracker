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
    const departments = await client.query('SELECT * FROM department')
    return departments.rows
}

const viewAllRoles = async () => {
    const roles = await client.query('SELECT * FROM role')
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
    )
    return employees.rows
}



