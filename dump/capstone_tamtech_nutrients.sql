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
-- Table structure for table `nutrients`
--

DROP TABLE IF EXISTS `nutrients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrients` (
  `energy_per_unit` double DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrients`
--

LOCK TABLES `nutrients` WRITE;
/*!40000 ALTER TABLE `nutrients` DISABLE KEYS */;
INSERT INTO `nutrients` VALUES (1,1,'CAL','Calories','kcal'),(4,2,'PRO','Protein','g'),(9,3,'FAT','Fat','g'),(4,4,'CARB','Carbohydrate','g'),(0,5,'FIB','Fiber','g'),(0,6,'VIT_A','Vitamin A','mcg'),(0,7,'VIT_C','Vitamin C','mg'),(0,8,'CALC','Calcium','mg'),(0,9,'IRON','Iron','mg'),(0,10,'SOD','Sodium','mg'),(9,11,'TOT_FAT','Total Fat','g'),(9,12,'SAT_FAT','Saturated Fat','g'),(0,13,'CHOL','Cholesterol','mg'),(4,14,'SUGAR','Sugar','g'),(0,15,'POT','Potassium','mg'),(0,16,'MAG','Magnesium','mg'),(0,17,'PHOS','Phosphorus','mg'),(0,18,'VIT_D','Vitamin D','mcg'),(0,19,'VIT_E','Vitamin E','mg'),(0,20,'VIT_B1','Vitamin B1 (Thiamin)','mg'),(0,21,'VIT_B2','Vitamin B2 (Riboflavin)','mg'),(0,22,'VIT_B3','Vitamin B3 (Niacin)','mg'),(0,23,'VIT_B6','Vitamin B6','mg'),(0,24,'VIT_B12','Vitamin B12','mcg'),(0,25,'FOL','Folate','mcg'),(0,26,'ZINC','Zinc','mg'),(0,27,'SEL','Selenium','mcg'),(4,28,'NET_CARB','Net Carbs','g'),(9,29,'TRANS_FAT','Trans Fat','g'),(9,30,'MONO_FAT','Monounsaturated Fat','g'),(9,31,'POLY_FAT','Polyunsaturated Fat','g');
/*!40000 ALTER TABLE `nutrients` ENABLE KEYS */;
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
