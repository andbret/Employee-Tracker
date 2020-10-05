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

	
    connection.query("SELECT * FROM role", function(err, roleData) {
        if (err) throw err;
        roleData = res.map(role => ({ name: role.title, value: role.id }));
      });
      connection.query("SELECT * FROM department", function(err, departmentData) {
        if (err) throw err;
        departmentData = res.map(department => ({ name: department.name, value: department.id }));
      });
      connection.query("SELECT * FROM employee", function(err, employeeData) {
        if (err) throw err;
        employeeData = res.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));
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
                placeholderFunctionName();
                break;

            case "Add role":
                placeholderFunctionName();
                break;

            case "Add employee":
                placeholderFunctionName();
                break;

            case "View departments":
                placeholderFunctionName();
                break;

            case "View roles":
                placeholderFunctionName();
                break;

            case "View employees":
                placeholderFunctionName();
                break;

            case "Update employee's role":
                placeholderFunctionName();
                break;

            case "Update employee's manager":
                placeholderFunctionName();
                break;

            case "View employees by manager":
                placeholderFunctionName();
                break;

            case "Delete department":
                placeholderFunctionName();
                break;

            case "Delete role":
                placeholderFunctionName();
                break;

            case "Delete employee":
                placeholderFunctionName();
                break;

            case "View total budget of a department":
                placeholderFunctionName();
                break;

            case "Exit program":
                placeholderFunctionName();
                break;


        }
    });
}