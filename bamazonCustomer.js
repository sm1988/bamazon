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
    var sqlQuery = "SELECT item_id AS 'Product ID', product_name AS Product, department_name AS Department, price AS Price, stock_quantity AS 'Stock QTY' FROM products";
    connection.query(sqlQuery, function (err, res) {
        console.log("---------------------------------------------------------------------------");
        console.log("                        Welcome To Bamazon Store                           ");
        console.log("---------------------------------------------------------------------------");
        if (err) throw err;
        sales(res);
    });
};

// Sales function will as customer to input the Item ID and QTY 
function sales(data) {
    console.table(data);
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What would you like to buy? [Specify an ID]"
        },
        {
            type: "input",
            name: "qty",
            message: "Okay! How many units?"
        }
    ]).then(function (item) {
        //Find Item in the inventory
        var findItem = "SELECT * FROM products WHERE item_id=?";

        connection.query(findItem, [item.id], function (err, res) {
            if (err) throw err;
            // Store the available item quantity in a variable called stock

            var stock = res[0].stock_quantity;
            var price = res[0].price;
            var productSales = res[0].product_sales;

            // Compare if stock has more than or equal to what customer needs to buy
            if (stock >= item.qty) {

                //Calculate total and update the inventory with product_sales and new stock_quantity 
                var buyQty = stock - item.qty;
                var sale = price * item.qty;
                var newSale = sale + productSales;
                var buyItem = "UPDATE products SET stock_quantity=? , product_sales=? WHERE item_id=?";
                connection.query(buyItem, [buyQty, newSale, item.id], function (err, res) {
                    if (err) throw err;
                    //Print the purchased items and total amount 

                    console.log(res.affectedRows + " Item Purchased Today.");

                    console.log("Your Total is $" + sale);
                    connection.end();
                });
            }
            else {
                //Print Insufficient quantity! 
                console.log("Insufficient quantity!");
                connection.end();
            }
        });
    });

}