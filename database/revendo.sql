-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2024 at 12:40 PM
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
-- Table structure for table `battery`
--

CREATE TABLE `battery` (
  `id` int(11) NOT NULL,
  `percentage` float NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `battery`
--

INSERT INTO `battery` (`id`, `percentage`, `date`) VALUES
(1, 84.5, '2024-02-22 13:10:34');

-- --------------------------------------------------------

--
-- Table structure for table `charge_time`
--

CREATE TABLE `charge_time` (
  `id` int(11) NOT NULL,
  `minute` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `charge_time`
--

INSERT INTO `charge_time` (`id`, `minute`) VALUES
(1, 5);

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
-- Table structure for table `plastic_bottle_size_point`
--

CREATE TABLE `plastic_bottle_size_point` (
  `id` int(11) NOT NULL,
  `bottle_size` varchar(255) NOT NULL,
  `height_size` varchar(255) NOT NULL,
  `point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plastic_bottle_size_point`
--

INSERT INTO `plastic_bottle_size_point` (`id`, `bottle_size`, `height_size`, `point`) VALUES
(1, 'Small', '2-4', 1),
(2, 'Medium', '5-7', 2),
(3, 'Large', '8-9', 3);

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
(1, '33a537c2', 25, 'Active', '2024-02-22'),
(2, '737832c2', 10, 'Active', '2024-02-22'),
(3, 'e3153ec2', 10, 'Active', '2024-02-22'),
(4, '9305e8be', 16, 'Active', '2024-02-22'),
(5, '633bfec1', 6, 'Active', '2024-02-22'),
(6, 'c3c9101e', 10, 'Active', '2024-02-22'),
(7, '837f43c2', 10, 'Active', '2024-02-22');

-- --------------------------------------------------------

--
-- Table structure for table `storage`
--

CREATE TABLE `storage` (
  `id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date_recorded` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage`
--

INSERT INTO `storage` (`id`, `status`, `date_recorded`) VALUES
(1, 'Not Full', '2024-04-05 06:53:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `gender`, `password`, `role`) VALUES
(1, 'Jasper Macaraeg', 'jasper.macaraeg42@gmail.com', 'Male', '$2b$10$VJXl7KjElZ9wv8Vt0J4MA.NT6ogLt3BV9APPJ0V5yiw24cYlP5w3m', 'admin'),
(2, 'John Kenneth Adriano', 'jkadriano2002@gmail.com', 'Male', '$2b$10$/CTpzpuiD6KnFsk/zkpoQ.hjzp7ll4lD.ip1hst8KQufgd6hXLI5C', 'staff');

-- --------------------------------------------------------

--
-- Table structure for table `vendo`
--

CREATE TABLE `vendo` (
  `id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendo`
--

INSERT INTO `vendo` (`id`, `status`) VALUES
(1, 'off');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `battery`
--
ALTER TABLE `battery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `charge_time`
--
ALTER TABLE `charge_time`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `plastic_bottle_size_point`
--
ALTER TABLE `plastic_bottle_size_point`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfid`
--
ALTER TABLE `rfid`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendo`
--
ALTER TABLE `vendo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vendo`
--
ALTER TABLE `vendo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
