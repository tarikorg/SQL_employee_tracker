require('console.table')//to view sql data in an appealing way i guess
const inquirer = require('inquirer')
// get functions required for the inquirer questions
const {
    viewAllDepartments,
    viewAllEmployees,
    viewAllRoles,
    addDepartment,
    addEmployee,
    addRole
} = require('./query')

// asynced function that starts the interface of question chains
const init = async () => {
    try {
        // store the response from prompt
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choice: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Exit',
                ],

            },
        ]);

        switch (choice) {
            case 'View all departments':
                const departments = await viewAllDepartments()
                console.table(departments)
                break;
            case 'View all roles':
                const roles = await viewAllRoles()
                console.table(roles)
                break;
            case 'View all employees':
                const employees = await viewAllEmployees()
                console.table(employees)
                break;
            case 'Add a department':
                const department = await promptAddDepartment() //call prompt add department for assigning right property
                await addDepartment(department.name)
                console.log('New department added successfully')
                break;
            case 'Add a role':
                const role = await promptAddRole()
                await addRole(role.title, role.salary, role.department_id)
                console.log('New Role Added Successfully')
                break;
            case 'Add an employee':
                const employee = await promptAddEmployee()
                await addEmployee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id)
                console.log('New employee added successfully')
                break;
            case 'Exit':
                console.log('Goodbye!')
                return;
                default:
                    console.log('Invalid')
        }

        init()// call the function
    

    }catch(err){
        console.error('Error:', error)
    }
}// init end line


// make a function that has promps to get required input from the user for the new database

// does not need await because department has no  content needs to be awaited
const promptAddDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the NEW department:',
        },
    ])
}

const promptAddRole = async () => {
    const departments = await viewAllDepartments()
    //iterate through existing departments with .map()
    // if there is 1-sales 2-engineering 3-marketing lets say,  .map() going to give us these values as:
    // {name: sales, value: 1} {name:engineering, value:2}
//why we do this? because role table has to have department_id otherwise user will always has to leave it blank which will cause errors or half blank database
    const departmentChoices = departments.map(department => ({name: department.name, value: department.id}))

    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the NEW role',

        },
        {
            type: 'input',
            name: 'salary',
            message: 'Entter the salary for the NEW role:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the NEW role:',
            choices: departmentChoices,
        },
    ])
}

//employee

const promptAddEmployee = async () => {
    //employe needs role id,   and manager id(show the user by their name)
    const roles = await viewAllRoles()  // get all roles array
    const roleChoices = roles.map(role => ({name: role.title, value: role.id}))

    //manager id
    const employees = await viewAllEmployees()
    const managerChoices = employees.map(employee => ({})) //UNDERWORK

}