-- SQL queries for Study Materials feature

-- 1. Create the study_materials table
CREATE TABLE `study_materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` enum('Biology','Chemistry','Physics','Mathematics') NOT NULL,
  `topic` varchar(255) NOT NULL,
  `videoUrl` text NOT NULL,
  `description` text DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `orderIndex` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `addedBy` varchar(100) DEFAULT 'admin',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subject_order` (`subject`, `orderIndex`),
  KEY `idx_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Insert sample data for Biology
INSERT INTO `study_materials` (`subject`, `topic`, `videoUrl`, `description`, `duration`, `orderIndex`) VALUES
('Biology', 'Cell Structure and Function', 'https://www.youtube.com/embed/URUJD5NEXC8', 'Introduction to basic cell structure and organelles', '12:45', 1),
('Biology', 'Photosynthesis Process', 'https://www.youtube.com/embed/g78utcLQrJ4', 'Understanding how plants convert light energy to chemical energy', '15:20', 2),
('Biology', 'DNA Structure and Replication', 'https://www.youtube.com/embed/TNKWgcFPHqw', 'Learn about DNA double helix and replication process', '18:30', 3);

-- 3. Insert sample data for Chemistry
INSERT INTO `study_materials` (`subject`, `topic`, `videoUrl`, `description`, `duration`, `orderIndex`) VALUES
('Chemistry', 'Atomic Structure', 'https://www.youtube.com/embed/pO0X6fVre1I', 'Basic atomic structure and electron configuration', '14:15', 1),
('Chemistry', 'Chemical Bonding', 'https://www.youtube.com/embed/QqjcCvzWwww', 'Ionic and covalent bonding explained', '16:45', 2),
('Chemistry', 'Periodic Table Trends', 'https://www.youtube.com/embed/0RRVV4Diomg', 'Understanding periodic properties and trends', '13:20', 3);

-- 4. Insert sample data for Physics
INSERT INTO `study_materials` (`subject`, `topic`, `videoUrl`, `description`, `duration`, `orderIndex`) VALUES
('Physics', 'Newton\'s Laws of Motion', 'https://www.youtube.com/embed/kKKM8Y-u7ds', 'Three fundamental laws of motion explained', '17:30', 1),
('Physics', 'Wave Properties', 'https://www.youtube.com/embed/Io-HXZTepH4', 'Understanding wave characteristics and behavior', '19:15', 2),
('Physics', 'Electric Circuits', 'https://www.youtube.com/embed/VQdPaXoYcak', 'Basic electrical circuits and Ohm\'s law', '21:10', 3);

-- 5. Insert sample data for Mathematics
INSERT INTO `study_materials` (`subject`, `topic`, `videoUrl`, `description`, `duration`, `orderIndex`) VALUES
('Mathematics', 'Quadratic Equations', 'https://www.youtube.com/embed/i7idZfS8t8w', 'Solving quadratic equations using different methods', '22:45', 1),
('Mathematics', 'Trigonometry Basics', 'https://www.youtube.com/embed/yBw67Fb31Cs', 'Introduction to trigonometric ratios and functions', '18:20', 2),
('Mathematics', 'Calculus - Derivatives', 'https://www.youtube.com/embed/9vKqVkMQHKk', 'Basic concepts of differentiation', '25:30', 3);

-- 6. Query to get all study materials by subject
-- SELECT * FROM study_materials WHERE subject = 'Biology' AND isActive = 1 ORDER BY orderIndex ASC, createdAt ASC;

-- 7. Query to get count of materials by subject
-- SELECT subject, COUNT(*) as count FROM study_materials WHERE isActive = 1 GROUP BY subject;

-- 8. Query to get all active study materials for admin
-- SELECT * FROM study_materials WHERE isActive = 1 ORDER BY subject ASC, orderIndex ASC, createdAt ASC;

-- 9. Query to update a study material
-- UPDATE study_materials SET topic = ?, videoUrl = ?, description = ?, duration = ?, orderIndex = ? WHERE id = ?;

-- 10. Query to soft delete a study material
-- UPDATE study_materials SET isActive = 0 WHERE id = ?;

-- 11. Query to get subjects with material count (for student dashboard)
/*
SELECT 
    'Biology' as subject, 
    (SELECT COUNT(*) FROM study_materials WHERE subject = 'Biology' AND isActive = 1) as count
UNION ALL
SELECT 
    'Chemistry' as subject, 
    (SELECT COUNT(*) FROM study_materials WHERE subject = 'Chemistry' AND isActive = 1) as count
UNION ALL
SELECT 
    'Physics' as subject, 
    (SELECT COUNT(*) FROM study_materials WHERE subject = 'Physics' AND isActive = 1) as count
UNION ALL
SELECT 
    'Mathematics' as subject, 
    (SELECT COUNT(*) FROM study_materials WHERE subject = 'Mathematics' AND isActive = 1) as count;
*/

-- 12. Index optimization queries
-- CREATE INDEX idx_subject_active ON study_materials(subject, isActive);
-- CREATE INDEX idx_order_created ON study_materials(orderIndex, createdAt);

-- 13. Clean up query (if needed to remove test data)
-- DELETE FROM study_materials WHERE addedBy = 'admin' AND createdAt > '2024-01-01';
