//====Setup Required Variables=====
var Table = require('cli-table');
var inquirer = require('inquirer');
var mysql = require("mysql");
// var connection = require('./connection');
// var manager = require("./bamazonManager");

// ===Connect to SQL database===
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});


connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startPrompt();
});

//===Inquirer introduction===

function startPrompt() {
  inquirer
    .prompt({
      name: "User",
      type: "list",
      message: "Welcome to Bamazon! ==== Please Select your Choice ==== ",
      choices: ["Manager", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      // if (answer.User === "Customer") {
      //   inventory();
      // }
      // else
      if (answer.User === "Manager") {
        runManager();
      }
      else {
        connection.end();
      }
    });
}

function runManager() {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "Select Option:",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.option) {
        case "View Products for Sale":
          return inventory();
        case "View Low Inventory":
          return managerViewLowInv();
        case "Add to Inventory":
          return managerAddInventory();
        case "Add New Product":
          return managerAddProduct();
        case "Exit":
          return connection.end();
      }
    })
}
//===Inventory===
function inventory() {

  // instantiate
  var table = new Table({
    head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
    colWidths: [10, 30, 30, 30, 30]
  });

  listInventory();

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  function listInventory() {

    //Variable creation from DB connection

    connection.query("SELECT * FROM products", function (err, res) {
      for (var i = 0; i < res.length; i++) {

        var itemId = res[i].item_id,
          productName = res[i].product_name,
          departmentName = res[i].department_name,
          price = res[i].price,
          stockQuantity = res[i].stock_quantity;

        table.push(
          [itemId, productName, departmentName, price, stockQuantity]
        );
      }
      console.log("");
      console.log("===== Current Bamazon Inventory ======");
      console.log("");
      console.log(table.toString());
      console.log("");
      runManager();
    });
  }
}

function managerViewLowInv() {
  var sqlStr = `SELECT *
              FROM products
              WHERE stock_quantity < 5`

  connection.query(sqlStr, function (er, data) {
    console.log("");
    console.log("===== Current Bamazon Low Inventory Less than 5 ======");
    console.log("");
    console.table(data)
    console.log("");
    runManager();
  })
}

function managerAddInventory() {
  console.log(inventory);
  inquirer
    .prompt([
      {
        name: "id",
        message: "Id of item you would like to add inventory to",
        type: "input",
        validate: function (val) {
          return !isNaN(val)
        }
      },
      {
        name: "amount",
        message: "How many would you like to add?",
        type: "input",
        validate: function (val) {
          return !isNaN(val)
        }
      },
    ])
    .then(function (answers) {
      var id = parseInt(answers.id)
      var amount = parseInt(answers.amount)
      managerUpdateInvSQL(id, amount)
    })
}

function managerUpdateInvSQL(id, amount) {
  var sqlStr = `UPDATE products
                SET stock_quantity = stock_quantity + ?
                WHERE item_id = ?`;
  var data = [amount, id];
  connection.query(sqlStr, data, function (err, result) {
    runManager();
  })
};

function managerAddProduct() {
  console.log(inventory);
  inquirer
    .prompt([
      {
        name: "name",
        message: "Enter the name of your Item",
        type: "input",
        validate: function (val) {
          return isNaN(val)
        }
      },
      {
        name: "department",
        message: "Enter the department of your item",
        type: "input",
        validate: function (val) {
          return isNaN(val)
        }   
      },
      {
        name: "price",
        message: "Enter the price per unit of your item?",
        type: "input",
        validate: function (val) {
          return !isNaN(val)
        }   
      },
      {
        name: "stock",
        message: "Enter the quantity of your item available to stock?",
        type: "input",
        validate: function (val) {
          return !isNaN(val)
        }   
      },
    ])
    .then(function (answers) {

      connection.query("insert into products set ? ", {
        product_name:answers.name,
        department_name : answers.department, 
        price: answers.price, 
        stock_quantity:answers.stock
      }, function (err,res){});
      runManager();
  })
}