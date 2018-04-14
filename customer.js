require("dotenv").config();


var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:`localhost`,
    port:3306,
    user:process.env.DATABASE_USER_ID,
    password:process.env.DATABASE_PASSWORD,
    database:`bamazonDB`
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start(){
    inquirer.prompt(
        {
            name:`whichAction`,
            type: `list`,
            message: `What would you like to do?`,
            choices:[`Order an item`,`Close Session`]
        }
    )
    .then(function(answer){
        switch(answer.whichAction) {
            case `Order an item`:
                orderItem();
                break;
            case 'Close Session':
                closeSession();
                break;
        }
    });
}

function orderItem(){
    var queryString = `select * from products`;
    var productArray = [];
    connection.query(queryString,function(err,results){
        if (err) throw err;
        results.forEach(function(obj){
            productArray.push(obj.product_name);
        })
        // console.log(productArray);
        promptBamazonCustomer(productArray);
    });
}

function promptBamazonCustomer(productArray){
    inquirer.prompt([
        {
            name: `choice`,
            type: `list`,
            choices: productArray,
            message:`What would you like to buy?`
        },
        {
            name: `quantity`,
            type: `input`,
            message: `How many would you like?`,
            validate: function(value){
                if (!isNaN(value) && (value % 1 == 0)){
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]
        
    ).then(function(chosenItem) {
        updateInventoryWith(chosenItem);
    })
}

function updateInventoryWith(chosenItem){
    var queryCurrentInventory = `select * from products where product_name = ?`
    var queryUpdateInventory = `update products set ?, ? where ?`;
    connection.query(queryCurrentInventory,chosenItem.choice, function(err,result){
        if (err) throw err;
        var futureInventory = result[0].stock_quantity - chosenItem.quantity;
        var product_sales = result[0].product_sales + chosenItem.quantity * result[0].price;
        if (futureInventory > 0){
            var updateParameters = [
                {stock_quantity:futureInventory},
                {product_sales:product_sales},
                {product_name:chosenItem.choice}
            ];
            connection.query(queryUpdateInventory,updateParameters,function(err,updateResult){
                if (err) throw err;
                console.log(`inventory updated`);
                console.log(`total order cost for ` + chosenItem.quantity + ` ` + chosenItem.choice + ` is: $` + (chosenItem.quantity*result[0].price).toFixed(2));
                start();
            })
        } else {
            console.log(`Sorry, not enough in stock now!.`)
            start();
        }
    });
};
function closeSession(){
    connection.end();
};