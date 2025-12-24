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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email_verified` bit(1) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `is_ban` bit(1) DEFAULT NULL,
  `is_busy` bit(1) DEFAULT NULL,
  `member_association_id` int DEFAULT NULL,
  `member_point` int DEFAULT NULL,
  `phone_verified` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `date_of_birth` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `note` text,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK9q63snka3mdh91as4io72espi` (`phone_number`),
  KEY `FK7mauoxvj21vwpf1s26jbm2cxu` (`member_association_id`),
  CONSTRAINT `FK7mauoxvj21vwpf1s26jbm2cxu` FOREIGN KEY (`member_association_id`) REFERENCES `member_association` (`member_association_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary '',1,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Nguyễn Huệ, Q1, TP.HCM ','anadmin@comtam.com','Trịnh Đình Ngọc An',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000001'),(_binary '',2,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','456 Lê Lợi, Q1, TP.HCM ','manager1@comtam.com','Lê Quang Huy',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000002'),(_binary '',3,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','staff1@comtam.com','Le La ',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000005'),(_binary '',4,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','waiter1@comtam.com','Thai Thai',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000004'),(_binary '',5,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','shipper1@comtam.com','Le Minh Duy',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000003'),(_binary '',6,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','chef1@comtam.com',' Trần Văn Anh ',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000006'),(_binary '',7,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','456 Lê Lợi, Q1, TP.HCM ','manager2@comtam.com','Lê Quang Huy',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000007'),(_binary '',8,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','staff2@comtam.com','Le La ',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000012'),(_binary '',9,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','waiter2@comtam.com','Thai Thai',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000009'),(_binary '',10,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','shipper2@comtam.com','Le Minh Duy',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000008'),(_binary '',11,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','chef2@comtam.com',' Trần Văn Em ',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000018'),(_binary '',12,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','456 Lê Lợi, Q1, TP.HCM ','manager3@comtam.com','Lê Quang Huy',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000011'),(_binary '',13,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','staff3@comtam.com','Lê La ',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000014'),(_binary '',14,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','waiter3@comtam.com','Thai Thai',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000013'),(_binary '',15,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','shipper3@comtam.com','Le Minh Duy',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000015'),(_binary '',16,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-08 02:04:33.000000','2001-01-01 00:00:00.000000','123 Lê Lợi, Q1, TP.HCM ','chef3@comtam.com',' Trần Văn Em ',NULL,'$2a$12$/WxUnBKrKZLG/R7P8tMvIuXrYj1J4cBixfvk2BO0YHVGdKyeAcMfO','0900000010'),(_binary '',17,_binary '\0',_binary '\0',NULL,0,_binary '','2025-12-24 00:00:00.000000','2000-01-01 00:00:00.000000','200 Hoàng Hữu Nam, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam',NULL,'Trịnh An',NULL,'$2a$12$eSI.5yNBJFGoPdMjSIgYs.VGd6Lf8tiY5gs9/Dj6e9YTcpQ.As8tO','0988998249');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
