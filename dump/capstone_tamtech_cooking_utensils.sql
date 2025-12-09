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
-- Table structure for table `cooking_utensils`
--

DROP TABLE IF EXISTS `cooking_utensils`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cooking_utensils` (
  `cooking_utensils_id` int NOT NULL AUTO_INCREMENT,
  `cooking_utensils_quantity` int DEFAULT NULL,
  `utensils_type_id` int DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `cooking_utensils_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cooking_utensils_id`),
  KEY `FK6i89c58wqddpq0smh3y8fdtbj` (`utensils_type_id`),
  KEY `FKqskdsgoh9i1ptrjaeadw2s9fv` (`warehouse_id`),
  CONSTRAINT `FK6i89c58wqddpq0smh3y8fdtbj` FOREIGN KEY (`utensils_type_id`) REFERENCES `utensils_type` (`utensils_type_id`),
  CONSTRAINT `FKqskdsgoh9i1ptrjaeadw2s9fv` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cooking_utensils`
--

LOCK TABLES `cooking_utensils` WRITE;
/*!40000 ALTER TABLE `cooking_utensils` DISABLE KEYS */;
INSERT INTO `cooking_utensils` VALUES (1,5,1,1,'Nồi lớn 50L'),(2,8,1,1,'Nồi vừa 30L'),(3,10,2,1,'Chảo lớn'),(4,15,2,1,'Chảo nhỏ'),(5,12,3,1,'Dao thái thịt'),(6,15,3,1,'Dao thái rau'),(7,10,4,1,'Thớt lớn'),(8,20,4,1,'Thớt nhỏ'),(9,15,5,1,'Kẹp nướng'),(10,20,6,1,'Muỗng lớn'),(11,30,7,1,'Đũa cả'),(12,200,8,1,'Bát đĩa sứ'),(13,2,9,1,'Máy xay thịt'),(14,3,9,1,'Lò nướng'),(15,4,1,2,'Nồi lớn 50L'),(16,6,1,2,'Nồi vừa 30L'),(17,8,2,2,'Chảo lớn'),(18,12,2,2,'Chảo nhỏ'),(19,10,3,2,'Dao thái thịt'),(20,12,3,2,'Dao thái rau'),(21,8,4,2,'Thớt lớn'),(22,15,4,2,'Thớt nhỏ'),(23,12,5,2,'Kẹp nướng'),(24,15,6,2,'Muỗng lớn'),(25,25,7,2,'Đũa cả'),(26,150,8,2,'Bát đĩa sứ'),(27,1,9,2,'Máy xay thịt'),(28,2,9,2,'Lò nướng'),(29,3,1,3,'Nồi lớn 50L'),(30,5,1,3,'Nồi vừa 30L'),(31,7,2,3,'Chảo lớn'),(32,10,2,3,'Chảo nhỏ'),(33,8,3,3,'Dao thái thịt'),(34,10,3,3,'Dao thái rau'),(35,6,4,3,'Thớt lớn'),(36,12,4,3,'Thớt nhỏ'),(37,10,5,3,'Kẹp nướng'),(38,12,6,3,'Muỗng lớn'),(39,20,7,3,'Đũa cả'),(40,120,8,3,'Bát đĩa sứ'),(41,1,9,3,'Máy xay thịt'),(42,2,9,3,'Lò nướng'),(43,4,1,4,'Nồi lớn 50L'),(44,7,1,4,'Nồi vừa 30L'),(45,9,2,4,'Chảo lớn'),(46,13,2,4,'Chảo nhỏ'),(47,11,3,4,'Dao thái thịt'),(48,13,3,4,'Dao thái rau'),(49,9,4,4,'Thớt lớn'),(50,18,4,4,'Thớt nhỏ'),(51,13,5,4,'Kẹp nướng'),(52,18,6,4,'Muỗng lớn'),(53,28,7,4,'Đũa cả'),(54,180,8,4,'Bát đĩa sứ'),(55,2,9,4,'Máy xay thịt'),(56,2,9,4,'Lò nướng');
/*!40000 ALTER TABLE `cooking_utensils` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 13:53:14
