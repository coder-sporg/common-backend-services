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

INSERT INTO `logs` (`id`, `path`, `method`, `data`, `result`, `userId`) VALUES
(1,	'api/v1/user',	'get',	'',	200,	2),
(2,	'api/v1/user',	'post',	'{username: \'test2\'}',	201,	2),
(3,	'api/v1/login',	'post',	'{username: \'admin\', password: 123456}',	404,	2),
(4,	'api/v1/login',	'post',	'{username: \'admin\', password: \'123123\'}',	500,	2),
(5,	'api/v1/login',	'post',	'',	404,	2),
(6,	'api/v1/login/admin',	'post',	'{}',	404,	3),
(7,	'api/v1/login',	'post',	'{username: \'admin\', password: \'123111\'}',	500,	2),
(8,	'api/v1/login',	'post',	'{username: \'admin\'}',	500,	2);

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

INSERT INTO `profile` (`id`, `gender`, `photo`, `address`, `uid`) VALUES
(1,	1,	'user_photo',	'user_address',	1),
(2,	1,	'wangwu_photo',	'wangwu_address',	2),
(4,	2,	'zhangchi_photo',	'zhangchi_address',	3),
(12,	1,	'阿宝高清大图',	'功夫小镇',	30),
(14,	2,	'楚乔',	'北齐',	32),
(15,	2,	'yue.jpg',	'月球',	33),
(16,	2,	'yue.jpg',	'月球',	41);

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

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1,	'admin-o',	'12345678'),
(2,	'wangwu',	'123456'),
(3,	'张弛',	'123456'),
(30,	'阿宝22222',	'147369258'),
(32,	'星儿',	'147369'),
(33,	'独孤月',	'147369'),
(41,	'马兰星',	'258258'),
(42,	'测试11111',	'11111111'),
(43,	'测试22222',	'11111111'),
(44,	'测试33333',	'11111111'),
(45,	'测试44444',	'11111111'),
(46,	'2024320-1',	'$argon2id$v=19$m=65536,t=3,p=4$OI3BAbD62g4NmtMVX0v7NQ$pR1P50AQ8L/MN2irhqWqS3k2IHTaDcmdoeImxL66+3I'),
(47,	'2024320-2',	'$argon2id$v=19$m=65536,t=3,p=4$Z/dmMmAnAN/lvb+0RdH/Rg$tkvuhzF2/MIj89il32GLKaslFd6PkaAPhuBUorgRG04'),
(48,	'2024320-3',	'$argon2id$v=19$m=65536,t=3,p=4$AHXtPPGdXGyHzwc277B/6Q$099FZdDVc83thzEdxk+1ufUvp/2+mwUOT97AG/IkqVc'),
(49,	'2024320-4',	'$argon2id$v=19$m=65536,t=3,p=4$E8MTFGiAldYQY2aeM23icw$qC/zjRhG/cTjsV6nn2AwLgVrg6U7jQBOEZnTh1gF2VE'),
(50,	'2024320-5',	'$argon2id$v=19$m=65536,t=3,p=4$R2XUB6VJNVmoMky64L2tQw$W9aw56aPcnz42yyMSLe3jC3nc0pIoz4XhyeQ2hPwLsg'),
(51,	'super-admin',	'$argon2id$v=19$m=65536,t=3,p=4$2NBVh0LgrCX/odW9RPGHFA$LX5aZAPaX4Di07NcFxVNraaTbZ4iSj4J1tikwpAFUE0');

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

INSERT INTO `user_roles` (`userId`, `rolesId`) VALUES
(1,	1),
(1,	2),
(2,	2),
(3,	2),
(3,	3),
(30,	2),
(32,	2),
(32,	4),
(33,	4),
(41,	4),
(42,	4),
(43,	3),
(44,	3),
(44,	4),
(45,	3),
(46,	4),
(47,	4),
(48,	4),
(49,	4),
(50,	2),
(50,	4),
(51,	1),
(51,	2);

-- 2024-03-25 06:35:14