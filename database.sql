-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2024 at 11:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agile_a1`
--

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_id`, `department_name`) VALUES
(1, 'Research & Development'),
(2, 'Health & Safety'),
(3, 'Finance');

-- --------------------------------------------------------

--
-- Table structure for table `job_role`
--

CREATE TABLE `job_role` (
  `job_role_id` int(11) NOT NULL,
  `job_role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_role`
--

INSERT INTO `job_role` (`job_role_id`, `job_role_name`) VALUES
(1, 'Junior Developer'),
(2, 'Senior Developer'),
(3, 'Junior Tester'),
(4, 'Senior Tester');

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `skill_id` int(11) NOT NULL,
  `skill_name` varchar(255) NOT NULL,
  `skill_category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill`
--

INSERT INTO `skill` (`skill_id`, `skill_name`, `skill_category_id`) VALUES
(1, 'Java', 1),
(2, 'Black Box Testing', 2),
(3, 'C++', 1),
(4, 'White Box Testing', 2),
(5, 'HTML', 2);

-- --------------------------------------------------------

--
-- Table structure for table `skill_category`
--

CREATE TABLE `skill_category` (
  `skill_category_id` int(11) NOT NULL,
  `skill_category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill_category`
--

INSERT INTO `skill_category` (`skill_category_id`, `skill_category_name`) VALUES
(1, 'Programming'),
(2, 'Testing'),
(4, 'Research');

-- --------------------------------------------------------

--
-- Table structure for table `skill_enrolment`
--

CREATE TABLE `skill_enrolment` (
  `skill_enrolment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `skill_strength_id` int(11) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `notes` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Zakir
-- Modifying table to add on cascade deletion
--

ALTER TABLE `skill_enrolment`
DROP FOREIGN KEY `skill_enrolment_ibfk_1`;

ALTER TABLE `skill_enrolment`
ADD CONSTRAINT `skill_enrolment_ibfk_1`
FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
ON DELETE CASCADE;

--
-- Dumping data for table `skill_enrolment`
--

INSERT INTO `skill_enrolment` (`skill_enrolment_id`, `user_id`, `skill_id`, `skill_strength_id`, `expiry_date`, `notes`) VALUES
(1, 1, 2, 1, '2024-06-27 14:31:59', 'Beginner Black Box Tester'),
(2, 2, 4, 1, '2024-06-27 14:32:58', 'Beginner White Box Tester'),
(3, 1, 3, 2, '2024-06-27 14:33:19', 'Intermediate C++ Programmer'),
(4, 1, 1, 1, '2024-07-19 00:00:00', 'Hello World!'),
(5, 1, 1, 1, '2024-07-19 00:00:00', 'Hello World!'),
(6, 1, 1, 1, '2024-07-19 00:00:00', 'Initial notes');

-- --------------------------------------------------------

--
-- Table structure for table `skill_strength`
--

CREATE TABLE `skill_strength` (
  `skill_strength_id` int(11) NOT NULL,
  `skill_strength_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill_strength`
--

INSERT INTO `skill_strength` (`skill_strength_id`, `skill_strength_name`) VALUES
(1, 'BEGINNER'),
(2, 'INTERMEDIATE'),
(3, 'COMPETENT');

-- --------------------------------------------------------

--
-- Table structure for table `system_role`
--

CREATE TABLE `system_role` (
  `system_role_id` int(11) NOT NULL,
  `system_role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_role`
--

INSERT INTO `system_role` (`system_role_id`, `system_role_name`) VALUES
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'STAFF');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `department_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `job_role_id` int(11) NOT NULL,
  `system_role_id` int(11) NOT NULL,
  `date_joined` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `department_id`, `email`, `password`, `job_role_id`, `system_role_id`, `date_joined`) VALUES
(1, 'John', 'Doe', 1, 'johndoe@staffs.com', '$2b$10$k1uOEqXf1Mg4alllj09nBu0EJ.8doXfqH4IhqE6ZDF30kWVnRlMmS', 1, 3, '2024-07-09'),
(2, 'Zak', 'Wilkinson', 2, 'zakwilkinson@staffs.com', '$2b$10$DMdbJF1pGshD5oRtkWKSYuEeXGdG/BdMlau.zYvPWGotCmE9kPyfO', 2, 2, '2024-06-20'),
(3, 'John', 'Dean', 2, 'johndean@staffs.com', '$2b$10$K7Wi1tECsOiTMpikHX1nPOESMQ9q2VAY.nnLElxOfz6umUmackBam', 3, 3, '2024-07-09'),
(17, 'Bob', 'Johnson', 1, 'bob.johnson1721235842040@example.com', '$2b$10$oWvvdAfaSOUbhtdt8aShaOZXMN.stg6ZCR3r6RTaDUJvhe.x1gHI2', 1, 1, '2024-07-17'),
(111, 'Test', 'User', 1, 'testuser@example.com', '$2b$10$BHaFYSP9ByAjMBlU5pjhke.XIGT2EVg98J2i2IO1xmYVipDN8KjCu', 1, 1, '2024-08-21'),
(112, 'Test', 'User', 1, 'testuser@example.com', '$2b$10$SARamqVDy35/c3pAWz7PeOF/2BhTPK4kQs8Ir2iaRn23M2dD06uvu', 1, 1, '2024-08-21'),
(113, 'User', 'ToDelete', 1, 'user.todelete1724266440978@example.com', '$2b$10$GotanAXmUjDylJtJAzFgy.4uhsopW4V5/QcYGNCWxxsWg0eA0g7ke', 1, 1, '2024-08-21'),
(114, 'User', 'ToDelete', 1, 'user.todelete1724266476209@example.com', '$2b$10$lYnl4MIPVjBU36IDqfXICO2.1fBbEbxcW2Bi4aJ/9zpmou/A6qJG.', 1, 1, '2024-08-21'),
(119, 'Test', 'User', 1, 'testuser@example.com', '$2b$10$T8EF54CUTVpSABfWPB4sReRurW9pCaP4xdwouie7duybvQ21BgZ/.', 1, 1, '2024-08-22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `job_role`
--
ALTER TABLE `job_role`
  ADD PRIMARY KEY (`job_role_id`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`skill_id`),
  ADD KEY `skill_category_id` (`skill_category_id`);

--
-- Indexes for table `skill_category`
--
ALTER TABLE `skill_category`
  ADD PRIMARY KEY (`skill_category_id`);

--
-- Indexes for table `skill_enrolment`
--
ALTER TABLE `skill_enrolment`
  ADD PRIMARY KEY (`skill_enrolment_id`),
  ADD KEY `user_id` (`user_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`),
  ADD KEY `skill_strength_id` (`skill_strength_id`);

--
-- Indexes for table `skill_strength`
--
ALTER TABLE `skill_strength`
  ADD PRIMARY KEY (`skill_strength_id`);

--
-- Indexes for table `system_role`
--
ALTER TABLE `system_role`
  ADD PRIMARY KEY (`system_role_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `departmentId` (`department_id`),
  ADD KEY `job_role_id` (`job_role_id`),
  ADD KEY `system_role_id` (`system_role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `job_role`
--
ALTER TABLE `job_role`
  MODIFY `job_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `skill_category`
--
ALTER TABLE `skill_category`
  MODIFY `skill_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `skill_enrolment`
--
ALTER TABLE `skill_enrolment`
  MODIFY `skill_enrolment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `skill_strength`
--
ALTER TABLE `skill_strength`
  MODIFY `skill_strength_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `system_role`
--
ALTER TABLE `system_role`
  MODIFY `system_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`skill_category_id`) REFERENCES `skill_category` (`skill_category_id`);

--
-- Constraints for table `skill_enrolment`
--
ALTER TABLE `skill_enrolment`
  ADD CONSTRAINT `skill_enrolment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `skill_enrolment_ibfk_3` FOREIGN KEY (`skill_strength_id`) REFERENCES `skill_strength` (`skill_strength_id`),
  ADD CONSTRAINT `skill_enrolment_ibfk_4` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`skill_id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`system_role_id`) REFERENCES `system_role` (`system_role_id`),
  ADD CONSTRAINT `user_ibfk_3` FOREIGN KEY (`job_role_id`) REFERENCES `job_role` (`job_role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
