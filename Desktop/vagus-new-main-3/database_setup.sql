-- Database Setup for Student Management System
-- Run these queries in your MySQL database

-- Create Students table
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `enrollmentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `course` varchar(255) NOT NULL,
  `batch` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `studentId` (`studentId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Attendance table
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') NOT NULL,
  `reason` text,
  `markedBy` varchar(255) NOT NULL COMMENT 'Admin who marked the attendance',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_date` (`studentId`,`date`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Test Results table
CREATE TABLE `test_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `testNumber` int NOT NULL,
  `testName` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `maxMarks` int NOT NULL,
  `obtainedMarks` int NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `testDate` datetime NOT NULL,
  `remarks` text,
  `addedBy` varchar(255) NOT NULL COMMENT 'Admin who added the result',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `student_test` (`studentId`,`testNumber`),
  CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Events table
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `eventDate` datetime NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'general',
  `isActive` tinyint(1) DEFAULT '1',
  `addedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample student data
INSERT INTO `students` (`studentId`, `firstName`, `lastName`, `email`, `password`, `phone`, `dateOfBirth`, `course`, `batch`) VALUES
('STU001', 'Rahul', 'Sharma', 'rahul.sharma@example.com', '$2a$10$xyzabcdefghijklmnopqrstuvwxyz123456789', '9876543210', '2005-03-15', 'NEET Preparation', '2024-25'),
('STU002', 'Priya', 'Patel', 'priya.patel@example.com', '$2a$10$xyzabcdefghijklmnopqrstuvwxyz123456789', '9876543211', '2005-07-22', 'NEET Preparation', '2024-25'),
('STU003', 'Amit', 'Kumar', 'amit.kumar@example.com', '$2a$10$xyzabcdefghijklmnopqrstuvwxyz123456789', '9876543212', '2005-01-10', 'JEE Preparation', '2024-25');

-- Insert sample attendance data
INSERT INTO `attendance` (`studentId`, `date`, `status`, `reason`, `markedBy`) VALUES
(1, '2024-01-15', 'present', NULL, 'admin'),
(1, '2024-01-16', 'absent', 'Medical appointment', 'admin'),
(1, '2024-01-17', 'present', NULL, 'admin'),
(2, '2024-01-15', 'present', NULL, 'admin'),
(2, '2024-01-16', 'present', NULL, 'admin'),
(2, '2024-01-17', 'late', 'Traffic jam', 'admin'),
(3, '2024-01-15', 'present', NULL, 'admin'),
(3, '2024-01-16', 'present', NULL, 'admin'),
(3, '2024-01-17', 'present', NULL, 'admin');

-- Insert sample test results
INSERT INTO `test_results` (`studentId`, `testNumber`, `testName`, `subject`, `maxMarks`, `obtainedMarks`, `percentage`, `grade`, `testDate`, `remarks`, `addedBy`) VALUES
(1, 1, 'Unit Test 1', 'Physics', 100, 85, 85.00, 'A', '2024-01-20 10:00:00', 'Good performance', 'admin'),
(1, 1, 'Unit Test 1', 'Chemistry', 100, 78, 78.00, 'B+', '2024-01-21 10:00:00', 'Can improve', 'admin'),
(1, 1, 'Unit Test 1', 'Biology', 100, 92, 92.00, 'A+', '2024-01-22 10:00:00', 'Excellent', 'admin'),
(2, 1, 'Unit Test 1', 'Physics', 100, 88, 88.00, 'A', '2024-01-20 10:00:00', 'Very good', 'admin'),
(2, 1, 'Unit Test 1', 'Chemistry', 100, 82, 82.00, 'A', '2024-01-21 10:00:00', 'Good understanding', 'admin'),
(2, 1, 'Unit Test 1', 'Biology', 100, 90, 90.00, 'A+', '2024-01-22 10:00:00', 'Outstanding', 'admin'),
(3, 1, 'Unit Test 1', 'Physics', 100, 76, 76.00, 'B+', '2024-01-20 10:00:00', 'Good effort', 'admin'),
(3, 1, 'Unit Test 1', 'Mathematics', 100, 95, 95.00, 'A+', '2024-01-21 10:00:00', 'Exceptional', 'admin');

-- Insert sample events
INSERT INTO `events` (`title`, `description`, `eventDate`, `imageUrl`, `category`, `addedBy`) VALUES
('Science Exhibition 2024', 'Annual science exhibition showcasing student projects and innovations in various fields of science.', '2024-02-15 09:00:00', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'Academic', 'admin'),
('NEET Mock Test Series', 'Comprehensive mock test series to prepare students for the NEET examination with detailed analysis.', '2024-02-20 10:00:00', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500', 'Examination', 'admin'),
('Cultural Fest 2024', 'Annual cultural festival celebrating diversity and talent with various competitions and performances.', '2024-03-01 16:00:00', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500', 'Cultural', 'admin'),
('Parent-Teacher Meeting', 'Quarterly meeting to discuss student progress and academic development with parents.', '2024-02-25 14:00:00', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500', 'Meeting', 'admin');

-- Additional indexes for better performance
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_test_results_date ON test_results(testDate);
CREATE INDEX idx_events_date ON events(eventDate);
CREATE INDEX idx_students_course_batch ON students(course, batch);

-- Views for quick analytics (optional)
CREATE VIEW student_attendance_summary AS
SELECT 
    s.id,
    s.studentId,
    s.firstName,
    s.lastName,
    s.course,
    s.batch,
    COUNT(a.id) as total_days,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_days,
    SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_days,
    ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 WHEN a.status = 'late' THEN 0.5 ELSE 0 END) / COUNT(a.id)) * 100, 2) as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.studentId
WHERE s.isActive = 1
GROUP BY s.id, s.studentId, s.firstName, s.lastName, s.course, s.batch;

CREATE VIEW student_test_summary AS
SELECT 
    s.id,
    s.studentId,
    s.firstName,
    s.lastName,
    s.course,
    s.batch,
    COUNT(tr.id) as total_tests,
    ROUND(AVG(tr.percentage), 2) as average_percentage,
    MAX(tr.percentage) as highest_percentage,
    MIN(tr.percentage) as lowest_percentage
FROM students s
LEFT JOIN test_results tr ON s.id = tr.studentId
WHERE s.isActive = 1
GROUP BY s.id, s.studentId, s.firstName, s.lastName, s.course, s.batch;

-- Note: Remember to update your .env file with database credentials
-- Example .env variables needed:
-- DB_NAME=your_database_name
-- DB_USER=your_database_user
-- DB_PASSWORD=your_database_password
-- DB_HOST=your_database_host
-- DB_PORT=3306
-- JWT_SECRET=your_jwt_secret_key

-- Password for sample students is 'password123' (you should hash it properly)
-- Use bcrypt to hash passwords before inserting real data
