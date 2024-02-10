-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2024 at 04:08 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `revendo`
--

-- --------------------------------------------------------

--
-- Table structure for table `charging_station`
--

CREATE TABLE `charging_station` (
  `station_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `time` bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `charging_station`
--

INSERT INTO `charging_station` (`station_id`, `status`, `time`) VALUES
(1, 'off', 0);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `rfid_number` varchar(255) NOT NULL,
  `height` int(11) NOT NULL,
  `weight` int(11) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `captured_image` longblob DEFAULT NULL,
  `is_valid` varchar(20) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rfid`
--

CREATE TABLE `rfid` (
  `id` int(11) NOT NULL,
  `rfid_number` longtext NOT NULL,
  `points` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `date_created` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfid`
--

INSERT INTO `rfid` (`id`, `rfid_number`, `points`, `status`, `date_created`) VALUES
(1, '33a537c2', 10, 'Active', '2023-11-01'),
(2, '737832c2', 10, 'Active', '2023-11-01'),
(3, 'e3153ec2', 10, 'Active', '2023-11-01'),
(4, '9305e8be', 10, 'Active', '2023-11-03'),
(5, '633bfec1', 10, 'Active', '2023-11-03'),
(6, 'c3c9101e', 10, 'Active', '2023-11-03'),
(7, '837f43c2', 10, 'Active', '2023-11-03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Jasper Macaraeg', 'jasper.macaraeg42@gmail.com', '$2b$10$wmhcVSmM.8JYktxdxOzKj.jFvxLuGCNMLqj9AKNC9Kjrprqako/W2', 'admin'),
(2, 'Andriel Gabriel Geomer', 'AndrielGeomergabriel07@gmail.com', '$2b$10$wmhcVSmM.8JYktxdxOzKj.jFvxLuGCNMLqj9AKNC9Kjrprqako/W2', 'admin'),
(3, 'John Kenneth Adriano', 'jkadriano2002@gmail.com', '$2b$10$wmhcVSmM.8JYktxdxOzKj.jFvxLuGCNMLqj9AKNC9Kjrprqako/W2', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `charging_station`
--
ALTER TABLE `charging_station`
  ADD PRIMARY KEY (`station_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfid`
--
ALTER TABLE `rfid`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `charging_station`
--
ALTER TABLE `charging_station`
  MODIFY `station_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rfid`
--
ALTER TABLE `rfid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
