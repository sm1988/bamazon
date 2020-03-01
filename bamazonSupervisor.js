// Dependencies 
var mysql = require("mysql");
var inquirer = require("inquirer");

//Define DB as variable
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Apple123!",
    database: "bamazon"
});

// Create a DB connection 
connection.connect(function (err) {
    if (err) throw err;

    afterConnection();
});

// Print the inventory and start sales function
function afterConnection() {
    console.log("----------------------------------------------------------");
    console.log("             Welcome Bamazon Store Supervisor             ");
    console.log("----------------------------------------------------------");
    supervise();
};

// supervise function will as customer to input the Item ID and QTY 
function supervise() {
    var option1 = 'View Product Sales by Department';
    var option2 = 'Create New Department';

    inquirer.prompt([
        {
            type: "list",
            name: "sprChoice",
            message: "What would you like to do?",
            choices: ['View Product Sales by Department', 'Create New Department']
        }
    ]).then(function (item) {
        switch (item.sprChoice) {
            case option1:
                viewByDpt();
                break;
            case option2:
                createNewDpt();
                break;
        }
    });
};

function viewByDpt() {
    var sqlQuery = 'SELECT departments.department_id AS "DPT ID", departments.department_name AS "DPT Name", departments.over_head_costs AS "OverHead Costs", SUM(products.product_sales) AS "Product Sales",(SUM(products.product_sales) - departments.over_head_costs) AS Profit FROM departments JOIN products ON departments.department_name = products.department_name Group BY departments.department_name';
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.log("-------------------------------------------");
        console.log("             Store Sales Report            ");
        console.log("-------------------------------------------");
        console.table(res);
    });
    //close DB Connection
    connection.end();
};

function createNewDpt() {
    inquirer.prompt([
        {
            type: "input",
            name: "dptName",
            message: "Department Name ? ",
        },
        {
            type: "input",
            name: "overHeadCost",
            message: "Over Head Cost ? ",
        }
    ]).then(function (dpt) {
        var dptName = dpt.dptName;
        var overHeadCost = dpt.overHeadCost;

        var addNew = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)";
        connection.query(addNew, [dptName, overHeadCost], function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " New Deprtment Added.");
        });
        //close DB Connection
        connection.end();
    });

}

