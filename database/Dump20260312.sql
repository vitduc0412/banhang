-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: velvetstore
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDefault` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'ttt','09887848847','Tỉnh Bắc Giang','Huyện Tân Yên','Xã Liên Chung','ttt',1,'2026-03-08 10:04:51','2026-03-08 10:04:51');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorId` int NOT NULL,
  `isPublished` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`),
  UNIQUE KEY `slug_16` (`slug`),
  UNIQUE KEY `slug_17` (`slug`),
  UNIQUE KEY `slug_18` (`slug`),
  UNIQUE KEY `slug_19` (`slug`),
  UNIQUE KEY `slug_20` (`slug`),
  UNIQUE KEY `slug_21` (`slug`),
  UNIQUE KEY `slug_22` (`slug`),
  UNIQUE KEY `slug_23` (`slug`),
  UNIQUE KEY `slug_24` (`slug`),
  UNIQUE KEY `slug_25` (`slug`),
  UNIQUE KEY `slug_26` (`slug`),
  UNIQUE KEY `slug_27` (`slug`),
  KEY `authorId` (`authorId`),
  CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'5 cách phối đồ với áo thun trắng cực đẹp','5-cach-phoi-do-voi-ao-thun-trang','<h2>Áo thun trắng - Item không thể thiếu</h2>\n<p>Áo thun trắng là món đồ basic nhất trong tủ quần áo nhưng lại có khả năng phối đồ vô cùng đa dạng. Dưới đây là 5 cách phối đồ giúp bạn luôn nổi bật.</p>\n<h3>1. Áo thun trắng + Quần jean</h3>\n<p>Đây là combo kinh điển không bao giờ lỗi mốt. Bạn có thể chọn quần jean slim fit để tạo vẻ gọn gàng hoặc baggy jean để mang phong cách streetwear.</p>\n<h3>2. Áo thun trắng + Quần kaki</h3>\n<p>Sự kết hợp này mang lại vẻ thanh lịch nhưng vẫn thoải mái. Phù hợp khi đi làm hoặc hẹn hò cuối tuần.</p>\n<h3>3. Áo thun trắng + Váy midi</h3>\n<p>Với các bạn nữ, việc nhét áo thun vào váy midi sẽ tạo nên set đồ cực kỳ nữ tính và thời thượng.</p>\n<h3>4. Layer với áo khoác</h3>\n<p>Áo thun trắng là lớp base hoàn hảo để layer cùng bomber jacket, blazer hay áo cardigan.</p>\n<h3>5. Phối cùng phụ kiện</h3>\n<p>Thêm một chiếc túi tote, kính mát và sneakers trắng, bạn đã có ngay outfit đơn giản mà cực chất.</p>','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',1,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,'Xu hướng thời trang mùa hè 2026','xu-huong-thoi-trang-mua-he-2026','<h2>Những xu hướng nổi bật mùa hè 2026</h2>\n<p>Mùa hè 2026 đánh dấu sự trở lại của nhiều xu hướng thời trang thú vị. Cùng VelvetStore khám phá những trend hot nhất!</p>\n<h3>Màu sắc pastel</h3>\n<p>Các tông màu pastel nhẹ nhàng như hồng phấn, xanh mint, tím lavender tiếp tục chiếm lĩnh sàn diễn thời trang.</p>\n<h3>Chất liệu linen</h3>\n<p>Linen tự nhiên thoáng mát trở thành lựa chọn hàng đầu cho mùa hè. Áo sơ mi linen, quần linen wide-leg là những item must-have.</p>\n<h3>Phong cách tối giản</h3>\n<p>Less is more - phong cách minimalist với gam màu trung tính, đường cắt gọn gàng vẫn là xu hướng chủ đạo.</p>','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',1,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,'Hướng dẫn chọn size quần áo chuẩn nhất','huong-dan-chon-size-quan-ao','<h2>Bí quyết chọn size quần áo online không bao giờ sai</h2>\n<p>Mua sắm online tiện lợi nhưng nhiều người lo ngại việc chọn sai size. Dưới đây là hướng dẫn chi tiết giúp bạn chọn size chuẩn nhất.</p>\n<h3>Cách đo số đo cơ thể</h3>\n<p>Sử dụng thước dây mềm, đo vòng ngực, vòng eo, vòng hông và chiều dài tay. Ghi lại các số đo để so sánh với bảng size.</p>\n<h3>Bảng quy đổi size</h3>\n<p>Size S: Ngực 82-86cm, Eo 66-70cm<br>\nSize M: Ngực 86-90cm, Eo 70-74cm<br>\nSize L: Ngực 90-94cm, Eo 74-78cm<br>\nSize XL: Ngực 94-98cm, Eo 78-82cm</p>\n<h3>Lưu ý khi chọn size</h3>\n<p>Nếu số đo nằm giữa 2 size, nên chọn size lớn hơn để thoải mái hơn. Với áo form oversize, có thể chọn đúng size hoặc nhỉnh hơn 1 size.</p>','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',1,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(4,'tt','ttt','ttt','https://res.cloudinary.com/daytrfyrg/image/upload/v1772970201/velvetstore/mtcqnnxnw7qsn8i0h87p.jpg',1,0,'2026-03-08 09:57:37','2026-03-08 11:43:23');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Adidas','2026-03-08 11:52:17','2026-03-08 11:52:17');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `variantId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `variantId` (`variantId`),
  CONSTRAINT `carts_ibfk_57` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `carts_ibfk_58` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`),
  UNIQUE KEY `slug_16` (`slug`),
  UNIQUE KEY `slug_17` (`slug`),
  UNIQUE KEY `slug_18` (`slug`),
  UNIQUE KEY `slug_19` (`slug`),
  UNIQUE KEY `slug_20` (`slug`),
  UNIQUE KEY `slug_21` (`slug`),
  UNIQUE KEY `slug_22` (`slug`),
  UNIQUE KEY `slug_23` (`slug`),
  UNIQUE KEY `slug_24` (`slug`),
  UNIQUE KEY `slug_25` (`slug`),
  UNIQUE KEY `slug_26` (`slug`),
  UNIQUE KEY `slug_27` (`slug`),
  UNIQUE KEY `slug_28` (`slug`),
  UNIQUE KEY `slug_29` (`slug`),
  UNIQUE KEY `slug_30` (`slug`),
  UNIQUE KEY `slug_31` (`slug`),
  UNIQUE KEY `slug_32` (`slug`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Áo','ao','Các loại áo thời trang nam nữ','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,'Quần','quan','Quần jeans, kaki, shorts thời trang','https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,'Váy','vay','Váy đầm nữ đa phong cách','https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(4,'Phụ kiện','phu-kien','Túi xách, mũ nón, thắt lưng','https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(5,'Áo thun','ao-thun','Áo thun nam nữ',NULL,1,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(6,'Áo sơ mi','ao-so-mi','Áo sơ mi công sở và dạo phố',NULL,1,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(7,'Áo khoác','ao-khoac','Áo khoác gió, hoodie, bomber',NULL,1,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(8,'Quần jean','quan-jean','Quần jean nam nữ các kiểu',NULL,2,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(9,'Quần kaki','quan-kaki','Quần kaki công sở và casual',NULL,2,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(10,'test','test',NULL,NULL,NULL,0,'2026-03-08 11:42:39','2026-03-08 11:42:44');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,'test','2026-03-08 11:52:16','2026-03-08 11:52:16');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `variantId` int NOT NULL,
  `productName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,0) NOT NULL,
  `quantity` int NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `variantId` (`variantId`),
  CONSTRAINT `order_items_ibfk_53` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_54` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,17,'Áo khoác Bomber thời trang','M','Xanh rêu',550000,1,'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600','2026-03-08 10:04:56','2026-03-08 10:04:56');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `fullName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `subtotal` decimal(12,0) NOT NULL,
  `shippingFee` decimal(12,0) DEFAULT '0',
  `discount` decimal(12,0) DEFAULT '0',
  `total` decimal(12,0) NOT NULL,
  `paymentMethod` enum('cod','vnpay') COLLATE utf8mb4_unicode_ci DEFAULT 'cod',
  `paymentStatus` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `status` enum('pending','confirmed','shipping','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `voucherId` int DEFAULT NULL,
  `vnpayTransactionId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orderCode` (`orderCode`),
  UNIQUE KEY `orderCode_2` (`orderCode`),
  UNIQUE KEY `orderCode_3` (`orderCode`),
  UNIQUE KEY `orderCode_4` (`orderCode`),
  UNIQUE KEY `orderCode_5` (`orderCode`),
  UNIQUE KEY `orderCode_6` (`orderCode`),
  UNIQUE KEY `orderCode_7` (`orderCode`),
  UNIQUE KEY `orderCode_8` (`orderCode`),
  UNIQUE KEY `orderCode_9` (`orderCode`),
  UNIQUE KEY `orderCode_10` (`orderCode`),
  UNIQUE KEY `orderCode_11` (`orderCode`),
  UNIQUE KEY `orderCode_12` (`orderCode`),
  UNIQUE KEY `orderCode_13` (`orderCode`),
  UNIQUE KEY `orderCode_14` (`orderCode`),
  UNIQUE KEY `orderCode_15` (`orderCode`),
  UNIQUE KEY `orderCode_16` (`orderCode`),
  UNIQUE KEY `orderCode_17` (`orderCode`),
  UNIQUE KEY `orderCode_18` (`orderCode`),
  UNIQUE KEY `orderCode_19` (`orderCode`),
  UNIQUE KEY `orderCode_20` (`orderCode`),
  UNIQUE KEY `orderCode_21` (`orderCode`),
  UNIQUE KEY `orderCode_22` (`orderCode`),
  UNIQUE KEY `orderCode_23` (`orderCode`),
  UNIQUE KEY `orderCode_24` (`orderCode`),
  UNIQUE KEY `orderCode_25` (`orderCode`),
  UNIQUE KEY `orderCode_26` (`orderCode`),
  UNIQUE KEY `orderCode_27` (`orderCode`),
  UNIQUE KEY `orderCode_28` (`orderCode`),
  KEY `userId` (`userId`),
  KEY `voucherId` (`voucherId`),
  CONSTRAINT `orders_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_54` FOREIGN KEY (`voucherId`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'VS1772964296168',1,'ttt','09887848847','ttt, Xã Liên Chung, Huyện Tân Yên, Tỉnh Bắc Giang',NULL,550000,0,0,550000,'cod','pending','confirmed',NULL,NULL,'2026-03-08 10:04:56','2026-03-08 11:42:54');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `publicId` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPrimary` tinyint(1) DEFAULT '0',
  `sortOrder` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,1,'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600',NULL,0,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,2,'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(4,2,'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=600',NULL,0,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(5,3,'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(6,3,'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600',NULL,0,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(7,4,'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(8,4,'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',NULL,0,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(9,5,'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(10,6,'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(11,6,'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',NULL,0,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(12,7,'https://images.unsplash.com/photo-1625910513413-5fc420e7abbe?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(13,8,'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(14,9,'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(15,10,'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(16,11,'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(17,12,'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600',NULL,1,0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(18,13,'https://res.cloudinary.com/daytrfyrg/image/upload/v1772970275/velvetstore/t1pyoqx6w9qfcjht4i67.jpg','velvetstore/t1pyoqx6w9qfcjht4i67',1,0,'2026-03-08 11:44:35','2026-03-08 11:44:35'),(19,13,'https://res.cloudinary.com/daytrfyrg/image/upload/v1772970275/velvetstore/ydvqzndbw9ucir7hwc1p.jpg','velvetstore/ydvqzndbw9ucir7hwc1p',0,1,'2026-03-08 11:44:35','2026-03-08 11:44:35');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int DEFAULT '0',
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'S','Trắng',50,'AO-THU-S-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,1,'M','Trắng',80,'AO-THU-M-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,1,'L','Trắng',60,'AO-THU-L-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(4,1,'XL','Trắng',40,'AO-THU-XL-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(5,1,'S','Đen',45,'AO-THU-S-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(6,1,'M','Đen',75,'AO-THU-M-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(7,1,'L','Đen',55,'AO-THU-L-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(8,1,'M','Xám',30,'AO-THU-M-XÁ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(9,2,'S','Trắng',30,'AO-SO--S-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(10,2,'M','Trắng',50,'AO-SO--M-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(11,2,'L','Trắng',40,'AO-SO--L-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(12,2,'M','Xanh nhạt',35,'AO-SO--M-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(13,2,'L','Xanh nhạt',25,'AO-SO--L-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(14,3,'M','Đen',25,'AO-KHO-M-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(15,3,'L','Đen',30,'AO-KHO-L-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(16,3,'XL','Đen',20,'AO-KHO-XL-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(17,3,'M','Xanh rêu',14,'AO-KHO-M-XA','2026-03-08 08:37:28','2026-03-08 10:04:56'),(18,3,'L','Xanh rêu',20,'AO-KHO-L-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(19,4,'29','Xanh đậm',35,'QUAN-J-29-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(20,4,'30','Xanh đậm',50,'QUAN-J-30-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(21,4,'31','Xanh đậm',45,'QUAN-J-31-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(22,4,'32','Xanh đậm',40,'QUAN-J-32-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(23,4,'30','Xanh nhạt',30,'QUAN-J-30-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(24,4,'31','Xanh nhạt',25,'QUAN-J-31-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(25,5,'29','Be',40,'QUAN-K-29-BE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(26,5,'30','Be',55,'QUAN-K-30-BE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(27,5,'31','Be',45,'QUAN-K-31-BE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(28,5,'30','Đen',35,'QUAN-K-30-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(29,5,'31','Đen',30,'QUAN-K-31-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(30,6,'S','Hồng',20,'VAY-LI-S-HỒ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(31,6,'M','Hồng',30,'VAY-LI-M-HỒ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(32,6,'L','Hồng',25,'VAY-LI-L-HỒ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(33,6,'S','Xanh',15,'VAY-LI-S-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(34,6,'M','Xanh',20,'VAY-LI-M-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(35,7,'M','Xanh navy',40,'AO-THU-M-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(36,7,'L','Xanh navy',35,'AO-THU-L-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(37,7,'XL','Xanh navy',25,'AO-THU-XL-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(38,7,'M','Trắng',30,'AO-THU-M-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(39,7,'L','Trắng',25,'AO-THU-L-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(40,8,'Free size','Be',60,'TUI-TO-Free size-BE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(41,8,'Free size','Đen',50,'TUI-TO-Free size-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(42,9,'M','Đen',30,'HOODIE-M-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(43,9,'L','Đen',40,'HOODIE-L-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(44,9,'XL','Đen',25,'HOODIE-XL-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(45,9,'M','Xám',20,'HOODIE-M-XÁ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(46,9,'L','Xám',30,'HOODIE-L-XÁ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(47,10,'S','Đen',25,'VAY-MI-S-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(48,10,'M','Đen',35,'VAY-MI-M-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(49,10,'L','Đen',20,'VAY-MI-L-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(50,10,'S','Be',15,'VAY-MI-S-BE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(51,10,'M','Be',25,'VAY-MI-M-BE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(52,11,'M','Trắng',20,'AO-SO--M-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(53,11,'L','Trắng',25,'AO-SO--L-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(54,11,'XL','Trắng',15,'AO-SO--XL-TR','2026-03-08 08:37:28','2026-03-08 08:37:28'),(55,11,'M','Xanh nhạt',18,'AO-SO--M-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(56,11,'L','Xanh nhạt',22,'AO-SO--L-XA','2026-03-08 08:37:28','2026-03-08 08:37:28'),(57,12,'M','Đen',45,'QUAN-S-M-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(58,12,'L','Đen',50,'QUAN-S-L-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(59,12,'XL','Đen',30,'QUAN-S-XL-ĐE','2026-03-08 08:37:28','2026-03-08 08:37:28'),(60,12,'M','Xám',25,'QUAN-S-M-XÁ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(61,12,'L','Xám',30,'QUAN-S-L-XÁ','2026-03-08 08:37:28','2026-03-08 08:37:28'),(62,13,'S','Đen',12,'SKU-9388','2026-03-08 11:44:32','2026-03-08 11:44:32'),(63,13,'L','Đỏ',10,'SKU-9039','2026-03-08 11:44:32','2026-03-08 11:44:32');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,0) NOT NULL,
  `salePrice` decimal(12,0) DEFAULT NULL,
  `categoryId` int NOT NULL,
  `material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `totalSold` int DEFAULT '0',
  `avgRating` decimal(2,1) DEFAULT '0.0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`),
  UNIQUE KEY `slug_16` (`slug`),
  UNIQUE KEY `slug_17` (`slug`),
  UNIQUE KEY `slug_18` (`slug`),
  UNIQUE KEY `slug_19` (`slug`),
  UNIQUE KEY `slug_20` (`slug`),
  UNIQUE KEY `slug_21` (`slug`),
  UNIQUE KEY `slug_22` (`slug`),
  UNIQUE KEY `slug_23` (`slug`),
  UNIQUE KEY `slug_24` (`slug`),
  UNIQUE KEY `slug_25` (`slug`),
  UNIQUE KEY `slug_26` (`slug`),
  UNIQUE KEY `slug_27` (`slug`),
  UNIQUE KEY `slug_28` (`slug`),
  UNIQUE KEY `slug_29` (`slug`),
  UNIQUE KEY `slug_30` (`slug`),
  UNIQUE KEY `slug_31` (`slug`),
  UNIQUE KEY `slug_32` (`slug`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Áo thun cổ tròn Basic','ao-thun-co-tron-basic','Áo thun cotton 100% cao cấp, form regular fit thoải mái. Chất liệu cotton organic mềm mại, thấm hút mồ hôi tốt. Phù hợp mặc hàng ngày, đi chơi hoặc phối layer.',250000,199000,5,'Cotton 100%','VelvetStore',1,1,85,4.7,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,'Áo sơ mi Oxford dài tay','ao-so-mi-oxford-dai-tay','Áo sơ mi Oxford chất vải dệt kim cao cấp, form slim fit lịch lãm. Cổ button-down trẻ trung, phù hợp đi làm hoặc dạo phố cuối tuần.',450000,NULL,6,'Oxford Cotton','VelvetStore',1,1,50,4.0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,'Áo khoác Bomber thời trang','ao-khoac-bomber-thoi-trang','Áo khoác bomber phong cách streetwear cá tính. Chất liệu polyester chống gió nhẹ, lót lụa mềm mịn. Bo gấu và tay áo co giãn tốt.',680000,550000,7,'Polyester','VelvetStore',1,1,31,4.8,'2026-03-08 08:37:28','2026-03-08 10:04:56'),(4,'Quần jean slim fit','quan-jean-slim-fit','Quần jean nam form slim fit tôn dáng, chất vải denim co giãn 2 chiều thoải mái vận động. Wash nhẹ hiện đại, phối đồ dễ dàng.',550000,450000,8,'Denim co giãn','VelvetStore',1,1,59,3.5,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(5,'Quần kaki baggy','quan-kaki-baggy','Quần kaki baggy form rộng thoải mái, phong cách trẻ trung năng động. Chất kaki mềm, nhăn tự nhiên tạo nét phóng khoáng.',420000,NULL,9,'Kaki cotton','VelvetStore',1,1,39,4.5,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(6,'Váy liền hoa nhí dáng xòe','vay-lien-hoa-nhi-dang-xoe','Váy liền thân họa tiết hoa nhí vintage, dáng xòe nữ tính. Chất vải voan mềm mại bay bổng, phù hợp đi chơi, dạo phố, chụp ảnh.',520000,420000,3,'Voan cao cấp','VelvetStore',1,1,24,4.7,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(7,'Áo thun polo nam','ao-thun-polo-nam','Áo polo nam cổ bẻ lịch sự, chất cotton pique thoáng mát. Form regular fit vừa vặn, phù hợp đi làm hoặc đi chơi.',350000,289000,5,'Cotton Pique','VelvetStore',1,1,92,4.3,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(8,'Túi tote canvas thời trang','tui-tote-canvas-thoi-trang','Túi tote canvas dày dặn, in họa tiết minimalist. Kích thước rộng rãi đựng được laptop 14 inch, sách vở và đồ cá nhân.',280000,NULL,4,'Canvas','VelvetStore',1,1,81,4.5,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(9,'Hoodie oversize unisex','hoodie-oversize-unisex','Hoodie oversize phong cách Hàn Quốc, chất nỉ bông dày dặn giữ ấm tốt. Mũ trùm có dây rút, túi kangaroo tiện lợi.',480000,390000,7,'Nỉ bông','VelvetStore',0,1,38,4.3,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(10,'Váy midi xếp ly công sở','vay-midi-xep-ly-cong-so','Váy midi xếp ly thanh lịch, chất liệu polyester cao cấp không nhăn. Lưng thun co giãn thoải mái, phù hợp đi làm hoặc dự tiệc.',460000,NULL,3,'Polyester','VelvetStore',0,1,67,4.7,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(11,'Áo sơ mi linen ngắn tay','ao-so-mi-linen-ngan-tay','Áo sơ mi linen ngắn tay phong cách nghỉ dưỡng. Chất vải linen tự nhiên thoáng mát, form relaxed fit thoải mái.',380000,320000,6,'Linen','VelvetStore',0,1,93,4.0,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(12,'Quần shorts thể thao','quan-shorts-the-thao','Quần shorts thể thao nam dáng ngắn trên gối, chất vải gió siêu nhẹ nhanh khô. Lưng thun co giãn có dây rút.',280000,220000,2,'Polyester','VelvetStore',0,1,31,4.7,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(13,'test','test','test',12000,10000,5,'test',NULL,1,1,0,0.0,'2026-03-08 11:44:32','2026-03-08 11:44:32');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `orderId` int DEFAULT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL,
  `isVisible` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `reviews_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_54` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,2,1,NULL,5,'Chất vải rất đẹp, mặc thoáng mát. Đúng size, giao hàng nhanh. Sẽ ủng hộ shop dài dài!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,3,1,NULL,4,'Sản phẩm đẹp, đúng mô tả. Chỉ hơi rộng hơn mong đợi một chút nhưng vẫn ok.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,2,1,NULL,5,'Mình rất hài lòng với chất lượng sản phẩm. Đường may tỉ mỉ, form đẹp.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(4,2,2,NULL,3,'Sản phẩm tạm được, màu hơi khác so với hình. Nhưng chất vải thì ổn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(5,3,2,NULL,4,'Giao hàng nhanh, đóng gói cẩn thận. Áo mặc lên rất đẹp, vải mềm mịn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(6,2,2,NULL,5,'Quá tuyệt vời! Chất liệu cao cấp, mặc rất thoải mái. 10 điểm!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(7,3,2,NULL,4,'Sản phẩm chất lượng, giá hợp lý. Ship nhanh, nhân viên tư vấn nhiệt tình.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(8,2,3,NULL,5,'Đã mua lần 2, vẫn rất hài lòng. Chất vải bền, giặt không phai màu.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(9,3,3,NULL,5,'Chất vải rất đẹp, mặc thoáng mát. Đúng size, giao hàng nhanh. Sẽ ủng hộ shop dài dài!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(10,2,3,NULL,4,'Sản phẩm đẹp, đúng mô tả. Chỉ hơi rộng hơn mong đợi một chút nhưng vẫn ok.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(11,3,3,NULL,5,'Mình rất hài lòng với chất lượng sản phẩm. Đường may tỉ mỉ, form đẹp.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(12,2,4,NULL,3,'Sản phẩm tạm được, màu hơi khác so với hình. Nhưng chất vải thì ổn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(13,3,4,NULL,4,'Giao hàng nhanh, đóng gói cẩn thận. Áo mặc lên rất đẹp, vải mềm mịn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(14,2,5,NULL,5,'Quá tuyệt vời! Chất liệu cao cấp, mặc rất thoải mái. 10 điểm!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(15,3,5,NULL,4,'Sản phẩm chất lượng, giá hợp lý. Ship nhanh, nhân viên tư vấn nhiệt tình.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(16,2,6,NULL,5,'Đã mua lần 2, vẫn rất hài lòng. Chất vải bền, giặt không phai màu.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(17,3,6,NULL,5,'Chất vải rất đẹp, mặc thoáng mát. Đúng size, giao hàng nhanh. Sẽ ủng hộ shop dài dài!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(18,2,6,NULL,4,'Sản phẩm đẹp, đúng mô tả. Chỉ hơi rộng hơn mong đợi một chút nhưng vẫn ok.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(19,2,7,NULL,5,'Mình rất hài lòng với chất lượng sản phẩm. Đường may tỉ mỉ, form đẹp.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(20,3,7,NULL,3,'Sản phẩm tạm được, màu hơi khác so với hình. Nhưng chất vải thì ổn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(21,2,7,NULL,4,'Giao hàng nhanh, đóng gói cẩn thận. Áo mặc lên rất đẹp, vải mềm mịn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(22,3,7,NULL,5,'Quá tuyệt vời! Chất liệu cao cấp, mặc rất thoải mái. 10 điểm!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(23,2,8,NULL,4,'Sản phẩm chất lượng, giá hợp lý. Ship nhanh, nhân viên tư vấn nhiệt tình.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(24,3,8,NULL,5,'Đã mua lần 2, vẫn rất hài lòng. Chất vải bền, giặt không phai màu.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(25,2,8,NULL,5,'Chất vải rất đẹp, mặc thoáng mát. Đúng size, giao hàng nhanh. Sẽ ủng hộ shop dài dài!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(26,3,8,NULL,4,'Sản phẩm đẹp, đúng mô tả. Chỉ hơi rộng hơn mong đợi một chút nhưng vẫn ok.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(27,2,9,NULL,5,'Mình rất hài lòng với chất lượng sản phẩm. Đường may tỉ mỉ, form đẹp.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(28,3,9,NULL,3,'Sản phẩm tạm được, màu hơi khác so với hình. Nhưng chất vải thì ổn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(29,2,9,NULL,4,'Giao hàng nhanh, đóng gói cẩn thận. Áo mặc lên rất đẹp, vải mềm mịn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(30,3,9,NULL,5,'Quá tuyệt vời! Chất liệu cao cấp, mặc rất thoải mái. 10 điểm!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(31,2,10,NULL,4,'Sản phẩm chất lượng, giá hợp lý. Ship nhanh, nhân viên tư vấn nhiệt tình.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(32,3,10,NULL,5,'Đã mua lần 2, vẫn rất hài lòng. Chất vải bền, giặt không phai màu.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(33,2,10,NULL,5,'Chất vải rất đẹp, mặc thoáng mát. Đúng size, giao hàng nhanh. Sẽ ủng hộ shop dài dài!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(34,2,11,NULL,4,'Sản phẩm đẹp, đúng mô tả. Chỉ hơi rộng hơn mong đợi một chút nhưng vẫn ok.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(35,3,11,NULL,5,'Mình rất hài lòng với chất lượng sản phẩm. Đường may tỉ mỉ, form đẹp.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(36,2,11,NULL,3,'Sản phẩm tạm được, màu hơi khác so với hình. Nhưng chất vải thì ổn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(37,3,11,NULL,4,'Giao hàng nhanh, đóng gói cẩn thận. Áo mặc lên rất đẹp, vải mềm mịn.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(38,2,12,NULL,5,'Quá tuyệt vời! Chất liệu cao cấp, mặc rất thoải mái. 10 điểm!',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(39,3,12,NULL,4,'Sản phẩm chất lượng, giá hợp lý. Ship nhanh, nhân viên tư vấn nhiệt tình.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(40,2,12,NULL,5,'Đã mua lần 2, vẫn rất hài lòng. Chất vải bền, giặt không phai màu.',NULL,1,'2026-03-08 08:37:28','2026-03-08 08:37:28');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_methods`
--

DROP TABLE IF EXISTS `shipping_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fee` decimal(12,0) NOT NULL,
  `estimatedDays` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_methods`
--

LOCK TABLES `shipping_methods` WRITE;
/*!40000 ALTER TABLE `shipping_methods` DISABLE KEYS */;
INSERT INTO `shipping_methods` VALUES (1,'Giao hàng tiêu chuẩn','Giao trong 3-5 ngày làm việc',30000,'3-5 ngày',1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,'Giao hàng nhanh','Giao trong 1-2 ngày làm việc',50000,'1-2 ngày',1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,'Giao hàng hỏa tốc','Giao trong ngày (nội thành)',80000,'Trong ngày',1,'2026-03-08 08:37:28','2026-03-08 08:37:28');
/*!40000 ALTER TABLE `shipping_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_configs`
--

DROP TABLE IF EXISTS `system_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  UNIQUE KEY `key_2` (`key`),
  UNIQUE KEY `key_3` (`key`),
  UNIQUE KEY `key_4` (`key`),
  UNIQUE KEY `key_5` (`key`),
  UNIQUE KEY `key_6` (`key`),
  UNIQUE KEY `key_7` (`key`),
  UNIQUE KEY `key_8` (`key`),
  UNIQUE KEY `key_9` (`key`),
  UNIQUE KEY `key_10` (`key`),
  UNIQUE KEY `key_11` (`key`),
  UNIQUE KEY `key_12` (`key`),
  UNIQUE KEY `key_13` (`key`),
  UNIQUE KEY `key_14` (`key`),
  UNIQUE KEY `key_15` (`key`),
  UNIQUE KEY `key_16` (`key`),
  UNIQUE KEY `key_17` (`key`),
  UNIQUE KEY `key_18` (`key`),
  UNIQUE KEY `key_19` (`key`),
  UNIQUE KEY `key_20` (`key`),
  UNIQUE KEY `key_21` (`key`),
  UNIQUE KEY `key_22` (`key`),
  UNIQUE KEY `key_23` (`key`),
  UNIQUE KEY `key_24` (`key`),
  UNIQUE KEY `key_25` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_configs`
--

LOCK TABLES `system_configs` WRITE;
/*!40000 ALTER TABLE `system_configs` DISABLE KEYS */;
INSERT INTO `system_configs` VALUES (1,'shop_name','VelvetStore','2026-03-08 08:37:29','2026-03-08 08:37:29'),(2,'shop_phone','0901 234 567','2026-03-08 08:37:29','2026-03-08 08:37:29'),(3,'shop_email','contact@velvetstore.vn','2026-03-08 08:37:29','2026-03-08 08:37:29'),(4,'shop_address','123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh','2026-03-08 08:37:29','2026-03-08 08:37:29'),(5,'shop_description','Thời trang chất lượng cao với phong cách hiện đại','2026-03-08 08:37:29','2026-03-08 08:37:29'),(6,'facebook_url','https://facebook.com/velvetstore','2026-03-08 08:37:29','2026-03-08 08:37:29'),(7,'instagram_url','https://instagram.com/velvetstore','2026-03-08 08:37:29','2026-03-08 08:37:29'),(8,'return_policy','Đổi trả miễn phí trong 30 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng.','2026-03-08 08:37:29','2026-03-08 08:37:29'),(9,'shipping_policy','Miễn phí vận chuyển cho đơn hàng từ 500.000₫. Thời gian giao hàng từ 1-5 ngày tùy khu vực.','2026-03-08 08:37:29','2026-03-08 08:37:29'),(10,'warranty_policy','Bảo hành 6 tháng cho các lỗi từ nhà sản xuất. Không bảo hành các trường hợp hư hỏng do người dùng.','2026-03-08 08:37:29','2026-03-08 08:37:29');
/*!40000 ALTER TABLE `system_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `isActive` tinyint(1) DEFAULT '1',
  `resetToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Quản trị viên','admin@velvetstore.vn','$2b$10$LP4llzRCjcL6ywzvMCi4euO8DOiLwV3yWdu7NuCzJRN4uf/bNswM6','0901234567',NULL,'admin',1,NULL,NULL,'2026-03-08 08:37:28','2026-03-08 09:50:35'),(2,'Nguyễn Văn An','an@gmail.com','$2b$10$gmtEHE7gKliP7.1qZeaxWudkjNJ5MLEHV.4zb1Bt42ElyAv/ajNK2','0912345678',NULL,'customer',0,NULL,NULL,'2026-03-08 08:37:28','2026-03-08 11:42:57'),(3,'Trần Thị Bích','bich@gmail.com','$2b$10$gmtEHE7gKliP7.1qZeaxWudkjNJ5MLEHV.4zb1Bt42ElyAv/ajNK2','0923456789',NULL,'customer',1,NULL,NULL,'2026-03-08 08:37:28','2026-03-08 09:56:41');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discountType` enum('percent','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountValue` decimal(12,0) NOT NULL,
  `minOrderValue` decimal(12,0) DEFAULT '0',
  `maxDiscount` decimal(12,0) DEFAULT NULL,
  `usageLimit` int DEFAULT NULL,
  `usedCount` int DEFAULT '0',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'WELCOME10','Giảm 10% cho đơn hàng đầu tiên','percent',10,300000,100000,100,0,'2026-01-01 00:00:00','2026-12-31 00:00:00',1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(2,'FREESHIP','Miễn phí vận chuyển cho đơn từ 500K','fixed',30000,500000,30000,200,0,'2026-01-01 00:00:00','2026-12-31 00:00:00',1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(3,'SUMMER50','Giảm 50.000₫ cho đơn từ 400K','fixed',50000,400000,50000,50,0,'2026-03-01 00:00:00','2026-06-30 00:00:00',1,'2026-03-08 08:37:28','2026-03-08 08:37:28'),(4,'TEST',NULL,'percent',20,120000,100000,NULL,0,'2026-03-08 00:00:00','2026-03-26 00:00:00',1,'2026-03-08 09:57:09','2026-03-08 09:57:09');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `productId` (`productId`),
  CONSTRAINT `wishlists_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_54` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (2,1,2,'2026-03-08 14:01:42','2026-03-08 14:01:42'),(3,1,9,'2026-03-08 14:10:07','2026-03-08 14:10:07');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-12 12:22:46
