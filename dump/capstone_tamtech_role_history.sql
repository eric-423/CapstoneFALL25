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
-- Table structure for table `role_history`
--

DROP TABLE IF EXISTS `role_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_history` (
  `branch_id` int DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `role_history_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_history_id`),
  KEY `FKot3qjtsgngqflshnymawydvyg` (`branch_id`),
  KEY `FKdchdqcnd5ctm7098k4nuhdx6f` (`role_id`),
  KEY `FKhn4qas99fbt9ikls3r1ibxwmk` (`user_id`),
  CONSTRAINT `FKdchdqcnd5ctm7098k4nuhdx6f` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FKhn4qas99fbt9ikls3r1ibxwmk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKot3qjtsgngqflshnymawydvyg` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_history`
--

LOCK TABLES `role_history` WRITE;
/*!40000 ALTER TABLE `role_history` DISABLE KEYS */;
INSERT INTO `role_history` VALUES (1,_binary '',1,1,1,NULL,'2025-12-08 02:04:33.000000','ADMIN'),(1,_binary '',2,2,2,NULL,'2025-12-08 02:04:33.000000','MANAGER'),(1,_binary '',3,3,3,NULL,'2025-12-08 02:04:33.000000','STAFF'),(1,_binary '',4,4,4,NULL,'2025-12-08 02:04:33.000000','WAITER'),(1,_binary '',5,5,5,NULL,'2025-12-08 02:04:33.000000','SHIPPER'),(1,_binary '',6,6,6,NULL,'2025-12-08 02:04:33.000000','CHEFF'),(2,_binary '',7,2,7,NULL,'2025-12-08 02:04:33.000000','MANAGER'),(2,_binary '',8,3,8,NULL,'2025-12-08 02:04:33.000000','STAFF'),(2,_binary '',9,4,9,NULL,'2025-12-08 02:04:33.000000','WAITER'),(2,_binary '',10,5,10,NULL,'2025-12-08 02:04:33.000000','SHIPPER'),(2,_binary '',11,6,11,NULL,'2025-12-08 02:04:33.000000','CHEFF'),(3,_binary '',12,2,12,NULL,'2025-12-08 02:04:33.000000','MANAGER'),(3,_binary '',13,3,13,NULL,'2025-12-08 02:04:33.000000','STAFF'),(3,_binary '',14,4,14,NULL,'2025-12-08 02:04:33.000000','WAITER'),(3,_binary '',15,5,15,NULL,'2025-12-08 02:04:33.000000','SHIPPER'),(3,_binary '',16,6,16,NULL,'2025-12-08 02:04:33.000000','CHEFF');
/*!40000 ALTER TABLE `role_history` ENABLE KEYS */;
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
