-- Events table schema that matches the current Event model (with BLOB storage)
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT 'Event',
  `description` text,
  `eventDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `imageUrl` varchar(255) DEFAULT NULL,
  `imageData` longblob DEFAULT NULL,
  `imageMimeType` varchar(100) DEFAULT NULL,
  `category` varchar(255) DEFAULT 'general',
  `isActive` tinyint(1) DEFAULT '1',
  `addedBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for better performance
CREATE INDEX `idx_events_active` ON `events` (`isActive`);
CREATE INDEX `idx_events_date` ON `events` (`eventDate`);
CREATE INDEX `idx_events_category` ON `events` (`category`);

-- Insert sample events
INSERT INTO `events` (`title`, `description`, `eventDate`, `imageUrl`, `category`, `addedBy`) VALUES
('Science Exhibition 2024', 'Annual science exhibition showcasing student projects and innovations in various fields of science.', '2024-02-15 09:00:00', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'Academic', 'admin'),
('NEET Mock Test Series', 'Comprehensive mock test series to prepare students for the NEET examination with detailed analysis.', '2024-02-20 10:00:00', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500', 'Examination', 'admin'),
('Cultural Fest 2024', 'Annual cultural festival celebrating diversity and talent with various competitions and performances.', '2024-03-01 16:00:00', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500', 'Cultural', 'admin'),
('Parent-Teacher Meeting', 'Quarterly meeting to discuss student progress and academic development with parents.', '2024-02-25 14:00:00', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500', 'Meeting', 'admin'); 