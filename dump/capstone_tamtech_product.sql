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
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `is_active` bit(1) DEFAULT NULL,
  `product_calories_cache` double DEFAULT NULL,
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_price` double DEFAULT NULL,
  `product_type_id` int DEFAULT NULL,
  `create_date` datetime(6) DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `product_description` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FKlabq3c2e90ybbxk58rc48byqo` (`product_type_id`),
  CONSTRAINT `FKlabq3c2e90ybbxk58rc48byqo` FOREIGN KEY (`product_type_id`) REFERENCES `product_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (_binary '',NULL,1,55000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Cơm tấm + sườn cốt lết nướng than + bì + chả trứng + mỡ hành + đồ chua + nước mắm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-suon%20(1).jpg','Cơm tấm sườn nướng'),(_binary '',NULL,2,60000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Cơm tấm + sườn nướng + bì thính + chả trứng hấp + mỡ hành + đồ chua','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-suon-bi-cha.jpg','Cơm tấm sườn bì chả'),(_binary '',NULL,3,75000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Cơm tấm đầy đủ: sườn nướng + bì + chả trứng + trứng ốp la + tóp mỡ + xúc xích','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-dac-biet.jpg','Cơm tấm thập cẩm đặc biệt'),(_binary '',NULL,4,85000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Sườn cây to nướng than hoa nguyên miếng + cơm + bì + chả + trứng','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-suon-cay.jpg','Cơm tấm sườn cây'),(_binary '',NULL,5,60000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Sườn cốt lết + ốp la lòng đào','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-suon-trung.jpg','Cơm tấm sườn nướng + trứng ốp la'),(_binary '',NULL,6,45000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Không sườn, chỉ có bì thính + chả trứng hấp','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-suon-bi-cha.jpg','Cơm tấm bì chả'),(_binary '',NULL,7,65000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Sườn + chả trứng hấp 3 tầng','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-suon-cha-trung.jpg','Cơm tấm sườn nướng + chả trứng'),(_binary '',NULL,8,65000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Gà ta ướp sả nướng + cơm tấm + rau sống','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-ga-nuong.jpg','Cơm tấm gà nướng'),(_binary '',NULL,9,70000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Đùi/tỏ gà chiên giòn nước mắm tỏi ớt','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-ga-chien-nuoc-mam.jpg','Cơm tấm gà chiên mắm'),(_binary '',NULL,10,75000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Bò lúc lắc phi lê + cơm tấm + trứng ốp la','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-bo-luc-lac.jpg','Cơm tấm bò lúc lắc'),(_binary '',NULL,11,70000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Nem nướng Nha Trang + cơm tấm + đồ chua','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-nem-nuong.jpg','Cơm tấm nem nướng'),(_binary '',NULL,12,80000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Heo quay nguyên miếng giòn bì + cơm tấm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-heo-quay-gion-bi.jpg','Cơm tấm heo quay giòn bì'),(_binary '',NULL,13,65000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Phá lấu bò + bánh mì + cơm tấm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-pha-lau-bo.webp','Cơm tấm phá lấu bò'),(_binary '',NULL,14,15000,1,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Chỉ cơm tấm + mỡ hành (không topping)','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-tam-them.jpg','Dĩa cơm tấm thêm'),(_binary '',NULL,15,10000,3,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Cơm trắng dẻo (khách kêu thêm)','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/com-trang.jpg','Cơm trắng'),(_binary '',NULL,16,35000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 miếng sườn nướng thêm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/suong-cot-let-nuong.jpg','Sườn cốt lết nướng'),(_binary '',NULL,17,60000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 cây sườn to thêm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/suong-cay-nuong.jpg','Sườn cây nướng'),(_binary '',NULL,18,20000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 miếng chả trứng 3 tầng','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/cha-trung-hap.jpg','Chả trứng hấp'),(_binary '',NULL,19,10000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 trứng gà ốp la lòng đào','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/trung-op-la.jpg','Trứng ốp la'),(_binary '',NULL,20,15000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','2 trứng non','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/trung-non-op-la.jpg','Trứng non ốp la'),(_binary '',NULL,21,15000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 phần bì heo trộn thính','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/bi-thinh.jpg','Bì thính'),(_binary '',NULL,22,15000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 phần tóp mỡ giòn','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/top-mo.jpg','Tóp mỡ'),(_binary '',NULL,23,20000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 cây xúc xích Đức','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/suc-xich-duc-chien.webp','Xúc xích Đức chiên'),(_binary '',NULL,24,25000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 cây nem nướng thêm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/nem-nuong.jpg','Nem nướng'),(_binary '',NULL,25,20000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','100g chả lụa cắt lát','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/cha-lua.jpg','Chả lụa'),(_binary '',NULL,26,35000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','1 phần phá lấu nhỏ','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/pha-lau-bo.webp','Phá lấu bò'),(_binary '',NULL,27,25000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Tô canh chua cá lóc/diều hâu','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/canh-chua-ca.jpg','Canh chua cá'),(_binary '',NULL,28,25000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Tô súp cua trứng bằm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/sup-cua.webp','Súp cua'),(_binary '',NULL,29,18000,4,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Dùng kèm cơm trắng hoặc thêm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/trung-op-la-2-qua.jpg','Trứng ốp la 2 quả'),(_binary '',NULL,30,8000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Ly trà đá nhà làm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/tra-da.jpg','Trà đá'),(_binary '',NULL,31,12000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Ly lớn 700ml','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/binh-tra-da-lon.jpg','Trà đá lớn'),(_binary '',NULL,32,20000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Soda chanh đường tươi','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/soda-chanh.jpg','Soda chanh'),(_binary '',NULL,33,25000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Soda sữa tươi + trứng gà ta','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/soda-hot-ga.jpg','Soda sữa hột gà'),(_binary '',NULL,34,10000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Chai Lavie/Aquafina','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/nuoc-suoi.jpg','Nước suối'),(_binary '',NULL,35,15000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Cà phê phin đen đá','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/ca-phe-da.jpg','Cà phê đá'),(_binary '',NULL,36,18000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Cà phê phin sữa đá','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/ca-phe-sua-da.jpg','Cà phê sữa đá'),(_binary '',NULL,37,20000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Nhiều sữa ít cà phê','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/bac-xiu-da.jpg','Bạc xỉu đá'),(_binary '',NULL,38,18000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Trà chanh tắc nhà làm','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/tra-tac.jpeg','Trà tắc (trà chanh)'),(_binary '',NULL,39,15000,2,'2025-12-08 02:04:33.000000','2025-12-08 02:04:33.000000','Lon nước ngọt các loại','https://scvanwhslmgejfwcmlzx.supabase.co/storage/v1/object/public/images_tamtech/nuoc-ngot.jpg','Nước ngọt (Coke, Pepsi, 7Up)');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
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
