require('console.table')//to view sql data in an appealing way i guess
const inquirer = require('inquirer')
// get functions required for the inquirer questions
const {
    viewAllDepartments,
    viewAllEmployees,
    viewAllRoles,
    addDepartment,
    addEmployee,
    addRole,
    updateEmployeeRole
} = require('./query')

// asynced function that starts the interface of question chains
const startApp = async () => {
    try {
        // store the response from prompt
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update employee',
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
            case 'Update employee':
                await promptUpdateEmployee()
                break;    
            case 'Exit':
                console.log('Goodbye!')
                return;
                default:
                    console.log('Invalid')
        }

        startApp()// call the function
    

    }catch(err){
        console.error('Error:', err)
    }
}// startApp end line


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
    const roleChoices = roles.map(role => ({ name: role.role_title, value: role.role_id }))

    //manager id
    const employees = await viewAllEmployees();
    let managerChoices = [];
    if (employees.length > 0) {
        managerChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.employee_id }))
    } else {
        managerChoices = [{ name: 'None', value: null }]
    }

    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'First name of the employee'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Last name of the employee'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Role for this employee',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Manager for this employee',
            choices: managerChoices
        }
    ])
}


//update
const promptUpdateEmployee = async () => {
    try{
        //for the prompt= let user chose an employe (background return as id)
        const employees = await viewAllEmployees()
        const employeeOptions = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.employee_id}))
          
       //for the prompt = do the same for the role
       const roles = await viewAllRoles()
       const roleOptions = roles.map(role => ({ name: role.role_title, value: role.role_id }))
        
       //get users personal choices and assign both values to employeeID and RoleID basically
       // u need to await to get these values from the user input
       const {employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Choose an employee to update',
            choices: employeeOptions
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Choose a new role for the chosen employe',
            choices: roleOptions
        }
       ])
        //once the awaited inputs given thru prompt call the update function
       await updateEmployeeRole(employeeId, roleId)
       console.log('CONGRATS user is updated!')
    }catch(err){console.error('Error', err)}
}

startApp()