/* 
BED Assignment CA2
-   Name: Lee Quan Jun Ervin
-   Admin No: 2104005
-   Class: DISM/FT/2B/21
-   Filename: flight.js
-   Description: Program to handle data from the flight table of the SP AIR database 
*/

/*
-----------------------------------------------------------------------
IMPORT DATABASE CONFIGURATIONS
-----------------------------------------------------------------------
*/
const e = require('express')
var db = require('./databaseConfig.js')

/*
-----------------------------------------------------------------------
DECLARATION OF FLIGHT DATABASE FUNCTION OBJECT
-----------------------------------------------------------------------
*/
var flightDB = {
    // Function to add new flight to the flight database
    newFlight: (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            // Check for errors
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL command to insert new flight data into flight table
                var sql = "insert into sp_air.flight (flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url) values (?, ?, ?, ?, ?, ?, ?, ?)"
                console.log(`RUNNING COMMAND: ${sql}`)
                connection.query(sql, [flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url], (err, result) => {
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
    
    // Function to get flight information based on origin and destination airport IDs
    findFlight: (originAirportId, destinationAirportId, embarkDate, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL Command to select flightid, flight code by origin airport id and destination airport id, replacing the ids with name of the airports by performing another selection by the airportids
                var sql = `select flightid, flightCode, (select name from airport where airportid = ?) as originAirport, (select iata from airport where airportid = ?) as originAirportIata, (select name from airport where airportid = ?) as destinationAirport, (select iata from airport where airportid = ?) as destinationAirportIata, embarkDate, travelTime, price from flight where flight.originAirport = ? and flight.destinationAirport = ? and embarkDate like ?`

                connection.query(sql, [originAirportId, originAirportId, destinationAirportId, destinationAirportId, originAirportId, destinationAirportId, embarkDate, destinationAirportId, originAirportId], (err, result) => {
                    connection.end()
                    console.log(`RUNNING COMMAND: ${sql}`)
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },


    // Function to delete flights and their related bookings from the database
    deleteFlight: (flightid, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to delete flight based on flightid
                var sql = "delete from flight where flightid = ?"
                connection.query(sql, [flightid], (err, result) => {
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

    // Function to get all transfer flights from transfer database
    getTransfers: (originAirportId, destinationAirportId, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to create two temporary tables and join the flight information together if destination airport of first flight matches the origin airport of the second flight
                var sql = `
                drop temporary table if exists first_flight;

                create temporary table if not exists first_flight (flightid int not null, flightCode varchar(45) not null, aircraft varchar(45) not null, originAirport varchar(45) not null, destinationAirport varchar(45) not null, embarkDate datetime not null, travelTime varchar(45) not null, price float not null);

                insert into first_flight select flightid, flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price from flight where flight.originAirport = ? and flight.destinationAirport != ?;

                drop temporary table if exists second_flight;

                create temporary table if not exists second_flight (flightid int not null, flightCode varchar(45) not null, aircraft varchar(45) not null, originAirport varchar(45) not null, destinationAirport varchar(45) not null, embarkDate datetime not null, travelTime varchar(45) not null, price float not null);

                insert into second_flight select flightid, flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price from sp_air.flight where flight.destinationAirport = ? and flight.originAirport != ?;

                select first_flight.flightid as firstFlightId, second_flight.flightid as secondFlightId, first_flight.flightCode as flightCode1, first_flight.originAirport as originAirport, second_flight.destinationAirport from first_flight, second_flight where first_flight.destinationAirport = second_flight.originAirport and first_flight.embarkDate < second_flight.embarkDate;

                select first_flight.flightid as firstFlightId, second_flight.flightid as secondFlightId, first_flight.flightCode as flightCode1, second_flight.flightCode as flightCode2, first_flight.aircraft as aircraft1, second_flight.aircraft as aircraft2, (select name from airport where airportid = first_flight.originAirport) as originAirport, (select name from airport where airportid = first_flight.destinationAirport) as transferAirport, (select name from airport where airportid = second_flight.destinationAirport) as destinationAirport, (select iata from airport where airportid = first_flight.originAirport) as originAirportIata, (select iata from airport where airportid = first_flight.destinationAirport) as transferAirportIata, (select iata from airport where airportid = second_flight.destinationAirport) as destinationAirportIata, first_flight.embarkDate as firstEmbarkDate, second_flight.embarkDate as secondEmbarkDate, first_flight.travelTime as firstTravelTime, second_flight.travelTime as secondTravelTime, first_flight.price as firstPrice, second_flight.price as secondPrice from first_flight inner join second_flight on first_flight.destinationAirport = second_flight.originAirport where first_flight.embarkDate < second_flight.embarkDate;
                `
                connection.query(sql, [originAirportId, destinationAirportId, destinationAirportId, originAirportId], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    } else {
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to find transfer flights with transfer flight specified
    getTransfersWithTransferAirport: (originAirportId, transferAirportId, destinationAirportId, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                // SQL statement to select flight by origin, transfer and destination airport
                var sql = `
                drop temporary table if exists first_flight;

                create temporary table if not exists first_flight (flightid int not null, flightCode varchar(45) not null, aircraft varchar(45) not null, originAirport varchar(45) not null, destinationAirport varchar(45) not null, embarkDate datetime not null, travelTime varchar(45) not null, price float not null);

                insert into first_flight select flightid, flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price from flight where flight.originAirport = ? and flight.destinationAirport != ?;

                drop temporary table if exists second_flight;

                create temporary table if not exists second_flight (flightid int not null, flightCode varchar(45) not null, aircraft varchar(45) not null, originAirport varchar(45) not null, destinationAirport varchar(45) not null, embarkDate datetime not null, travelTime varchar(45) not null, price float not null);

                insert into second_flight select flightid, flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price from sp_air.flight where flight.destinationAirport = ? and flight.originAirport != ?;

                select first_flight.flightid as firstFlightId, second_flight.flightid as secondFlightId, first_flight.flightCode as flightCode1, first_flight.originAirport as originAirport, second_flight.destinationAirport from first_flight, second_flight where first_flight.destinationAirport = second_flight.originAirport and first_flight.embarkDate < second_flight.embarkDate;

                select first_flight.flightid as firstFlightId, second_flight.flightid as secondFlightId, first_flight.flightCode as flightCode1, second_flight.flightCode as flightCode2, first_flight.aircraft as aircraft1, second_flight.aircraft as aircraft2, (select name from airport where airportid = first_flight.originAirport) as originAirport, (select name from airport where airportid = first_flight.destinationAirport) as transferAirport, (select name from airport where airportid = second_flight.destinationAirport) as destinationAirport, (select iata from airport where airportid = first_flight.originAirport) as originAirportIata, (select iata from airport where airportid = first_flight.destinationAirport) as transferAirportIata, (select iata from airport where airportid = second_flight.destinationAirport) as destinationAirportIata, first_flight.embarkDate as firstEmbarkDate, second_flight.embarkDate as secondEmbarkDate, first_flight.travelTime as firstTravelTime, second_flight.travelTime as secondTravelTime, first_flight.price as firstPrice, second_flight.price as secondPrice from first_flight inner join second_flight on first_flight.destinationAirport = second_flight.originAirport and first_flight.destinationAirport = ? where first_flight.embarkDate < second_flight.embarkDate;
                `
                connection.query(sql, [originAirportId, destinationAirportId, destinationAirportId, originAirportId, transferAirportId], (err, result) => {
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

    // Function to search flights by airline code search query and sort according to form values
    searchFlights: (searchQuery, sort, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {            
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                var orderBy = ""
                var sortingTable = ""
                var order = ""
                if (sort !== "") {
                    orderBy = "order by"
                    if (sort === "sortPriceByAsc") {
                        sortingTable = "price"
                        order = "asc"
                    } else if (sort === "sortPriceByDesc") {
                        sortingTable = "price"
                        order = "desc"
                    } else if (sort === "sortFlightCodeByAsc") {
                        sortingTable = "flightCode"
                        order = "asc"
                    } else if (sort === "sortFlightCodeByDesc") {
                        sortingTable = "flightCode"
                        order = "desc"
                    }
                }
                console.log(searchQuery)
                console.log(orderBy)
                console.log(sortingTable)
                console.log(order)

                // SQL statement to select flight by airline code based on the search query
                var sql = `select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport1, (select iata from airport where airportid = flight.originAirport) as originAirportIata, flight.originAirport as originAirportId, (select name from airport where airportid = flight.destinationAirport) as destinationAirport1, (select iata from airport where airportid = flight.destinationAirport) as destinationAirportIata, flight.destinationAirport as destinationAirportId, embarkDate, travelTime, price, flight_pic_url from flight where flightCode like ? ${orderBy} ${sortingTable} ${order}`

                connection.query(sql, [searchQuery], (err, result) => {
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

    // Function to select flight according to range user sets
    searchFlightsByPriceRange: (min, max, callback) => {
        var connection = db.getConnection()
        connection.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                if (max == '' && min != '') {          // If minimum price is given and maximum price is not given
                    sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select iata from airport where airportid = flight.originAirport) as originAirportIata, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, (select iata from airport where airportid = flight.destinationAirport) as destinationAirportIata, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where price >= ?"
                    array = [min]
                } else if (min == '' && max != '') {   // If maximum price is given but minimum price is not given
                    sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select iata from airport where airportid = flight.originAirport) as originAirportIata, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, (select iata from airport where airportid = flight.destinationAirport) as destinationAirportIata, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where price <= ?"
                    array = [max]
                } else if (max != '' && min != '') {  // If both maximum and minimum price is given by the user
                    sql = "select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport, (select iata from airport where airportid = flight.originAirport) as originAirportIata, (select name from airport where airportid = flight.destinationAirport) as destinationAirport, (select iata from airport where airportid = flight.destinationAirport) as destinationAirportIata, embarkDate, travelTime, price, flight_pic_url from sp_air.flight where price between ? and ?"
                    array = [min, max]
                }

                connection.query(sql, array, (err, result) => {
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

    // Function to get all flights from the flight database
    getAllFlights: (callback) => {
        // Establish a connection with the database
        var connection = db.getConnection()
        connection.connect((err) => {
            // If error from connection detected
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                
                // SQL command to select all data from the flight table
                var sql = `select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport1, (select iata from airport where airportid = flight.originAirport) as originAirportIata, (select name from airport where airportid = flight.destinationAirport) as destinationAirport1, (select iata from airport where airportid = flight.destinationAirport) as destinationAirportIata, embarkDate, travelTime, price, flight_pic_url, created_at from flight`

                connection.query(sql, (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)   
                        // Error detected, return callback function with error and null results
                        return callback(err, null)
                    } else {
                        // Result successfully retrieved and return callback with null error and result
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },

    // Function to get flight by flightid
    getFlightById: (flightid, callback) => {
      // Establish a connection with the database
        var connection = db.getConnection()
        connection.connect((err) => {
            // If error from connection detected
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log("Connection established!")
                
                // SQL command to select a flight from flight database by flightid
                var sql = `
                select flightid, flightCode, aircraft, (select name from airport where airportid = flight.originAirport) as originAirport1, (select iata from airport where airportid = flight.originAirport) as originAirportIata, flight.originAirport as originAirportId, (select name from airport where airportid = flight.destinationAirport) as destinationAirport1, (select iata from airport where airportid = flight.destinationAirport) as destinationAirportIata, flight.destinationAirport as destinationAirportId, embarkDate, travelTime, price, flight_pic_url from flight where flightid = ?
                `

                connection.query(sql, [flightid], (err, result) => {
                    connection.end()
                    if (err) {
                        console.log(err)   
                        // Error detected, return callback function with error and null results
                        return callback(err, null)
                    } else {
                        // Result successfully retrieved and return callback with null error and result
                        console.log(result)
                        console.table(result)
                        return callback(null, result)
                    }
                })
            }
        })
    }
}

/*
-----------------------------------------------------------------------
EXPORT OF FLIGHT DATABASE FUNCTION OBJECT TO THE APP SCRIPT
-----------------------------------------------------------------------
*/
module.exports = flightDB