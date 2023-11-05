-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2023 at 03:55 AM
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
(1, '33a537c2', 300, 'active', '2023-11-01'),
(2, '737832c2', 300, 'active', '2023-11-01'),
(3, 'e3153ec2', 500, 'inactive', '2023-11-01'),
(4, '9305e8be', 1000, 'active', '2023-11-03'),
(5, '633bfec1', 500, 'active', '2023-11-03'),
(6, 'c3c9101e', 50, 'active', '2023-11-03'),
(7, '837f43c2', 50, 'active', '2023-11-03');

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
(2, 'Revendo Admin', 'revendo@gmail.com', '$2b$10$wmhcVSmM.8JYktxdxOzKj.jFvxLuGCNMLqj9AKNC9Kjrprqako/W2', 'admin'),
(3, 'John Kenneth Adriano', 'johnkenneth@gmail.com', '$2b$10$C0LJwq6IsTanbGcChAcfdO7Xj1ET0hUgLxnj5/sNCjcQnwxL2yU7u', 'staff');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `rfid`
--
ALTER TABLE `rfid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
