/* 
BED Assignment CA2
-   Name: Lee Quan Jun Ervin
-   Admin No: 2104005
-   Class: DISM/FT/2B/21
-   Filename: server.js
-   Description: JS code to host the web application on localhost
*/

var app = require('./controller/app.js')        // Import express server from app.js
var port = 8081                                 // Default port for HTTP

// Start the server on port 8081
var server = app.listen(port, () => {
    console.log('Web App Hosted at http://localhost:%s', port);
})