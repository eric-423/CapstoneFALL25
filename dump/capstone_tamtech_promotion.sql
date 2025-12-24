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
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `created_by` int DEFAULT NULL,
  `minimum_order_value` double DEFAULT NULL,
  `promotion_discount` int DEFAULT NULL,
  `promotion_status` bit(1) DEFAULT NULL,
  `promotion_type_id` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `promotion_id` binary(16) NOT NULL,
  `promotion_description` varchar(255) DEFAULT NULL,
  `promotion_end_date` varchar(255) DEFAULT NULL,
  `promotion_name` varchar(255) DEFAULT NULL,
  `promotion_start_date` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`promotion_id`),
  KEY `FKghoegpt2btpbr7xjsxhc4ab9g` (`created_by`),
  KEY `FK1ha30u60ttcehpxu7ovuewf2a` (`promotion_type_id`),
  CONSTRAINT `FK1ha30u60ttcehpxu7ovuewf2a` FOREIGN KEY (`promotion_type_id`) REFERENCES `promotion_type` (`promotion_type_id`),
  CONSTRAINT `FKghoegpt2btpbr7xjsxhc4ab9g` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES
  (NULL,50000,10000,_binary '',2,'2025-12-08 02:04:33.000000',UNHEX(REPLACE('00000000-0000-0000-0000-000000000001','-','')),'Giảm 10,000đ cho đơn hàng từ 50,000đ','2099-12-31 23:59:59','CHAOBANMOI','2025-12-08 00:00:00'),
  (NULL,50000,5,_binary '',1,'2025-12-08 02:04:33.000000',UNHEX(REPLACE('00000000-0000-0000-0000-000000000002','-','')),'Giảm 5% cho đơn hàng từ 50,000đ','2099-12-31 23:59:59','LAUTHAINGON','2025-12-08 00:00:00'),
  (NULL,0,0,_binary '',3,'2025-12-08 02:04:33.000000',UNHEX(REPLACE('00000000-0000-0000-0000-000000000003','-','')),'Miễn phí vận chuyển cho mọi đơn hàng','2099-12-31 23:59:59','FREESHIPZUI','2025-12-08 00:00:00');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
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
