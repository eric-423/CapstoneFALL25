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
-- Table structure for table `branch_product`
--

DROP TABLE IF EXISTS `branch_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_product` (
  `branch_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`branch_id`,`product_id`),
  KEY `FKnrfw0m9ixil6huhvxgi84nw0b` (`product_id`),
  CONSTRAINT `FK6gpxpyos0pogan7rasbbjo3w8` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`),
  CONSTRAINT `FKnrfw0m9ixil6huhvxgi84nw0b` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_product`
--

LOCK TABLES `branch_product` WRITE;
/*!40000 ALTER TABLE `branch_product` DISABLE KEYS */;
INSERT INTO `branch_product` VALUES (1,1),(2,1),(3,1),(4,1),(1,2),(2,2),(3,2),(4,2),(1,3),(2,3),(3,3),(4,3),(1,4),(2,4),(3,4),(4,4),(1,5),(2,5),(3,5),(4,5),(1,6),(2,6),(3,6),(4,6),(1,7),(2,7),(3,7),(4,7),(1,8),(2,8),(3,8),(4,8),(1,9),(2,9),(3,9),(4,9),(1,10),(2,10),(3,10),(4,10),(1,11),(2,11),(3,11),(4,11),(1,12),(2,12),(3,12),(4,12),(1,13),(2,13),(3,13),(4,13),(1,14),(2,14),(3,14),(4,14),(1,15),(2,15),(3,15),(4,15),(1,16),(2,16),(3,16),(4,16),(1,17),(2,17),(3,17),(4,17),(1,18),(2,18),(3,18),(4,18),(1,19),(2,19),(3,19),(4,19),(1,20),(2,20),(3,20),(4,20),(1,21),(2,21),(3,21),(4,21),(1,22),(2,22),(3,22),(4,22),(1,23),(2,23),(3,23),(4,23),(1,24),(2,24),(3,24),(4,24),(1,25),(2,25),(3,25),(4,25),(1,26),(2,26),(3,26),(4,26),(1,27),(2,27),(3,27),(4,27),(1,28),(2,28),(3,28),(4,28),(1,29),(2,29),(3,29),(4,29),(1,30),(2,30),(3,30),(4,30),(1,31),(2,31),(3,31),(4,31),(1,32),(2,32),(3,32),(4,32),(1,33),(2,33),(3,33),(4,33),(1,34),(2,34),(3,34),(4,34),(1,35),(2,35),(3,35),(4,35),(1,36),(2,36),(3,36),(4,36),(1,37),(2,37),(3,37),(4,37),(1,38),(2,38),(3,38),(4,38),(1,39),(2,39),(3,39),(4,39);
/*!40000 ALTER TABLE `branch_product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 13:53:13
