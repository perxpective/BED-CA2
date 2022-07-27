/* 
BED Assignment CA2
-   Name: Lee Quan Jun Ervin
-   Class: DISM/FT/2B/21
-   Filename: app.js
-   Description: Script contains the verifyToken function to verify  
    JWT token 
*/

/*
-----------------------------------------------------------------------
IMPORTS AND DECLARATIONS
-----------------------------------------------------------------------
*/
var jwt = require("jsonwebtoken")           // Load jsonwebtoken library 
var JWT_SECRET = require("../config.js")    // Load secret key from config.js

/*
-----------------------------------------------------------------------
MAIN FUNCTION
-----------------------------------------------------------------------
*/
var verifyToken = (req, res, next) => {
    console.log("Running verfiyToken function!")
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({"Message":"Unauthorized!"})
        return
    } else {
        const token = authHeader.replace("Bearer ", "")
        jwt.verify(token, JWT_SECRET, { algorithms: "HS256", expiresIn: 86400 }, (err, decodedToken) => {
            if (err) {
                res.status(401).send({"Message":"Unauthorized!"})
                return
            } else {
                req.decodedToken = decodedToken
                next()
            }
        })
    }
}

// Export the verifyToken function to other programs
module.exports = verifyToken