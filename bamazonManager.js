var connection = require('./connection');

module.exports = {
    updatInvSQL: function (id, amount) {
        var sqlStr = `UPDATE products
                      SET stock_quantity = stock_quantity + ?
                      WHERE item_id = ?`;
        var data = [amount, id];
        connection.query(sqlStr, data, function (err, result) {
            runManager();
        })
    }
}