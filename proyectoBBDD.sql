-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.40 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para bbdd
CREATE DATABASE IF NOT EXISTS `bbdd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bbdd`;

-- Volcando estructura para tabla bbdd.Bolsa
CREATE TABLE IF NOT EXISTS `Bolsa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dinero` double NOT NULL,
  `ano` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Bolsa: ~6 rows (aproximadamente)
DELETE FROM `Bolsa`;
INSERT INTO `Bolsa` (`id`, `dinero`, `ano`) VALUES
	(1, 50000, 2023),
	(2, 75000, 2024),
	(3, 100000, 2025),
	(4, 60000, 2023),
	(5, 90000, 2024),
	(6, 120000, 2025);

-- Volcando estructura para tabla bbdd.Compra_Inversion
CREATE TABLE IF NOT EXISTS `Compra_Inversion` (
  `idOrden_Compra_FK` int NOT NULL,
  `idInversion_FK` int NOT NULL,
  `numInversion` varchar(7) NOT NULL,
  PRIMARY KEY (`idOrden_Compra_FK`,`idInversion_FK`),
  KEY `idInversion_FK` (`idInversion_FK`),
  CONSTRAINT `compra_inversion_ibfk_1` FOREIGN KEY (`idOrden_Compra_FK`) REFERENCES `Orden_Compra` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compra_inversion_ibfk_2` FOREIGN KEY (`idInversion_FK`) REFERENCES `Inversion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Compra_Inversion: ~5 rows (aproximadamente)
DELETE FROM `Compra_Inversion`;
INSERT INTO `Compra_Inversion` (`idOrden_Compra_FK`, `idInversion_FK`, `numInversion`) VALUES
	(1, 1, 'INV001'),
	(2, 2, 'INV002'),
	(3, 3, 'INV003'),
	(4, 1, 'INV001'),
	(8, 3, 'INV001');

-- Volcando estructura para tabla bbdd.Compra_Presupuesto
CREATE TABLE IF NOT EXISTS `Compra_Presupuesto` (
  `idOrden_Compra_FK` int NOT NULL,
  `idPresupuesto_FK` int NOT NULL,
  PRIMARY KEY (`idOrden_Compra_FK`,`idPresupuesto_FK`),
  KEY `idPresupuesto_FK` (`idPresupuesto_FK`),
  CONSTRAINT `compra_presupuesto_ibfk_1` FOREIGN KEY (`idOrden_Compra_FK`) REFERENCES `Orden_Compra` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compra_presupuesto_ibfk_2` FOREIGN KEY (`idPresupuesto_FK`) REFERENCES `Presupuesto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Compra_Presupuesto: ~4 rows (aproximadamente)
DELETE FROM `Compra_Presupuesto`;
INSERT INTO `Compra_Presupuesto` (`idOrden_Compra_FK`, `idPresupuesto_FK`) VALUES
	(4, 1),
	(5, 2),
	(6, 3),
	(9, 4);

-- Volcando estructura para tabla bbdd.Departamento
CREATE TABLE IF NOT EXISTS `Departamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Departamento: ~5 rows (aproximadamente)
DELETE FROM `Departamento`;
INSERT INTO `Departamento` (`id`, `nombre`) VALUES
	(1, 'Recursos Humanos'),
	(2, 'Tecnología'),
	(3, 'Finanzas'),
	(4, 'Marketing');

-- Volcando estructura para tabla bbdd.Departamento_Usuario
CREATE TABLE IF NOT EXISTS `Departamento_Usuario` (
  `idUsuario_FK` int NOT NULL,
  `idDepartamento_FK` int NOT NULL,
  PRIMARY KEY (`idUsuario_FK`,`idDepartamento_FK`),
  KEY `idDepartamento_FK` (`idDepartamento_FK`),
  CONSTRAINT `departamento_usuario_ibfk_1` FOREIGN KEY (`idUsuario_FK`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `departamento_usuario_ibfk_2` FOREIGN KEY (`idDepartamento_FK`) REFERENCES `Departamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Departamento_Usuario: ~7 rows (aproximadamente)
DELETE FROM `Departamento_Usuario`;
INSERT INTO `Departamento_Usuario` (`idUsuario_FK`, `idDepartamento_FK`) VALUES
	(1, 1),
	(2, 1),
	(2, 2),
	(2, 3),
	(3, 3),
	(2, 4);

-- Volcando estructura para tabla bbdd.Factura
CREATE TABLE IF NOT EXISTS `Factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ruta` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `idOrden_Compra_FK` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idOrden_Compra_FK` (`idOrden_Compra_FK`),
  CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`idOrden_Compra_FK`) REFERENCES `Orden_Compra` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=602 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Factura: ~3 rows (aproximadamente)
DELETE FROM `Factura`;
INSERT INTO `Factura` (`id`, `ruta`, `fecha`, `idOrden_Compra_FK`) VALUES
	(1, '/facturas/OC001.pdf', '2024-01-16', 1),
	(2, '/facturas/OC002.pdf', '2024-02-21', 2),
	(3, '/facturas/OC003.pdf', '2024-03-11', 3);

-- Volcando estructura para tabla bbdd.Inversion
CREATE TABLE IF NOT EXISTS `Inversion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idBolsa_FK` int NOT NULL,
  `idDepartamento_FK` int NOT NULL,
  `cod_inversion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idBolsa_FK` (`idBolsa_FK`),
  KEY `idDepartamento_FK` (`idDepartamento_FK`),
  CONSTRAINT `inversion_ibfk_1` FOREIGN KEY (`idBolsa_FK`) REFERENCES `Bolsa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inversion_ibfk_2` FOREIGN KEY (`idDepartamento_FK`) REFERENCES `Departamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Inversion: ~3 rows (aproximadamente)
DELETE FROM `Inversion`;
INSERT INTO `Inversion` (`id`, `idBolsa_FK`, `idDepartamento_FK`, `cod_inversion`) VALUES
	(1, 1, 1, 'INV001'),
	(2, 2, 1, 'INV002'),
	(3, 3, 1, 'INV003');

-- Volcando estructura para tabla bbdd.Orden_Compra
CREATE TABLE IF NOT EXISTS `Orden_Compra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cod_compra` varchar(50) NOT NULL,
  `cantidad` int NOT NULL,
  `es_inventariable` tinyint(1) NOT NULL,
  `importe` double NOT NULL,
  `fecha` datetime NOT NULL,
  `observacion` varchar(200) DEFAULT NULL,
  `idProveedor_FK` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProveedor_FK` (`idProveedor_FK`),
  CONSTRAINT `orden_compra_ibfk_1` FOREIGN KEY (`idProveedor_FK`) REFERENCES `Proveedor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=614 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Orden_Compra: ~8 rows (aproximadamente)
DELETE FROM `Orden_Compra`;
INSERT INTO `Orden_Compra` (`id`, `cod_compra`, `cantidad`, `es_inventariable`, `importe`, `fecha`, `observacion`, `idProveedor_FK`) VALUES
	(1, 'OC001', 10, 1, 5000.5, '2024-01-15 10:30:00', 'Compra de equipos de oficina', 1),
	(2, 'OC002', 5, 0, 2500.75, '2024-02-20 14:45:00', 'Suministros de papelería', 2),
	(3, 'OC003', 8, 1, 7500.25, '2024-03-10 09:15:00', 'Equipamiento tecnológico', 1),
	(4, 'OC004', 12, 0, 3200.6, '2024-03-25 11:20:00', 'Materiales de limpieza', 3),
	(5, 'OC005', 6, 1, 6000.8, '2024-02-05 16:00:00', 'Mobiliario de oficina', 2),
	(6, 'OC006', 15, 0, 4500.35, '2024-03-18 13:40:00', 'Servicios de consultoría', 3),
	(8, '00011', 5, 1, 215.3, '2025-05-17 00:00:00', 'Mesa', 2),
	(9, '00011', 5, 1, 215.3, '2025-05-17 00:00:00', 'Mesa', 2);

-- Volcando estructura para tabla bbdd.Comentario_Orden
CREATE TABLE IF NOT EXISTS `Comentario_Orden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comentario` text NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `idOrden_Compra_FK` int NOT NULL,
  `idUsuario_FK` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idOrden_Compra_FK` (`idOrden_Compra_FK`),
  KEY `idUsuario_FK` (`idUsuario_FK`),
  CONSTRAINT `comentario_orden_ibfk_1` FOREIGN KEY (`idOrden_Compra_FK`) REFERENCES `Orden_Compra` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comentario_orden_ibfk_2` FOREIGN KEY (`idUsuario_FK`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Comentario_Orden: ~0 rows (aproximadamente)
DELETE FROM `Comentario_Orden`;

-- Volcando estructura para tabla bbdd.Permiso
CREATE TABLE IF NOT EXISTS `Permiso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Permiso: ~3 rows (aproximadamente)
DELETE FROM `Permiso`;
INSERT INTO `Permiso` (`id`, `tipo`) VALUES
	(1, 'Lectura'),
	(2, 'Escritura'),
	(3, 'Administrador');

-- Volcando estructura para tabla bbdd.Permiso_Usuario
CREATE TABLE IF NOT EXISTS `Permiso_Usuario` (
  `idUsuario_FK` int NOT NULL,
  `idPermiso_FK` int NOT NULL,
  PRIMARY KEY (`idUsuario_FK`,`idPermiso_FK`),
  KEY `idPermiso_FK` (`idPermiso_FK`),
  CONSTRAINT `permiso_usuario_ibfk_1` FOREIGN KEY (`idUsuario_FK`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `permiso_usuario_ibfk_2` FOREIGN KEY (`idPermiso_FK`) REFERENCES `Permiso` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Permiso_Usuario: ~5 rows (aproximadamente)
DELETE FROM `Permiso_Usuario`;
INSERT INTO `Permiso_Usuario` (`idUsuario_FK`, `idPermiso_FK`) VALUES
	(1, 1),
	(2, 1),
	(1, 2),
	(1, 3),
	(3, 3);

-- Volcando estructura para tabla bbdd.Presupuesto
CREATE TABLE IF NOT EXISTS `Presupuesto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idBolsa_FK` int NOT NULL,
  `idDepartamento_FK` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idBolsa_FK` (`idBolsa_FK`),
  KEY `idDepartamento_FK` (`idDepartamento_FK`),
  CONSTRAINT `presupuesto_ibfk_1` FOREIGN KEY (`idBolsa_FK`) REFERENCES `Bolsa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `presupuesto_ibfk_2` FOREIGN KEY (`idDepartamento_FK`) REFERENCES `Departamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Presupuesto: ~4 rows (aproximadamente)
DELETE FROM `Presupuesto`;
INSERT INTO `Presupuesto` (`id`, `idBolsa_FK`, `idDepartamento_FK`) VALUES
	(1, 4, 1),
	(2, 5, 1),
	(3, 6, 1),
	(4, 3, 1);

-- Volcando estructura para tabla bbdd.Proveedor
CREATE TABLE IF NOT EXISTS `Proveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Proveedor: ~3 rows (aproximadamente)
DELETE FROM `Proveedor`;
INSERT INTO `Proveedor` (`id`, `nombre`) VALUES
	(1, 'Tecnológica SA'),
	(2, 'Suministros del Norte'),
	(3, 'Servicios Integrales');

-- Volcando estructura para tabla bbdd.Proveedor_Departamento
CREATE TABLE IF NOT EXISTS `Proveedor_Departamento` (
  `idProveedor_FK` int NOT NULL,
  `idDepartamento_FK` int NOT NULL,
  PRIMARY KEY (`idProveedor_FK`,`idDepartamento_FK`),
  KEY `idDepartamento_FK` (`idDepartamento_FK`),
  CONSTRAINT `proveedor_departamento_ibfk_1` FOREIGN KEY (`idProveedor_FK`) REFERENCES `Proveedor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `proveedor_departamento_ibfk_2` FOREIGN KEY (`idDepartamento_FK`) REFERENCES `Departamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Proveedor_Departamento: ~6 rows (aproximadamente)
DELETE FROM `Proveedor_Departamento`;
INSERT INTO `Proveedor_Departamento` (`idProveedor_FK`, `idDepartamento_FK`) VALUES
	(2, 1),
	(1, 2),
	(2, 2),
	(2, 3),
	(3, 3),
	(2, 4);

-- Volcando estructura para tabla bbdd.Usuario
CREATE TABLE IF NOT EXISTS `Usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `cargo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=591 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla bbdd.Usuario: ~3 rows (aproximadamente)
DELETE FROM `Usuario`;
INSERT INTO `Usuario` (`id`, `nombre`, `email`, `cargo`) VALUES
	(1, 'Juan Pérez', 'javiervicente20laalmunia@gmail.com', 'Admin'),
	(2, 'María González', 'vicente.tojav22@zaragoza.salesianos.edu', NULL),
	(3, 'Carlos Rodríguez', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
