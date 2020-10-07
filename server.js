const mysql = require("mysql");
var inquirer = require("inquirer");
var roleData;
var departmentData;
var employeeData;
const connection = mysql.createConnection({
    host: "Localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err)
        console.log(err);

    init();
});

function init() {
// code that calls all roles/departments/employees for choices
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        roleData = res.map(role => ({ name: role.title, value: role.id }));
    });
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        departmentData = res.map(department => ({ name: department.name, value: department.id }));
    });
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        employeeData = res.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    });

    inquirer.prompt([{
// displays all options for thr user
        type: "list",
        message: "What would you like to do? (use arrow keys)",
        name: "task",
        choices: [
            "Add department",
            "Add role",
            "Add employee",
            "View departments",
            "View roles",
            "View employees",
            "Update employee's role",
            "Update employee's manager",
            "View employees by manager",
            "Delete department",
            "Delete role",
            "Delete employee",
            "Exit program"

        ],
        default: "Exit program"

    }]).then(function (res) {
// cases to run the corresponding function based on user selection
        switch (res.task) {
            case "Add department":
                addDep();
                break;

            case "Add role":
                addRole();
                break;

            case "Add employee":
                addEmp();
                break;

            case "View departments":
                viewDep();
                break;

            case "View roles":
                viewRoles();
                break;

            case "View employees":
                viewEmp();
                break;

            case "Update employee's role":
                updateEmpRole();
                break;

            case "Update employee's manager":
                updateEmpManager();
                break;

            case "View employees by manager":
                viewEmpByManager();
                break;

            case "Delete department":
                deleteDep();
                break;

            case "Delete role":
                deleteRole();
                break;

            case "Delete employee":
                deleteEmp();
                break;

            case "View total budget of a department":
                viewBudget();
                break;

            case "Exit program":
                exitProgram();
                break;


        }
    });
}
// ==============================================================================================================================================================================
// ADD DEPARTMENT ================================================================================================================================================================
// ==============================================================================================================================================================================

const addDep = () => {
    inquirer.prompt([
        {
            name: "newDep",
            type: "input",
            message: "Enter the name of the department that you would like to add:"
        }
    ]).then(addDep => {
        connection.query("INSERT INTO department(name) VALUES(?)", [addDep.newDep], function (err, postData) {
            if (err)
                throw err;

            // console.log(postData.insertId);
            console.log("department has successfully been created!");

            init();
        });
    });
};
// ==============================================================================================================================================================================
// ADD ROLE ================================================================================================================================================================
// ==============================================================================================================================================================================

const addRole = () => {
    inquirer.prompt([
        {
            name: "newRole",
            type: "input",
            message: "Enter the name of the role that you would like to add:"
        },
        {
            name: "newSalary",
            type: "input",
            message: "Enter the salary for the role:"
        },
        {
            type: "list",
            message: "What department is this role under:",
            name: "roleDep",
            choices: departmentData
        }

    ]).then(addRole => {
        connection.query("INSERT INTO role(title, salary, department_id) VALUES(?,?,?)", [addRole.newRole, addRole.newSalary, addRole.roleDep], function (err, postData) {
            if (err)
                throw err;

            // console.log(postData.insertId);
            console.log("Role has successfully been created!");

            init();
        });
    });
};
// ==============================================================================================================================================================================
// ADD EMPLOYEE ================================================================================================================================================================
// ==============================================================================================================================================================================

const addEmp = () => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter the first name of the Employee that you would like to add:"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter the last name of the Employee that you would like to add:"
        },
        {
            type: "list",
            message: "Choose what their role will be:",
            name: "newEmpRole",
            choices: roleData
        },
        {
            type: "list",
            message: "Choose who their manager will be:",
            name: "newEmpManager",
            choices: employeeData
        }

    ]).then(addEmp => {
        connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", [addEmp.firstName, addEmp.lastName, addEmp.newEmpRole, addEmp.newEmpManager], function (err, postData) {
            if (err)
                throw err;

            // console.log(postData.insertId);
            console.log("Employee has successfully been created!");

            init();
        });
    });
};

// ==============================================================================================================================================================================
// VIEW DEPARTMENT ================================================================================================================================================================
// ==============================================================================================================================================================================

const viewDep = () => {
    console.log("Departments: \n");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err)
            throw err;
        console.table(res);
        init();
    });
}

// ==============================================================================================================================================================================
// VIEW ROLES ================================================================================================================================================================
// ==============================================================================================================================================================================

