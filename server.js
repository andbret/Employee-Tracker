const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "Localhost",
    port: 3306,
    user: "root",
    password: "Bop212212!",
    database: "playlist_db"
});

connection.connect(function (err) {
    if (err)
        console.log(err);

    init();
});

function init() {

    let roleData;
    let departmentData;
    let employeeData;


    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        roleData = res.map(role => ({ name: role.first_name, value: role.id }));
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
            "View total budget of a department",
            "Exit program"

        ],
        default: "Exit program"

    }]).then(function (res) {

        switch (res.task) {
            case "Add departments":
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
        connection.query("INSERT INTO department(department_name) VALUES(?)", [addDep.newDep], function (err, postData) {
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
            console.log("Role has successfully been created!");

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
        console.log(res);
        init();
    });
}

// ==============================================================================================================================================================================
// VIEW ROLES ================================================================================================================================================================
// ==============================================================================================================================================================================

const viewRoles = () => {
    console.log("Roles: \n");
    connection.query("SELECT * FROM role", function (err, res) {
        if (err)
            throw err;
        console.log(res);
        init();
    });
}

// ==============================================================================================================================================================================
// VIEW Employees ================================================================================================================================================================
// ==============================================================================================================================================================================

const viewEmp = () => {
    console.log("Employees: \n");
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err)
            throw err;
        console.log(res);
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

        connection.query("UPDATE employee SET ? WHERE ?", [
            {
                role_id: res.chooseRole
            },
            {
                name: res.changeEmpRole
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`${changeEmpRole} was updated successfully!`);

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
                name: res.changeEmpManager
                // DO I NEED TO ADD THE ROLE TO IDENTIFY?====================================================================
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`${changeEmpManager} was updated successfully!`);

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

        connection.query("SELECT * FROM employee WHERE ?", [
            {
                manager_id: res.viewByManager
            }
        ], function(err, sortManager) {
            if(err)
                console.log(err);
    
            console.log(sortManager);
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

        connection.query("DELETE department WHERE ", [
            {
                department_name: res.deleteDepartment
            }
        ], function (err, updateData) {
            if (err)
                throw err;

            console.log(`${deleteDepartment} was deleted successfully!`);

            init();
        });
    });
};



// "Add department",
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

