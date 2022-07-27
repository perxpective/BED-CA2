# BED Assignment 1

Back-End Web Development (BED) CA2 Assignment
Developed a full-stack flight booking website

## Setup Instructions
- Open the zip and open the extracted folder in Visual Studio Code
-	Open the db_init.sql file, paste it on the query and run it on the Workbench by clicking on the lightning icon
  - If you cannot open the file, open the SQL file in a text editor and copy and paste the contents on the query
-	On the databaseConfig.js file located in the model folder, change the password to your own password that you usually use in the Workbench
-	On the terminal, run “nodemon" or "node server.js" if the first command does not work and you do not have nodemon installed
-	Test all of the endpoints on POSTMAN based on the documentations below
-	Install all the required node packages using “npm install”
-	Refer to README.md for more details about the code

## Packages Installed
- Body Parser
- Express
- Multer
- MySQL
- Nodemon

Refer to the package.json file to view all the dependencies

### Project Directory


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

## Bonus Features Fufillment
- Uploading of actual image for aircraft seats when creating new flights
- Add and search for promotions for flights
- Shopping cart functionality to book flights and confirm payment details and check out data saved to database
- Search including option for transfer airport for non-direct flights

## Basic Requirements Needed
<u>Basic Functionality</u>
- Persistent login *
- Search by origin airport, destination airport, departure date
- View flight details
- View profile information *
- Add new flights (Admins) *
- Add new airports (Admins) *

<u>Pages</u>
- Login Page *
- Home page *
  - Search form for users to search flights
  - Dropdown list of airports for searching flights
- Search results page
  - Contain matching results for search fields from search page
  - Brief information
- Profile page *
- Add New Flight page *
- Add New Airport page *
- Add New Promotion page *

<u>Bonus Requirements</u>
- Add images of flight aircraft seats when creating new flight *
- Add and search promotions for flights 
- Shopping cart system (local storage)
- Search option for transfer airport for non-direct flights (flights with transfer)

<u>Additional Features</u>
- Delete airports, flights and promotions *
- Price range search *