const viewRoles = () => {
    console.log("Roles: \n");
    connection.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;", function (err, res) {
        if (err)
            throw err;
        console.table(res);
        init();
    });
}

// ==============================================================================================================================================================================
// VIEW Employees ================================================================================================================================================================
// ==============================================================================================================================================================================

const viewEmp = () => {
    console.log("Employees: \n");

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, CONCAT(employee.first_name,' ', employee.last_name) AS manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id;", function (err, res) {
        if (err)
            throw err;
        console.table(res);
        init();
    });
}
// ==============================================================================================================================================================================
// UPDATE EMPLOYEE ROLES ================================================================================================================================================================
// ==============================================================================================================================================================================

const updateEmpRole = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update the role of?",
            name: "changeEmpRole",
            choices: employeeData
        },
        {
            type: "list",
            message: "What is their new role?",
            name: "chooseRole",
            choices: roleData
        }
    ]).then(function (res) {
console.log(res.changeEmpRole);
        connection.query("UPDATE employee SET ? WHERE ?", [
            {
                role_id: res.chooseRole
            },
            {
                id: res.changeEmpRole
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`Employee was updated successfully!`);

            init();
        });
    });
};

// ==============================================================================================================================================================================
// UPDATE EMPLOYEE MANAGER ================================================================================================================================================================
// ==============================================================================================================================================================================

const updateEmpManager = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update the manager of?",
            name: "changeEmpManager",
            choices: employeeData
        },
        {
            type: "list",
            message: "Who is the new manager?",
            name: "chooseManager",
            choices: employeeData
            //FILTER OUT PREVIOUS ^ EMPLOYEE????????==============================================================================================================================================================================

        }
    ]).then(function (res) {

        connection.query("UPDATE employee SET ? WHERE ?", [
            {
                manager_id: res.chooseManager
            },
            {
                id: res.changeEmpManager
                // DO I NEED TO ADD THE ROLE TO IDENTIFY?====================================================================
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`Employee was updated successfully!`);

            init();
        });
    });
};
// ==============================================================================================================================================================================
// VIEW EMPLOYEES BY MANAGER ================================================================================================================================================================
// ==============================================================================================================================================================================
const viewEmpByManager = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which manager would you like to sort by?",
            name: "viewByManager",
            choices: employeeData
        }
    ]).then(function (res) {

        connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, CONCAT(employee.first_name,' ', employee.last_name) AS manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE ? ", [
            {
                manager_id: res.viewByManager
            }
        ], function(err, sortManager) {
            if(err)
                console.log(err);
    
            console.table(sortManager);
            init();
        });
    });
};
// ==============================================================================================================================================================================
// DELETE DEPARTMENT ================================================================================================================================================================
// ==============================================================================================================================================================================

const deleteDep = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which department would you like to delete?",
            name: "deleteDepartment",
            choices: departmentData
        }
    ]).then(function (res) {
console.log(res.deleteDepartment)
        connection.query("DELETE FROM department WHERE ?", [
            {
                id: res.deleteDepartment
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`department was deleted successfully!`);

            init();
        });
    });
};

// ==============================================================================================================================================================================
// DELETE EMPLOYEE ================================================================================================================================================================
// ==============================================================================================================================================================================

const deleteEmp = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to delete?",
            name: "deleteEmployee",
            choices: employeeData
        }
    ]).then(function (res) {
console.log(res.deleteEmployee)
        connection.query("DELETE FROM employee WHERE ?", [
            {
                id: res.deleteEmployee
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`Employee was deleted successfully!`);

            init();
        });
    });
};

// ==============================================================================================================================================================================
// DELETE ROLE ================================================================================================================================================================
// ==============================================================================================================================================================================

const deleteRole = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which role would you like to delete?",
            name: "deleteRole",
            choices: roleData
        }
    ]).then(function (res) {
console.log(res.deleteRole)
        connection.query("DELETE FROM role WHERE ?", [
            {
                id: res.deleteRole
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`Role was deleted successfully!`);

            init();
        });
    });
};

// ==============================================================================================================================================================================
// EXIT PROGRAM ================================================================================================================================================================
// ==============================================================================================================================================================================

const exitProgram = () => {
    connection.end();
}

//     "Add department",
//     "Add role",
//     "Add employee",
//     "View departments",
//     "View roles",
//     "View employees",
//     "Update employee's role",
//     "Update employee's manager",
//     "View employees by manager",
//     "Delete department",
//     "Delete role",
//     "Delete employee",
//     "View total budget of a department",
//     "Exit program"

