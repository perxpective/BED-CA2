/* 
BED Assignment CA2
-   Name: Lee Quan Jun Ervin
-   Admin No: 2104005
-   Class: DISM/FT/2B/21
-   Filename: cart.js
-   Description: Program to handle data from the cart table of the SP AIR database 
*/

/*
-----------------------------------------------------------------------
IMPORT DATABASE CONFIGURATIONS
-----------------------------------------------------------------------
*/
var db = require('./databaseConfig.js')

/*
-----------------------------------------------------------------------
DECLARATION OF BOOKING DATABASE FUNCTION OBJECT
-----------------------------------------------------------------------
*/
var cartDB = {
    // Function to add a new flight to the cart
    addFlightToCart: (userid, flightid, seatPrice, quantity, discount, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to insert new row of values into sp_air.cart table
                var sql = "insert into sp_air.cart (userid, flightid, cost, quantity, discount) values (?, ?, ?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [userid, flightid, seatPrice, quantity, discount], (err, result) => {
                    connection.end()
                    // Second check of errors
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to remove flight from the cart
    removeFlightFromCart: (flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to delete cart by flightid from cart table
                var sql = "delete from airport where cart.flightid = ?"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [flightid], (err, result) => {
                    connection.end()
                    // Second check of errors
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to get cart information from userid
    getCartInformation: (userid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to select cart information from userid
                var sql = "select cartid, flightid, (select flight.flightCode from flight where flight.flightid = cart.flightid) as flightCode, (select flight.embarkDate from flight where flight.flightid = cart.flightid) as embarkDate, cost, quantity, discount from cart where userid = ?;"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [userid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        }) 
    },

    // Function to delete cart item by flightid
    deleteCartItemByFlightId: (flightid, userid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to delete cart item by flightid
                var sql = "delete from cart where flightid = ? and userid = ?;"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [flightid, userid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        }) 
    },

    // Function to get cart item by cartid
    getCartItemById: (cartid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to get cart item by cartid
                var sql = "select * from cart where cartid = ?;"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [cartid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })        
    },

    // Function to clear all items in the cart
    clearCart: (callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                // SQL Command to clear cart by flightid
                var sql = "delete from cart;"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        }) 
    }
}

module.exports = cartDB