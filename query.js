//connect database

const { Pool } = require('pg')
const client = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_details_db',
    port: 5432,
})


//then i am presented with : view all departments/roles/employees, add a department , add a role , add an employee


// functions to display specific data out of database
const viewAllDepartments = async () => {
    const departments = await client.query('SELECT * FROM department');
    return departments.rows
}

const viewAllRoles = async () => {
    // shows derpartment instead of its id
    const roles = await client.query(`
    SELECT 
        role.id AS role_id,
        role.title AS role_title,
        role.salary,
        department.name AS department_name
    FROM 
        role
    INNER JOIN 
        department ON role.department_id = department.id
`);
    return roles.rows
}

const viewAllEmployees = async () => {
    const employees = await client.query(
        `
    SELECT 
        employee.id AS employee_id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS job_title, 
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM 
        employee
    INNER JOIN 
        role ON employee.role_id = role.id
    INNER JOIN 
        department ON role.department_id = department.id
    LEFT JOIN 
        employee manager ON employee.manager_id = manager.id
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
// how?  ask user to chose an existent employee
// then ask user to chose one of the avaiable(already existent) jobs
// its updated
//=================== function => take employe_id, new role_id(show user as role name not id)
const updateEmployeeRole = async (employeeId, roleId) => {
    const update = await client.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [roleId, employeeId])
    return update.rows[0]
}

module.exports = {
    viewAllDepartments,
    viewAllEmployees,
    viewAllRoles,
    addDepartment,
    addEmployee,
    addRole,
    updateEmployeeRole,
}
