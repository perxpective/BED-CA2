/* 
BED Assignment CA2
-   Name: Lee Quan Jun Ervin
-   Admin No: 2104005
-   Class: DISM/FT/2B/21
-   Filename: server.js
-   Description: SQL Script to run to create the SP AIR schema, tables and columns
*/
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_air
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airport` (
  `airportid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `country` varchar(45) NOT NULL,
  `description` varchar(110) NOT NULL,
  `iata` varchar(45) NOT NULL,
  PRIMARY KEY (`airportid`),
  UNIQUE KEY `name_UNIQUE` (`name`) /*!80000 INVISIBLE */,
  UNIQUE KEY `iata_UNIQUE` (`iata`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `bookingid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `passport` varchar(45) NOT NULL,
  `nationality` varchar(45) NOT NULL,
  `age` int NOT NULL,
  `userid` int NOT NULL,
  `flightid` int NOT NULL,
  `booked_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bookingid`),
  KEY `userid_idx` (`userid`),
  KEY `flightid_idx` (`flightid`),
  CONSTRAINT `flightid` FOREIGN KEY (`flightid`) REFERENCES `flight` (`flightid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cartid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `flightid` int NOT NULL,
  `cost` float NOT NULL,
  `quantity` int NOT NULL,
  `discount` float NOT NULL,
  PRIMARY KEY (`cartid`),
  UNIQUE KEY `flightid_UNIQUE` (`flightid`),
  KEY `flightid_idx` (`flightid`),
  KEY `userid_idx` (`userid`),
  CONSTRAINT `flightid_idx` FOREIGN KEY (`flightid`) REFERENCES `flight` (`flightid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userid_idx` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `flightid` int NOT NULL AUTO_INCREMENT,
  `flightCode` varchar(45) NOT NULL,
  `aircraft` varchar(45) NOT NULL,
  `originAirport` int NOT NULL,
  `destinationAirport` int NOT NULL,
  `embarkDate` datetime NOT NULL,
  `travelTime` varchar(45) NOT NULL,
  `price` float NOT NULL,
  `flight_pic_url` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`flightid`),
  UNIQUE KEY `flightid_UNIQUE` (`flightid`),
  UNIQUE KEY `flightCode_UNIQUE` (`flightCode`),
  KEY `originAirport_idx` (`originAirport`),
  KEY `destinationAirport_idx` (`destinationAirport`),
  CONSTRAINT `destinationAirport` FOREIGN KEY (`destinationAirport`) REFERENCES `airport` (`airportid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `originAirport` FOREIGN KEY (`originAirport`) REFERENCES `airport` (`airportid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `promotionid` int NOT NULL AUTO_INCREMENT,
  `flightid` int NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `discount` decimal(3,2) NOT NULL,
  PRIMARY KEY (`promotionid`),
  KEY `flightid_idx` (`flightid`),
  CONSTRAINT `fk_flightid` FOREIGN KEY (`flightid`) REFERENCES `flight` (`flightid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` int NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(45) NOT NULL,
  `profile_pic_url` longtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-31  1:27:51
