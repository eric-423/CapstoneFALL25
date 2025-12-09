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
-- Table structure for table `material_type`
--

DROP TABLE IF EXISTS `material_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_type` (
  `is_deleted` bit(1) DEFAULT NULL,
  `material_type_id` int NOT NULL AUTO_INCREMENT,
  `material_type_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`material_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_type`
--

LOCK TABLES `material_type` WRITE;
/*!40000 ALTER TABLE `material_type` DISABLE KEYS */;
INSERT INTO `material_type` VALUES (_binary '\0',1,'Thịt'),(_binary '\0',2,'Rau'),(_binary '\0',3,'Gạo'),(_binary '\0',4,'Gia vị'),(_binary '\0',5,'Trứng'),(_binary '\0',6,'Xúc xích'),(_binary '\0',7,'Sườn cốt lết heo'),(_binary '\0',8,'Thịt nạc heo xay'),(_binary '\0',9,'Da heo'),(_binary '\0',10,'Tóp mỡ'),(_binary '\0',11,'Hành tím'),(_binary '\0',12,'Hành lá'),(_binary '\0',13,'Tỏi'),(_binary '\0',14,'Ớt tươi'),(_binary '\0',15,'Dưa leo'),(_binary '\0',16,'Cà chua'),(_binary '\0',17,'Đồ chua'),(_binary '\0',18,'Nước mắm'),(_binary '\0',19,'Chanh'),(_binary '\0',20,'Đường'),(_binary '\0',21,'Tiêu đen'),(_binary '\0',22,'Bột ngọt'),(_binary '\0',23,'Dầu ăn'),(_binary '\0',24,'Bột năng'),(_binary '\0',25,'Mỡ heo'),(_binary '\0',26,'Nước dừa'),(_binary '\0',27,'Sữa đặc'),(_binary '\0',28,'Màu dầu điều'),(_binary '\0',29,'Chả lụa'),(_binary '\0',30,'Nem nướng'),(_binary '\0',31,'Cơm mỡ hành');
/*!40000 ALTER TABLE `material_type` ENABLE KEYS */;
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
