/* 
BED Assignment CA2
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: app.js
-   Description: This node.js script is where all the express API endpoints are stored
*/

/*
-----------------------------------------------------------------------
IMPORTS AND DECLARATIONS
-----------------------------------------------------------------------
*/

var express = require("express")                    // Loading the express library
var app = express()                                 // Creation of the express instance

// Import codes from other model files
const user = require("../model/user.js")              // Load code from user.js
const airport = require("../model/airport.js")        // Load code from airport.js
const flight = require("../model/flight.js")          // Load code from flight.js
const booking = require("../model/booking.js")        // Load code from booking.js
const promotion = require("../model/promotion.js")    // Load code from promotion.js
const cart = require("../model/cart.js")
const bodyParser = require("body-parser")             // Load body parser library
const urlencodedParser = bodyParser.urlencoded({extended: true})    // Parse HTTP POST data
const multer = require("multer")                                    // Load multer library for image file uploads
const jwt = require("jsonwebtoken")                   // Load jsonwebtoken library
const JWT_SECRET = require("../config.js")            // Load secret key from config.js
const verifyToken = require("../auth/verifyToken.js") // Load verifyToken middleware from auth/verifyToken.js
const cors = require("cors")                          // Load the CORS Express middlware library  
const path = require("path")                          // Load the path library                  

// Multer: middleware responsible for handling multipart/form-data used for uploading images to database
// Image Uploading Feature with Multer 
var storage = multer.diskStorage({
    // Decide which folder to save the file to
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    // Name to uploaded file within the destination
    filename: (req, file, callback) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        callback(null, fileName)
    }
})

// Multer handles the uploading of image file
const upload = multer({
    dest: 'uploads/',               // Destination path of uploaded file
    storage: storage,               // Where to store the uploaded file
    limits: {fileSize: 1000000},    // File size limit of 1MB

    // Function to decide which files to accept or reject based on file types supported
    // Outputs errors into content if file is too large or invalid image file format 
    fileFilter: (req, file, callback) => {
        // List of image file types allowed
        filetypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (filetypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(null, false)
            return callback(new Error("Only image files allowed!"))
        }
    }
})

// Body Parser
app.use(bodyParser.json())  // Parse application/json
app.use(express.json())     // Parse incoming requests with payloads
app.use(urlencodedParser)   // Parse application/x-www-form-urlencoded
app.use(cors())             // CORS

const process = require('process')
app.use(express.static(process.cwd() + '/uploads'))

