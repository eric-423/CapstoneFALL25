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
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `is_deleted` bit(1) DEFAULT NULL,
  `material_id` int NOT NULL AUTO_INCREMENT,
  `material_type_id` int DEFAULT NULL,
  `unit_id` int DEFAULT NULL,
  `material_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`material_id`),
  KEY `FKbi2x1y0wd21rwst858gdylxr7` (`material_type_id`),
  KEY `FK9w8un9dn9l9so77pqhl0rlsfq` (`unit_id`),
  CONSTRAINT `FK9w8un9dn9l9so77pqhl0rlsfq` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`),
  CONSTRAINT `FKbi2x1y0wd21rwst858gdylxr7` FOREIGN KEY (`material_type_id`) REFERENCES `material_type` (`material_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (_binary '\0',1,7,18,'Sườn cốt lết nướng'),(_binary '\0',2,1,18,'Thịt ba rọi nướng'),(_binary '\0',3,1,18,'Gà ta nướng'),(_binary '\0',4,1,18,'Chả trứng hấp'),(_binary '\0',5,1,6,'Bì heo thính'),(_binary '\0',6,29,23,'Chả lụa'),(_binary '\0',7,15,5,'Dưa leo'),(_binary '\0',8,16,5,'Cà chua'),(_binary '\0',9,2,1,'Đậu phộng rang'),(_binary '\0',10,2,1,'Giá đỗ'),(_binary '\0',11,2,19,'Xà lách'),(_binary '\0',12,2,5,'Chuối xanh'),(_binary '\0',13,3,2,'Gạo tấm'),(_binary '\0',14,3,2,'Gạo trắng'),(_binary '\0',15,18,3,'Nước mắm ngon'),(_binary '\0',16,14,5,'Ớt tươi'),(_binary '\0',17,12,19,'Hành lá'),(_binary '\0',18,21,1,'Tiêu đen xay'),(_binary '\0',19,5,5,'Trứng gà ốp la'),(_binary '\0',20,6,23,'Xúc xích Đức'),(_binary '\0',21,2,12,'Canh chua cá'),(_binary '\0',22,7,18,'Sườn cây'),(_binary '\0',23,8,2,'Thịt nạc xay'),(_binary '\0',24,9,1,'Da heo luộc'),(_binary '\0',25,10,1,'Tóp mỡ'),(_binary '\0',26,1,18,'Chả trứng chiên'),(_binary '\0',27,30,23,'Nem nướng'),(_binary '\0',28,1,18,'Bò lúc lắc'),(_binary '\0',29,1,18,'Bò nướng lá lốt'),(_binary '\0',30,1,18,'Gà chiên mắm'),(_binary '\0',31,1,12,'Cơm gà xối mỡ'),(_binary '\0',32,1,18,'Heo quay giòn bì'),(_binary '\0',33,2,19,'Rau thơm (húng, quế, kinh giới)'),(_binary '\0',34,12,19,'Hành lá chẻ'),(_binary '\0',35,11,1,'Hành tím thái mỏng'),(_binary '\0',36,17,1,'Đồ chua (củ cải, cà rốt)'),(_binary '\0',37,13,1,'Tỏi băm'),(_binary '\0',38,14,1,'Ớt băm'),(_binary '\0',39,20,2,'Đường trắng'),(_binary '\0',40,4,3,'Giấm gạo'),(_binary '\0',41,19,5,'Chanh tươi'),(_binary '\0',42,28,3,'Màu dầu điều'),(_binary '\0',43,4,3,'Mật ong'),(_binary '\0',44,27,3,'Sữa đặc'),(_binary '\0',45,26,3,'Nước dừa tươi'),(_binary '\0',46,23,3,'Dầu ăn'),(_binary '\0',47,25,1,'Mỡ heo'),(_binary '\0',48,11,1,'Hành phi'),(_binary '\0',49,25,1,'Mỡ hành'),(_binary '\0',50,5,5,'Trứng ốp la lòng đào'),(_binary '\0',51,5,5,'Trứng non'),(_binary '\0',52,1,12,'Phá lấu bò'),(_binary '\0',53,7,18,'Sườn kho trứng cút'),(_binary '\0',54,3,12,'Cơm chiên dương châu'),(_binary '\0',55,2,12,'Súp cua');
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
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
