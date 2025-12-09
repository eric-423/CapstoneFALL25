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
-- Table structure for table `cooking_methods`
--

DROP TABLE IF EXISTS `cooking_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cooking_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cooking_methods`
--

LOCK TABLES `cooking_methods` WRITE;
/*!40000 ALTER TABLE `cooking_methods` DISABLE KEYS */;
INSERT INTO `cooking_methods` VALUES (1,'Nướng trên than hoa, lò nướng hoặc vỉ nướng gas','Nướng'),(2,'Nấu chín nguyên liệu trong nước sôi','Luộc'),(3,'Chiên ngập dầu hoặc chiên áp chảo trong dầu nóng','Chiên'),(4,'Hấp cách thủy hoặc hấp trực tiếp','Hấp'),(5,'Xào nhanh trên chảo/wok với lửa lớn','Xào'),(6,'Om nhỏ lửa với nước mắm, nước dừa hoặc đường','Kho'),(7,'Nướng trực tiếp trên than hoa đỏ để có mùi thơm đặc trưng','Nướng than hoa'),(8,'Chiên trứng lòng đào hoặc chín với ít dầu','Ốp la'),(9,'Nướng trong lò nướng điện/lò vi sóng có chức năng nướng','Nướng lò'),(10,'Áp chảo miếng thịt/sườn với ít dầu để vàng mặt','Áp chảo'),(11,'Rim lửa nhỏ cho nước sốt keo lại (thường dùng rim sườn, thịt kho tàu)','Rim'),(12,'Thắng tóp mỡ, thắng đường màu, thắng nước mắm','Thắng'),(13,'Trộn gỏi, trộn bì heo, trộn đồ chua','Trộn'),(14,'Ngâm giấm đường làm đồ chua (cà rốt, củ cải)','Ngâm'),(15,'Thái da heo, bì heo thành sợi nhỏ (kết hợp với thính gạo)','Thái chỉ'),(16,'Quay gà, quay heo (nếu quán có cơm tấm gà quay, heo quay)','Quay'),(17,'Rang thính gạo, rang tóp mỡ','Rang'),(18,'Hầm xương, hầm nước dùng (nếu bán thêm súp hoặc canh)','Hầm'),(19,'Chiên ngập dầu đến khi vàng giòn (da heo chiên giòn, nem nướng chiên lại)','Chiên giòn'),(20,'Dùng nồi chiên không dầu (air fryer) – nhiều quán hiện đại đang dùng','Chiên không dầu'),(21,'Hun khói nhẹ sườn hoặc thịt (một số quán cơm tấm đặc sản)','Hun khói'),(22,'Bọc giấy bạc nướng sườn giữ độ ẩm và thơm','Nướng giấy bạc'),(23,'Om lửa nhỏ với gia vị (om sườn, om củ)','Om'),(24,'Trụng sơ rau, trụng bún, trụng thịt','Trụng'),(25,'Pha nước mắm, pha nước chấm','Pha'),(26,'Đánh trứng cho chả trứng','Đánh'),(27,'Nướng trên vỉ inox hoặc vỉ gang','Nướng vỉ'),(28,'Nướng chả trứng hoặc nem trong ống tre (đặc sản một số nơi)','Nướng ống tre');
/*!40000 ALTER TABLE `cooking_methods` ENABLE KEYS */;
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
