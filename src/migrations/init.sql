-- Adminer 4.8.1 MySQL 8.0.27 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `method` varchar(255) NOT NULL,
  `data` varchar(255) NOT NULL,
  `result` int NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a1196a1956403417fe3a0343390` (`userId`),
  CONSTRAINT `FK_a1196a1956403417fe3a0343390` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `acl` varchar(255) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `menus` (`name`, `path`, `order`, `acl`, `id`) VALUES
('控制台',	'/dashboard',	2,	'',	1),
('用户管理',	'/users',	2,	'read,create,delete,update,manage',	2),
('角色管理',	'/roles',	3,	'',	3),
('菜单管理',	'/menus',	4,	'',	4),
('日志管理',	'/logs',	2,	'read,create,delete,update,manage',	5);

DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gender` int NOT NULL,
  `photo` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_66ae2944af4393a6f2b3b0ab86` (`uid`),
  CONSTRAINT `FK_66ae2944af4393a6f2b3b0ab862` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `role_menus`;
CREATE TABLE `role_menus` (
  `menusId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`menusId`,`rolesId`),
  KEY `IDX_cf82e501e9b61eab5d815ae3b0` (`menusId`),
  KEY `IDX_135e41fb3c98312c5f171fe9f1` (`rolesId`),
  CONSTRAINT `FK_135e41fb3c98312c5f171fe9f1c` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_cf82e501e9b61eab5d815ae3b0a` FOREIGN KEY (`menusId`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `role_menus` (`menusId`, `rolesId`) VALUES
(2,	2),
(5,	2);

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`id`, `name`) VALUES
(1,	'管理员'),
(2,	'普通用户'),
(3,	'测试用户'),
(4,	'访客'),
(5,	'测试角色1');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `userId` int NOT NULL,
  `rolesId` int NOT NULL,
  PRIMARY KEY (`userId`,`rolesId`),
  KEY `IDX_472b25323af01488f1f66a06b6` (`userId`),
  KEY `IDX_13380e7efec83468d73fc37938` (`rolesId`),
  CONSTRAINT `FK_13380e7efec83468d73fc37938e` FOREIGN KEY (`rolesId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_472b25323af01488f1f66a06b67` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2024-03-25 06:37:24