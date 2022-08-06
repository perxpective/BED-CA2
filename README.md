# BED Assignment 2

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
  - iata code

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

- cart - stores flights user adds to the cart for bookout
  - cartid
  - userid
  - flightid
  - cost
  - quantity
  - discount

## Foreign Keys
- airport.airportid = flight.originAirport and flight.destinationAirport
- flight.flightid = booking.flightid
- user.userid = booking.userid = cart.userid
- user.username = booking.name
- flight.flightid = promotion.flightid = cart.flightid

## Pages Created
- 404.html
- admin.html
- booking.html
- cart.html
- flightdetails.html
- flights.html
- index.html
- login.html
- profile.html
- promotions.html
- searchfights.html
- signup.html
- transfers.html

## Login Credentials
- By default, user table in MySQL should be empty. To create a new account, go the login page by clicking on the profile icon on the top right icon corner of the page.
- At the bottom of the login inputs, click on "Register here!" to create your new account!
- After creating a new account, log in to your new account on the login page!
- Note: To create an admin account, email must contain @spair.com

## Updates to Basic Requirement Fulfillment (Additional Endpoints)
Endpoints can be found in the Microsoft Word Documentation found in the GitHub repository.

## Basic Requirements Fulfillment
- Persistent login (Storing of JWT Token and User ID on Local Storage)
- Page with search form for users to search flights by origin and destination locations and departure and return dates
- Search results from search form inputs
  - Basic information about flight provided in the results along with the returning flight
- Flight details page with full flight information with flight code, aircraft, departure airport and destination airport, travel time and price
- Profile page displaying user information like username, email and role
- Admin Panel
  - Add New Flight option with airport options from database
  - Add New Airport option 
    - Alert message shown if duplicate entry detected

## Bonus Features Fulfillment
- Uploading of actual image for aircraft seats when creating new flights
- Add and search for promotions for flights
- Shopping cart functionality to book flights and confirm payment details and check out data saved to database using local storage
- Search including option for transfer airport for non-direct flights

## Additional/Advanced Features:
- Added additional column for airport table called IATA code to display short forms of airports on the flights
- Minimum and maximum price range search option in flight search
- Page to browse all flights and sort and filter flights (by price or flight code alphabetical order)
- Sign Up for new users to create a new account to login to the booking app
- Ability to book flights and add them to the booking history table using existing booking endpoints
- Option to search for all possible flight connections (i.e. possible transfer flights) when only origin and destination airport indicated
- Error page displayed when status code 404 occurs
- Option to clear cart or delete cart item in cart page
- Add and delete promotions, airports and flights on the admin panel
- Option for user to edit their user information and change their profile picture (with new profile picture preview)
- Users can choose quantity and seat class for their selected flight and add them to the cart
- Admins can review booking history in a table in the admin panel and can delete the table when needed

## Additional GUI Features
- Cursor-tracking background implemented with [Vanta.js](https://www.vantajs.com/), an open source Three.js library
- Animations and transitions implemented with [Animista](https://animista.net/), an open source keyframe generator for popular animations
- Most of the UI and form inputs makes the most out of the Bootstrap v5.0 framework
- Form validations done with Bootstrap JS Scripts
- Icons are sourced from [FontAwesome](https://fontawesome.com/)
- PNG Icons are sourced from [Flaticon](https://www.flaticon.com/)