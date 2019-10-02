var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'anthony',
    database: 'bamazon_db'
});

//initilize connection
connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connection established`)
    //calls function to print data from table
    showTable();
});

const showTable = function () {
    connection.query('SELECT * FROM products', function (err, res) {
        for (i = 0; i < res.length; i++) {
            console.log(res[i].item_id + ` Item: ` + res[i].product_name + ` ~~ Department: ` + res[i].department_name +
                ` ~~ Price: ` + res[i].price + ` ~~ In Stock: ` + res[i].stock_quantity);
        }
        askCustomer(res);
    })
}

const askCustomer = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Type the item you would like to purchase'
    }]).then(function (answer) {
         correct = false;
        for (i = 0; i < res.length; i++) {
            if (res[i].product_name === answer.choice) {
                correct = true;
                let product = answer.choice;
                let id = i;
                inquirer.prompt({
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like to purchase?',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (answer) {
                    if ((res[id].stock_quantity - answer.quantity) > 0) {
                        connection.query(`UPDATE products SET stock_quantity =` + (res[id].stock_quantity - answer.quantity) + ` WHERE product_name=` + product, function (err, res) {
                            console.log(`
                            ~~~ Purchase Complete ~~~
                            `);
                            showTable();
                        })
                    } else {
                        console.log(`Invalid Choice`)
                        askCustomer(res);
                    }
                })
            }
        }
    })
}