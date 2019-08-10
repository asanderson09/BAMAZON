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
connection.connect(function(err){
    if(err) throw err;
    console.log(`Connection established`)
});