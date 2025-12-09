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
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `branch_id` int DEFAULT NULL,
  `end_time` time(6) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `start_time` time(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8b52lcodtho7ycx5pl44ksvgv` (`branch_id`),
  CONSTRAINT `FK8b52lcodtho7ycx5pl44ksvgv` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (1,'14:00:00.000000',1,_binary '','06:00:00.000000','Ca chuẩn bị + bán sáng đến trưa','Ca sáng'),(1,'21:30:00.000000',2,_binary '','13:30:00.000000','Ca chính buổi chiều tối, giờ cao điểm','Ca chiều'),(1,'23:59:00.000000',3,_binary '','17:00:00.000000','Ca phụ tăng cường tối (chỉ áp dụng cuối tuần hoặc lễ)','Ca tối'),(1,'02:00:00.000000',4,_binary '','22:00:00.000000','Ca đêm dọn dẹp, chuẩn bị nguyên liệu ngày hôm sau','Ca phụ dọn vệ sinh'),(2,'14:30:00.000000',5,_binary '','06:30:00.000000','Mở cửa sớm phục vụ dân văn phòng','Ca sáng'),(2,'22:00:00.000000',6,_binary '','14:00:00.000000','Ca chính buổi chiều tối','Ca chiều'),(2,'01:00:00.000000',7,_binary '','18:00:00.000000','Phục vụ khách nhậu, khách đi chơi khuya ở Quận 1','Ca tối muộn'),(3,'14:00:00.000000',8,_binary '','06:00:00.000000','Bán sáng + trưa đông học sinh sinh viên','Ca sáng'),(3,'21:30:00.000000',9,_binary '','13:30:00.000000','Ca chính chiều tối','Ca chiều'),(3,'23:00:00.000000',10,_binary '','16:00:00.000000','Tăng cường thứ 6, thứ 7, CN','Ca phụ cuối tuần'),(4,'14:30:00.000000',11,_binary '','06:30:00.000000','Phục vụ khu dân cư, trường học','Ca sáng'),(4,'22:30:00.000000',12,_binary '','14:00:00.000000','Ca chính, giờ tan tầm','Ca chiều'),(4,'00:30:00.000000',13,_binary '','17:30:00.000000','Phụ thu phục vụ khách ăn khuya khu Thủ Đức','Ca tối'),(4,'09:00:00.000000',14,_binary '','04:00:00.000000','Ca sớm chuẩn bị nguyên liệu, nướng thịt, nấu nước dùng','Ca chuẩn bị sáng');
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
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