// Endpoint #1: Using the POST method to add a new user to the database
app.post("/users/", upload.single('profile_pic_url'), (req, res) => {
    // Retrieve POST data field representing columns of data from the user table
    var username = req.body.username
    var email = req.body.email
    var contact = req.body.contact
    var password = req.body.password
    var role = req.body.role
    
    // Log all user data requested
    console.log("[REQUEST BODY]")
    console.log(req.body)

    // Check if file exists
    if (req.file) {
        console.log("[IMAGE CONTENTS]")
        console.log(req.file)
        // Set the profile pic URL to the file path and link 
        var profile_pic_url = 'http://localhost:8081/' + req.file.originalname.toLowerCase().split(' ').join('-')   
    } else {
        var profile_pic_url = 'http://localhost:8081/default.png'
    }

    // Function to add a new user and its data fields into the database
    user.addUser(username, email, contact, password, role, profile_pic_url, (err, result) => {
        // Checking for errors. Output erorr code 500 if error detected
        if (!err) {
            // Responds by sending the result insertId (primary key) via a JSON string 
            console.log("Inserted userid: " + result.insertId)
            res.status(201).send({'userid': result.insertId})   // Return error code 201
        } else if (err.errno === 1062) {
            // Checking for duplicate error of input data
            console.log("[ERROR DETECTED] 422")
            console.log("[422] Duplicate Entry Detected.")
            res.status(422).send({ "Error Message":"[422] Unprocessable Entity (Duplicated Entry Detected)" })
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #2: Using the GET method to get array of all users from the database
app.get("/users/", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Perform function to retrieve all users from user database
        user.getAllUsers((err, result) => {
            if (!err) {
                res.status(200).send(result)
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }

})

// Endpoint #3: Using the GET method to retrieve user data by userid
app.get("/users/:id", verifyToken, (req, res) => {
    // Retrieve the userid from the request parameters
    var userid = req.params.id
    // Check if userid equals to logged in userid
    if (req.decodedToken.userid != userid) {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        user.getUserByID(userid, (err, result) => {
            // Check for errors
            if (!err) {
                res.status(200).send(result)
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint #4: Using the PUT method to update user data by userid
app.put("/users/:id", verifyToken, upload.single('profile_pic_url'), (req, res) => {
    // Get user data from request parameters
    var userid = req.params.id
    var username = req.body.username
    var email = req.body.email  
    var contact = req.body.contact
    var profilePic = req.body.profile_pic_url

    // Check userid to ensure user is only updating their own account
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        console.log("[REQUEST BODY]")
        console.log(req.body)
    
        // Check if new file exists
        if (req.file) {
            // Output the contents of the image file object if upload detected
            console.log("[IMAGE CONTENTS]")
            console.log(req.file)

            // Set the profile pic URL to the file path and link 
            var profile_pic_url = 'http://localhost:8081/' + req.file.originalname.toLowerCase().split(' ').join('-')
            
        } else {
            console.log("No image found! Using a default icon instead!")
            var profile_pic_url = profilePic
        }
    
        // Initiate function to update user by userid
        user.updateUser(userid, username, email, contact, profile_pic_url, (err, result) => {
            // Check for errors
            if (!err) {
                res.status(204).send(result)
            } else if (err.errno == 1062) {
                console.log("[ERROR DETECTED] 422")
                console.log("[422] Duplicate Entry Detected.")
                res.status(422).send("[422] Unprocessable Entity (Duplicated Entry Detected)")
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint #5: Using the POST method to insert a new airport and its data into the database
app.post("/airport/", verifyToken, (req, res) => {
    console.log("[RUNNING ENDPOINT] POST http://localhost:8081/airport/")
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Retrieve POST data field representing columns of airport table in sp_air database
        var name = req.body.name
        var country = req.body.country
        var description = req.body.description
        var iata = req.body.iata
        
        console.log("[REQUEST BODY]")
        console.log(req.body)
    
        // Initiate addAirport function to add new airport data into airport table
        airport.addAirport(name, country, description, iata, (err, result) => {
            if (!err) {
                res.status(204).send(result)
            } else if (err.errno == 1062) {
                // Output error code 422 if duplicate entries found in database
                console.log("[ERROR DETECTED] 422")
                console.log("[422] Duplicate Entry Detected.")  
                res.status(422).send({"Error Message" : "[422] Unprocessable Entity (Duplicated Entry Detected)"})
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint #6: Using the GET method to extract all data from the airport database
app.get("/airport/", (req, res) => {
    // Retreive airport request body data
    airport.getAllAirports((err, result) => {
        if (!err) {
            res.status(200).send(result)
        } else {
            console.log("[ERROR DETECTED] 500")
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #7: Using the POST method to add new flight data to the flight database
app.post("/flight/", verifyToken, upload.single("flight_pic_url"), (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Retrieve POST flight data from request body
        var flightCode = req.body.flightCode
        var aircraft = req.body.aircraft
        var originAirport = req.body.originAirport
        var destinationAirport = req.body.destinationAirport
        var embarkDate = req.body.embarkDate
        var travelTime = req.body.travelTime
        var price = req.body.price
        // Check if file exists
        if (req.file) {
            // Output the contents of the image file object if upload detected
            console.log("[IMAGE CONTENTS]")
            console.log(req.file)
            // Set the profile pic URL to the file path and link 
            var flight_pic_url = 'http://localhost:8081/' + req.file.originalname.toLowerCase().split(' ').join('-')
        } else {
            var flight_pic_url = 'http://localhost:8081/default.png'
        }
        
        // Ensure no duplicate airports found
        if (originAirport === destinationAirport) {
            res.status(422).send({ "Error Message":"[422] Unprocessable Entity (Duplicated Entry Detected)" })
        }
        // Function to create a flight in the flight database
        flight.newFlight(flightCode, aircraft, originAirport, destinationAirport, embarkDate, travelTime, price, flight_pic_url, (err, result) => {
            if (!err) {
                console.log("Inserted flightid " + result.insertId)
                res.status(201).send({'flightid': result.insertId })   // Return error code 201
            } else if (err.errno === 1062) {
                res.status(422).send({ "Error Message":"[422] Unprocessable Entity (Duplicated Entry Detected)" })
            } else {
                console.log("[ERROR DETECTED] 500")
                res.status(500).send({ "Error Message": "Airport does not exist!" })
            }
        })
    }
})


/*
    [MODIFIED] Endpoint #8: Using the GET method to retrieve flight information travelling from origin to destination airport

    Modified the endpoint to run two functions in the endpoint
    - Runs searchFlightsByPriceRange function if there are queries for min and max price ranges
    - Acts as filter before running the findFlight function to search the filtered flights by origin and destination airports
    - If no queries detected, run the findFlight function normally
*/
app.get("/flightDirect/:originAirportId/:destinationAirportId/", (req, res) => {
    // Get parameters (originAirportID and destinationAirportId)
    var originAirportId = req.params.originAirportId
    var destinationAirportId = req.params.destinationAirportId
    var embarkDate = "%" + req.query.embarkDate + "%"
    var min = req.query.min
    var max = req.query.max

    if (min == "" && max == "") {
        flight.findFlight(originAirportId, destinationAirportId, embarkDate, (err2, result2) => {
            if (!err2) {
                console.log(result2)
                res.status(200).send(result2)
            } else {
                console.log("[ERROR DETECTED]")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    } else {
        flight.searchFlightsByPriceRange(min, max, (err, result) => {
            if (!err) {
                console.log(result)
                // Function to search for flights with the inputted origin and destination airport
                flight.findFlight(originAirportId, destinationAirportId, embarkDate, (err2, result2) => {
                    if (!err2) {
                        var resultStringify = JSON.stringify(result)
                        var resultObject = JSON.parse(resultStringify)
                        console.log(resultObject)
                        var resultStringify2 = JSON.stringify(result2)
                        var resultObject2 = JSON.parse(resultStringify2)
                        console.log(resultObject2)

                        // Iterate to perform intersection of two flight arrays of objects
                        var finalResult = []
                        resultObject.forEach((i) => {
                            resultObject2.forEach((j) => {
                                if (i.flightid == j.flightid) {
                                    finalResult.push(i)
                                }
                            })
                        })
                        console.log(finalResult)
                        res.status(200).send(finalResult)
                    } else {
                        console.log("[ERROR DETECTED]")
                        res.status(500).send({ "Error Message": "[500] Unknown Error" })
                    }
                })
            } else {
                console.log("[ERROR DETECTED]")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint #9: Using the POST method to add a new booking to the booking database
app.post("/booking/:userid/:flightid", verifyToken, (req, res) => {
    // Get request parameters
    var userid = req.params.userid
    var flightid = req.params.flightid

    // Verify userid before booking
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        // Get booking information from request body data 
        var name = req.body.name
        var passport = req.body.passport
        var nationality = req.body.nationality
        var age = req.body.age
    
        booking.newBooking(name, passport, nationality, age, userid, flightid, (err, result) => {
            if (!err) {
                console.log("Booked a flight!")
                res.status(201).send({bookingId: `${result.insertId}`})
            } else if (err.errno == 1452) {
                console.log("Foreign Key Contraint Failed!")
                res.status(500).send({ "Error Message": "Flight ID, Name or user ID does not exist in the database!" })
            } else {
                console.log("[ERROR DETECTED]")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint #10: Using the DELETE method to delete flights and associated bookings by flightid
app.delete("/flight/:flightid", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Get flightid from request parameters
        var flightid = req.params.flightid
    
        // Function to delete a flight from the flight database
        flight.deleteFlight(flightid, (err, result) => {
            if (!err) {
                res.status(200).send({"Message":"Deletion Successful!"})
            } else {
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint #11: Retrieve data of all flights from origin airport to destination airport with one transfer
app.get("/transfer/flight/:originAirportId/:destinationAirportId", (req, res) => {

    // Get originAirportId and destinationAirportId from request parameters
    var originAirportId = req.params.originAirportId
    var destinationAirportId = req.params.destinationAirportId
    
    // Function to get transfers
    flight.getTransfers(originAirportId, destinationAirportId, (err, result) => {
        console.log(result[result.length-1])
        if (err) {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        } else if (result[result.length-1].length === 0) {
            res.status(500).send({ "Error Message": "No transfer flights available from your search query!" })
        } else {
            console.log(result)
            console.table(result[result.length-1])
            res.status(200).send(result[result.length-1])
        }
    })
})

/*
-----------------------------------------------------------------------
BONUS REQUIREMENT ENDPOINTS
-----------------------------------------------------------------------
*/

// Endpoint #12: Using the POST method to create a new promotion on the promotion database
app.post("/promotion/:flightid", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Get flightid from request parameters
        var flightid = req.params.flightid
    
        // Get promotion information from request body data
        var startDate = req.body.startDate
        var endDate = req.body.endDate
        var discount = req.body.discount
    
        // Convert dates into JavaScript Date objects
        const startDateObject = new Date(startDate)
        const endDateObject = new Date(endDate)
    
        // Validate dates from request body
        if (endDateObject - startDateObject < 0) {
            res.status(500).send({ "Error Message": "End date cannot be before start date! Input a valid period!" })
        } else if (startDate === endDate) {
            res.status(500).send({ "Error Message": "Start and end dates cannot be the same!" })
        } else {
            // Function to add a new promotion and their dates into the promotion database
            promotion.newPromotion(flightid, startDate, endDate, discount, (err, result) => {
                if (!err) {
                    res.status(201).send({"promotionid": result.insertId})
                } else if (err.errno == 1292) {
                    res.status(500).send({ "Error Message": "Invalid Data Type Received!" })
                } else if (err.errno == 1452) {
                    res.status(500).send({ "Error Message": "Cannot create promotion for nonexistent flight!" })
                } else {
                    res.status(500).send({ "Error Message": "[500] Unknown Error" })
                }
            })
        }
    }
})

// Endpoint #13: Using the GET method to get all promotion information from the promotion database
app.get('/promotion/', (req, res) => {
    // Function to get all promotion data from the promotion table
    promotion.getAllPromotions((err, result) => {
        if (!err) {
            res.status(201).send(result)
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #14: Using the GET method to get a promotion by its id
app.get('/promotion/:promotionid', (req, res) => {
    // Get request parameters
    var promotionid = req.params.promotionid

    // Function to get promotion data from promotion table by promotionid
    promotion.getPromotionById(promotionid, (err, result) => {
        if (!err) {
            res.status(201).send(result)
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint #15: Using the DELETE method to delete a promotion by promotionid
app.delete('/promotion/:promotionid', verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Get request parameters
        var promotionid = req.params.promotionid
    
        // Function to delete promotion by promotionid
        promotion.deletePromotionById(promotionid, (err, result) => {
            if (!err) {
                res.status(200).send({"Message":"Successfully deleted a promotion!"})
            } else {
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

/*
    Notes:
    - Removed advanced endpoints (checkout and price range) from CA1 to make way for other advanced features included in the full-stack website in CA2
    - Introduced a new model called cart.js in order to implement a cart system for flight bookings
    - Created the related endpoints to the cart model
    - Seat class bookings and computation of final price all done in the front-end
*/


/*
-----------------------------------------------------------------------
NEW APIs
-----------------------------------------------------------------------
*/

// Endpoint to handle user login
app.post("/login", (req, res) => {
    // Get username and password from the request body
    var email = req.body.email
    var password = req.body.password

    // Perform function to handle the user login
    user.userLogin(email, password, (err, result) => {
        if (err) {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
            return
        } if (result === null) {
            // Return error code 404 if unauthorized
            res.status(401).send({"Message":"Unauthorized!"})
            return
        } else {
            // Create the payload
            const payload = { 
                userid: result[0].userid, 
                role: result[0].role 
            }

            // Sign the payload with the secret key with SHA256
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" , expiresIn: 86400 }, (err, token) => {
                if (err) {
                    console.log(err)
                    res.status(401).send({"Message":"Unauthorized!"})
                    return
                }
                res.status(200).send({
                    token: token,
                    userid: result[0].userid,
                    role: result[0].role
                })
            })
        }
    })
})

// Endpoint to get ALL flights
app.get("/flight", (req, res) => {
    // Perform function to get all flights from flight database
    flight.getAllFlights((err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to delete selected airport by airportid
app.delete("/airport/:airportid", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Get airportid from request parameters
        var airportid = req.params.airportid
    
        // Perform function to delete airport by airportid
        airport.deleteAirport(airportid, (err, result) => {
            if (!err) {
                res.status(200).send(result)
            } else {
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to get return flights
app.get("/returnFlights/:originAirportId/:destinationAirportId", (req, res) => {
    // Get request parameters and queries
    var originAirportId = req.params.originAirportId
    var destinationAirportId = req.params.destinationAirportId
    var returnDate = "%" + req.query.returnDate + "%"
    var min = req.query.min
    var max = req.query.max

    // Check if minimum and maximum price rangge values are left blank
    if (min == "" && max == "") {
        // Function to search for flights with the inputted origin and destination airport
        flight.findFlight(destinationAirportId, originAirportId, returnDate, (err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log("[ERROR DETECTED]")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    } else {
        // Run function to filter flights according to user input price range if min and max queries detected
        flight.searchFlightsByPriceRange(min, max, (err, result) => {
            if (!err) {
                // Function to search for flights with the inputted origin and destination airport
                flight.findFlight(destinationAirportId, originAirportId, returnDate, (err2, result2) => {
                    if (!err2) {
                        var resultStringify = JSON.stringify(result)
                        var resultObject = JSON.parse(resultStringify)
                        console.log(resultObject)
                        var resultStringify2 = JSON.stringify(result2)
                        var resultObject2 = JSON.parse(resultStringify2)
                        console.log(resultObject2)

                        // Iterate to perform intersection of two flight arrays of objects
                        var finalResult = []
                        resultObject.forEach((i) => {
                            resultObject2.forEach((j) => {
                                if (i.flightid == j.flightid) {
                                    finalResult.push(i)
                                }
                            })
                        })

                        console.log(finalResult)
                        res.status(200).send(finalResult)
                    } else {
                        console.log("[ERROR DETECTED]")
                        res.status(500).send({ "Error Message": "[500] Unknown Error" })
                    }
                })
            } else {
                console.log("[ERROR DETECTED]")
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to get flight by flightid
app.get("/flight/:flightid", (req, res) => {
    // Get flightid parameters
    var flightid = req.params.flightid

    // Run function to get flight by flightid
    flight.getFlightById(flightid, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to get airport information by airportid
app.get("/airport/:airportid", (req, res) => {
    // Get airportid parameters
    var airportid = req.params.airportid

    // Run function to get airport by airportid
    airport.getAirportById(airportid, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to get promotion by flightid 
app.get("/flightPromotions/:flightid", (req, res) => {
    // Get flightid parameters
    var flightid = req.params.flightid

    // Function to get promotions by flightid
    promotion.getPromotionByFlightId(flightid, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to add new flight to cart
app.post("/cart/:flightid/:userid", verifyToken, (req, res) => {
    // Get request parameters
    var flightid = req.params.flightid
    var userid = req.params.userid

    // Verify userid before booking
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        // Get request body
        var seatPrice  = req.body.seatPrice
        var quantity = req.body.quantity
        var discount = req.body.discount
    
        // Run function to add flight data to cart
        cart.addFlightToCart(userid, flightid, seatPrice, quantity, discount, (err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else if (err.errno === 1062) {
                res.status(422).send({ "Error Message":"[422] Unprocessable Entity (Duplicated Entry Detected)" })
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to get cart information from cart database
app.get("/cart/:userid", verifyToken, (req, res) => {
    // Get userid parameters
    var userid = req.params.userid
    // Verify userid before booking
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        // Perform function to get cart information
        cart.getCartInformation(userid, (err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to delete cart item by the flightid from cart database
app.delete("/cart/:flightid/:userid", verifyToken, (req, res) => {
    // Get flightid and userid parameters
    var flightid = req.params.flightid
    var userid = req.params.userid
    // Verify userid before booking
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        // Perform function to get cart information
        cart.deleteCartItemByFlightId(flightid, userid, (err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to clear cart
app.delete("/cart", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Perform function to clear cart
        cart.clearCart((err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to get cart item by cartid
app.get("/checkoutCart/:cartid", (req, res) => {
    // Get cartid parameters
    var cartid = req.params.cartid

    // Run function to get cart item by its cartid
    cart.getCartItemById(cartid, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to get all flights sorted
app.get("/searchFlights", (req, res) => {
    // Get search queries
    var searchQuery = req.query.searchQuery

    // If search query is undefined (blank)
    if (searchQuery === undefined) {
        searchQuery = "%%"
    } else {
        searchQuery = "%" + searchQuery + "%"
    }

    // Get sorting method query
    var sortMethod = req.query.sort

    // If sort method is undefined (blank)
    if (sortMethod === "undefined") {
        sortMethod = ""
    }
    
    // Run function to search flights and sort according to the queries
    flight.searchFlights(searchQuery, sortMethod, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to get transfer flight by origin, transfer and destination airport
app.get("/searchTransfer/flight/:originAirportId/:transferAirportId/:destinationAirportId", (req, res) => {
    // Get request parameters
    var originAirportId = req.params.originAirportId
    var transferAirportId = req.params.transferAirportId
    var destinationAirportId = req.params.destinationAirportId

    // Perform function to search transfer flights with transfer airport specified by user
    flight.getTransfersWithTransferAirport(originAirportId, transferAirportId, destinationAirportId, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to search promotions by query
app.get("/promotions/search", (req, res) => {
    // Get request query
    var query = "%" + req.query.query + "%"

    // Function to search promotions in the promotion database
    promotion.searchPromotions(query, (err, result) => {
        if (!err) {
            console.log(result)
            res.status(200).send(result)
        } else {
            console.log(err)
            res.status(500).send({ "Error Message": "[500] Unknown Error" })
        }
    })
})

// Endpoint to get booking history by userid
app.get("/booking/:userid", verifyToken, (req, res) => {
    // Get userid paramters
    var userid = req.params.userid

    // Verify userid before booking
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        // Function to get booking information from booking database by userid
        booking.getBookingByUserId(userid, (err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to get all booking data from booking table
app.get("/booking", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Function to get all booking information from the booking table
        booking.getAllBooking((err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to clear booking history
app.delete("/booking", verifyToken, (req, res) => {
    // Check for admin privileges
    if (req.decodedToken.role !== "Administrator") {
        res.status(401).send({ "Message": "Unauthorized!" })
    } else {
        // Function to clear all booking history from booking database
        booking.clearAllBooking((err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

// Endpoint to clear booking history by userid
app.delete("/booking/:userid", verifyToken, (req, res) => {
    // Get userid paramters
    var userid = req.params.userid
    
    // Verify userid before booking
    if (isNaN(userid) || userid === undefined) {
        res.status(400).send({"Message":"Bad Request Error"})
    } else if (userid != req.decodedToken.userid) {
        console.log(userid)
        console.log(req.decodedToken)
        res.status(401).send({"Message":"Unauthorized!"})
    } else {
        // Function to clear booking history according to userid
        booking.clearBookingById(userid, (err, result) => {
            if (!err) {
                console.log(result)
                res.status(200).send(result)
            } else {
                console.log(err)
                res.status(500).send({ "Error Message": "[500] Unknown Error" })
            }
        })
    }
})

/*
-----------------------------------------------------------------------
EXPORT APP TO THE SERVER
-----------------------------------------------------------------------
*/
module.exports = app // Export app over to the main server.js file