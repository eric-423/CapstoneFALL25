-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: capstone_tamtech
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `material_nutrients`
--

DROP TABLE IF EXISTS `material_nutrients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_nutrients` (
  `amount_per_100_unit` double DEFAULT NULL,
  `material_id` int NOT NULL,
  `nutrient_id` int NOT NULL,
  PRIMARY KEY (`material_id`,`nutrient_id`),
  KEY `FKb26hweys18p2iplr8ccstc35m` (`nutrient_id`),
  CONSTRAINT `FKb26hweys18p2iplr8ccstc35m` FOREIGN KEY (`nutrient_id`) REFERENCES `nutrients` (`id`),
  CONSTRAINT `FKjiud9gr7xycyusgaoavw1pt16` FOREIGN KEY (`material_id`) REFERENCES `material` (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_nutrients`
--

LOCK TABLES `material_nutrients` WRITE;
/*!40000 ALTER TABLE `material_nutrients` DISABLE KEYS */;
INSERT INTO `material_nutrients` VALUES (320,1,1),(22,1,2),(25,1,3),(0,1,4),(0,1,5),(25,1,11),(85,1,12),(280,1,13),(750,1,14),(85,1,15),(1.1,1,24),(3.8,1,27),(350,2,1),(18,2,2),(30,2,3),(0,2,4),(30,2,11),(80,2,12),(320,2,13),(680,2,14),(80,2,15),(165,3,1),(31,3,2),(3.6,3,3),(0,3,4),(70,3,13),(90,3,23),(0,3,24),(3.5,3,27),(1.2,3,28),(220,4,1),(15,4,2),(17,4,3),(3,4,4),(185,4,13),(420,4,14),(900,4,15),(2.2,4,24),(500,5,1),(30,5,2),(42,5,3),(2,5,4),(50,5,13),(150,5,14),(250,6,1),(16,6,2),(20,6,3),(2,6,4),(120,6,13),(380,6,14),(1100,6,15),(15,7,1),(0.7,7,2),(0.1,7,3),(3.6,7,4),(1.5,7,5),(45,7,6),(150,7,15),(422,7,16),(18,8,1),(0.9,8,2),(0.2,8,3),(3.9,8,4),(1.2,8,5),(833,8,6),(42,8,7),(237,8,15),(567,9,1),(26,9,2),(49,9,3),(16,9,4),(8.5,9,5),(7.7,9,16),(2.5,9,26),(7.9,9,30),(30,10,1),(3,10,2),(0.1,10,3),(6,10,4),(1.8,10,5),(38,10,7),(15,11,1),(1.4,11,2),(0.2,11,3),(2.9,11,4),(1.9,11,5),(136,11,6),(36,11,7),(89,12,1),(1.1,12,2),(0.3,12,3),(23,12,4),(2.6,12,5),(358,12,15),(360,13,1),(7,13,2),(0.7,13,3),(80,13,4),(1.3,13,5),(1.2,13,20),(1.6,13,26),(365,14,1),(7.5,14,2),(0.6,14,3),(80,14,4),(0.5,14,5),(60,15,1),(12,15,2),(0.2,15,3),(4,15,4),(18000,15,15),(0.8,15,27),(40,16,1),(1.9,16,2),(0.4,16,3),(8.8,16,4),(3.7,16,5),(2400,16,6),(143,16,7),(32,17,1),(1.9,17,2),(0.5,17,3),(7.3,17,4),(2.6,17,5),(73,17,7),(251,18,1),(10,18,2),(3,18,3),(64,18,4),(25,18,5),(155,19,1),(13,19,2),(11,19,3),(0.7,19,4),(186,19,13),(400,19,14),(1.9,19,24),(0.6,19,25),(300,20,1),(13,20,2),(27,20,3),(2,20,4),(80,20,13),(1500,20,15),(45,21,1),(5,21,2),(1.5,21,3),(4,21,4),(60,21,7),(400,21,15),(340,22,1),(20,22,2),(28,22,3),(90,22,13),(300,22,14),(320,23,1),(800,24,1),(800,25,1),(220,26,1),(280,27,1),(250,28,1),(220,29,1),(280,30,1),(120,31,1),(380,32,1),(25,33,1),(32,34,1),(112,35,1),(30,36,1),(149,37,1),(40,38,1),(387,39,1),(35,40,1),(29,41,1),(884,42,1),(819,43,1),(321,44,1),(46,45,1),(884,46,1),(902,47,1),(592,48,1),(750,49,1),(155,50,1),(180,51,1),(180,52,1),(200,53,1),(1,56,1),(200,57,1),(0,58,1),(0,59,1),(42,60,1),(11,60,14);
/*!40000 ALTER TABLE `material_nutrients` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 13:53:12
