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
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `branch_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `dining_table_id` int DEFAULT NULL,
  `is_pick_up` bit(1) DEFAULT NULL,
  `is_table` bit(1) DEFAULT NULL,
  `order_amount` double DEFAULT NULL,
  `order_discount_percent` int DEFAULT NULL,
  `order_discount_value` double DEFAULT NULL,
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_point_earned` int DEFAULT NULL,
  `order_point_used` int DEFAULT NULL,
  `order_shiping_fee` double DEFAULT NULL,
  `order_sub_total` double DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `shipped_by` int DEFAULT NULL,
  `shipper_latitude` double DEFAULT NULL,
  `shipper_longitude` double DEFAULT NULL,
  `status_id` int DEFAULT NULL,
  `waiter_id` int DEFAULT NULL,
  `worker_id` int DEFAULT NULL,
  `expired_payment_time` datetime(6) DEFAULT NULL,
  `location_updated_at` datetime(6) DEFAULT NULL,
  `order_created_at` datetime(6) DEFAULT NULL,
  `order_delivery_at` datetime(6) DEFAULT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  `pickup_time` datetime(6) DEFAULT NULL,
  `promotion_id` binary(16) DEFAULT NULL,
  `bill_pdf_url` varchar(1000) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `invoice_url` varchar(255) DEFAULT NULL,
  `order_address` varchar(255) DEFAULT NULL,
  `order_note` varchar(255) DEFAULT NULL,
  `order_payment_code` varchar(255) DEFAULT NULL,
  `order_phone` varchar(255) DEFAULT NULL,
  `order_promotion_code` varchar(255) DEFAULT NULL,
  `payment_url` text,
  PRIMARY KEY (`order_id`),
  KEY `FKj1lld5d8rn0ieefdekw5qbjkj` (`branch_id`),
  KEY `FK8i0eg1fmeed6xqe28akt4mix9` (`customer_id`),
  KEY `FKjr35iesfyq1winpnxe3lpnx6j` (`dining_table_id`),
  KEY `FKgyqbmqrism0pkm2fuesc66ajp` (`payment_method_id`),
  KEY `FKh776bwygioamxh2dryulqf2lx` (`promotion_id`),
  KEY `FKi84nc2n4a8946p64pypydjkal` (`shipped_by`),
  KEY `FKr5l1vt9npeu6cx6jekmpaf0ii` (`status_id`),
  KEY `FKfron9927p3q1wkperh965yywk` (`waiter_id`),
  KEY `FKjs122ld5g8eibm5ne2ohyesnq` (`worker_id`),
  CONSTRAINT `FK8i0eg1fmeed6xqe28akt4mix9` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKfron9927p3q1wkperh965yywk` FOREIGN KEY (`waiter_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKgyqbmqrism0pkm2fuesc66ajp` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`payment_method_id`),
  CONSTRAINT `FKh776bwygioamxh2dryulqf2lx` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`promotion_id`),
  CONSTRAINT `FKi84nc2n4a8946p64pypydjkal` FOREIGN KEY (`shipped_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKj1lld5d8rn0ieefdekw5qbjkj` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`),
  CONSTRAINT `FKjr35iesfyq1winpnxe3lpnx6j` FOREIGN KEY (`dining_table_id`) REFERENCES `dining_table` (`id`),
  CONSTRAINT `FKjs122ld5g8eibm5ne2ohyesnq` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKr5l1vt9npeu6cx6jekmpaf0ii` FOREIGN KEY (`status_id`) REFERENCES `order_status` (`order_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
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
