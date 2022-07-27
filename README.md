# BED Assignment 1

Back-End Web Development (BED) CA2 Assignment
Developed a full-stack flight booking website


## Setup Instructions
- Open the zip and open the extracted folder in Visual Studio Code
-	Open the db_init.sql file, paste it on the query and run it on the Workbench by clicking on the lightning icon
  - If you cannot open the file, open the SQL file in a text editor and copy and paste the contents on the query
-	On the databaseConfig.js file located in the model folder, change the password to your own password that you usually use in the Workbench
-	Install all the required node packages using “npm install”
-	Refer to README.md for more details about the code
-	First Method:
  - Right click the respective "client" and "server" folders and click on the 'Open in Integrated Terminal' option for each of the folders
  - Run nodemon on each of the terminals
  - If nodemon does not work, run the command node index.js and node server.js for the client terminal and server terminal respectively
- Second Method:
  - Create two new terminals on your VSCode workstation
  - Run two commands: cd server and cd client for each terminal
  - Run nodemon on both terminals
  - If nodemon does not work, run the command node index.js and node server.js for the client terminal and server terminal respectively

## NPM Packages Installed
- Body Parser
- Express
- Multer
- MySQL
- Nodemon

## Scripts and Stylesheets Linked
- Boostrap
- Popper.js
- Axios
- jQuery
- Vanta.js
- FontAwesome

Refer to the package.json file to view all the dependencies

### Project Directory
```
.
├── client/
│   ├── node_modules/
│   ├── public/
│   │   ├── css/
│   │   │   ├── admin.css
│   │   │   ├── global.css
│   │   │   ├── index.css
│   │   │   ├── login.css
│   │   │   ├── profile.css
│   │   │   ├── searchflights.css
│   │   │   └── signup.css
│   │   ├── images/
│   │   ├── 404.html
│   │   ├── admin.html
│   │   ├── booking.html
│   │   ├── cart.html
│   │   ├── flightdetails.html
│   │   ├── flights.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── profile.html
│   │   ├── searchflights.html
│   │   ├── signup.html
│   │   └── transfers.html
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── server/
│   ├── auth/
│   │   └── verifyToken.js
│   ├── controller/
│   │   └── app.js
│   ├── model/
│   │   ├── airport.js
│   │   ├── booking.js
│   │   ├── cart.js
│   │   ├── databaseConfig.js
│   │   ├── flight.js
│   │   ├── promotion.js
│   │   └── user.js
│   ├── node_modules/
│   ├── uploads/
│   ├── config.js
│   ├── db_init.sql
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
└── README.md
```

## SQL Tables Created
Database name: sp_air

- user - stores user information
  - user id
  - username
  - email
  - contact number
  - password
  - role
  - profile picture
  - created_at

- flight - stores flight information
  - flight id 
  - flight code
  - aircraft type
  - origin airport
  - destination airport
  - embark date
  - travel time
  - price
  - product listing image
  - created_at

- airport - stores airport name and country
  - airport id
  - name of airport
  - country of airport
  - description of airport
  - IATA code

- bookings - stores booking made by a user
  - booking id
  - name
  - passport
  - nationality
  - age
  - booked_at

- promotion - store promotion period dates and discounts
  - promotion id
  - flight id
  - startDate
  - endDate
  - discount

## Foreign Keys
- airport.airportid = flight.originAirport and flight.destinationAirport
- flight.flightid = booking.flightid
- user.userid = booking.userid
- user.username = booking.name
- flight.flightid = promotion.flightid

## Pages Created
- login.html
- signup.html
- index.html
- profile.html
- admin.html
- flightdetails.html
- searchflights.html
- transfers.html

## Updates to Basic Requirement Fufillment (Additional Endpoints)
Added the following additional endpoints to enable maximum functionality of the website:
- 

## Bonus Features Fufillment
- Uploading of actual image for aircraft seats when creating new flights
- Add and search for promotions for flights
- Shopping cart functionality to book flights and confirm payment details and check out data saved to database
- Search including option for transfer airport for non-direct flights

## Basic Requirements Needed
<u>Basic Functionality</u>
- Persistent login *
- Search by origin airport, destination airport, departure date and return date *
- View flight details
- View profile information *
- Add new flights (Admins) *
- Add new airports (Admins) *

<u>Pages</u>
- Login Page *
- Home page *
  - Search form for users to search flights *
  - Dropdown list of airports for searching flights *
- Search results page *
  - Contain matching results for search fields from search page
  - Brief information
- Profile page *
- Add New Flight page *
- Add New Airport page *
- Add New Promotion page *

<u>Bonus Requirements</u>
- Add images of flight aircraft seats when creating new flight *
- Shopping cart system (local storage) *
- Add and search promotions for flights 
- Search option for transfer airport for non-direct flights (flights with transfer)

<u>Additional Features</u>
- Delete airports, flights and promotions *
- Price range search *