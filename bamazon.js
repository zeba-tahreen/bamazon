var manager = require('./bamazonManager');
var inquirer = require("inquirer");
var connection = require('./connection');
selectUser();

function selectUser() {
  inquirer
    .prompt({
      name: "user",
      type: "list",
      message: "Select User type",
      choices: ["Customer", "Manager"]
    })
    .then(function (answer) {
      switch (answer.user) {
        case "Customer":
          return selectUser();
        case "Manager":
          return runManager();
      }
    })
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
        "Add New Product"
      ]
    })
    .then(function (answer) {
      switch (answer.option) {
        case "View Products for Sale":
          return managerViewProd();
        case "View Low Inventory":
          return managerViewLowInv();
        case "Add to Inventory":
          return managerAddInventory();
        case "Add New Product":
          return selectUser();
      }
    })
}
function selectAll(cb) {
  connection.query("select * from products", function (err, data) {
    if (err) throw err;
    cb(data)
  })
}

function managerViewProd() {
  selectAll(function (data) {
    console.table(data);
    runManager();
  })
}

function managerViewLowInv() {
  var sqlStr = `SELECT *
              FROM products
              WHERE stock_quantity < 10`

  connection.query(sqlStr, function (er, data) {
    console.table(data)
    runManager();
  })
}

function managerAddInventory() {
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
}



