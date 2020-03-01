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
    var sqlQuery = "SELECT item_id AS 'Product ID', product_name AS Product, department_name AS Department, price AS Price, stock_quantity AS 'Stock QTY', product_sales AS Sales FROM products";
    connection.query(sqlQuery, function (err, res) {

        console.log("------------------------------------------------------------------------------------");
        console.log("                            Welcome To Bamazon Manager's View                       ");
        console.log("------------------------------------------------------------------------------------");
        if (err) throw err;
        manage(res);
    });
};

// Manage function will ask store manager with different choices 
function manage(data) {
    console.table(data);
    var option1 = 'View Products for Sale';
    var option2 = 'View Low Inventory';
    var option3 = 'Add to Inventory';
    var option4 = 'Add New Product';

    inquirer.prompt([
        {
            type: "list",
            name: "mgrInput",
            message: "What would you like to do?",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(function (item) {
        switch (item.mgrInput) {
            case option1:
                showInventory();
                break;
            case option2:
                lowInventory();
                break;
            case option3:
                addToInventory();
                break;
            case option4:
                addNewProduct();
                break;
        }
    });

}
// This function will print the latest inventory 
function showInventory() {
    var sqlQuery = "SELECT item_id AS 'Product ID', product_name AS Product, department_name AS Department, price AS Price, stock_quantity AS 'Stock QTY', product_sales AS Sales FROM products";
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
    //close DB Connection
    connection.end();
}

//If any item in the store has less than 50 items, it will print using lowInventory function

function lowInventory() {
    var sqlQuery = "SELECT item_id AS 'Product ID', product_name AS Product, department_name AS Department, price AS Price, stock_quantity AS 'Stock QTY', product_sales AS Sales FROM products";

    var sqlQuery = "SELECT item_id AS 'Product ID', product_name AS Product, department_name AS Department, price AS Price, stock_quantity AS 'Stock QTY', product_sales AS Sales FROM products WHERE stock_quantity < 50;";
    connection.query(sqlQuery, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
    //close DB Connection
    connection.end();
}

// Asks store manager to update an item quantity 
function addToInventory() {

    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "What is the Item ID?",
        },
        {
            type: "input",
            name: "itemQty",
            message: "What is the Item Quantity?",
        }
    ]).then(function (item) {
        var addQty = item.itemQty;
        var itemId = item.itemID;
        var findItem = "SELECT * FROM products WHERE item_id=?";
        var addMore = "UPDATE products SET stock_quantity=? WHERE item_id=?";

        connection.query(findItem, [itemId], function (err, res) {
            if (err) throw err;
            var currStock = res[0].stock_quantity;
            var newQty = parseInt(addQty) + parseInt(currStock);
            connection.query(addMore, [newQty, itemId], function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " Item Updated.");

                //close DB Connection
                connection.end();
            });
        });

    });

}

//Manager can add a new product to the inventory by providing answers to four questions  
function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemName",
            message: "Product Name ?",
        },
        {
            type: "input",
            name: "itemDpt",
            message: "Department Name? ",
        },
        {
            type: "input",
            name: "itemPrice",
            message: "Price ?",
        },
        {
            type: "input",
            name: "itemQty",
            message: "Quantity?",
        }
    ]).then(function (item) {
        var pName = item.itemName;
        var dName = item.itemDpt;
        var price = item.itemPrice;
        var qty = item.itemQty;
        var addNew = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
        connection.query(addNew, [pName, dName, price, qty], function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " New Item Added.");
        });
        //close DB Connection
        connection.end();
    });
}























