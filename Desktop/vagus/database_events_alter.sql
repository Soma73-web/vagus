-- SQL ALTER commands for Events table to support simplified event management

-- 1. Make title optional with default value
ALTER TABLE `events` 
MODIFY COLUMN `title` varchar(255) DEFAULT 'Event';

-- 2. Make eventDate optional with default to current timestamp
ALTER TABLE `events` 
MODIFY COLUMN `eventDate` datetime DEFAULT CURRENT_TIMESTAMP;

-- 3. Make imageUrl optional (since we now support file uploads)
ALTER TABLE `events` 
MODIFY COLUMN `imageUrl` varchar(255) DEFAULT NULL;

-- 4. Add imagePath column for storing uploaded file paths
ALTER TABLE `events` 
ADD COLUMN `imagePath` varchar(500) DEFAULT NULL AFTER `imageUrl`;

-- 5. Make category optional with default value
ALTER TABLE `events` 
MODIFY COLUMN `category` varchar(100) DEFAULT 'general';

-- 6. Make addedBy optional with default value
ALTER TABLE `events` 
MODIFY COLUMN `addedBy` varchar(100) DEFAULT 'admin';

-- 7. Create index on imagePath for better performance
CREATE INDEX `idx_events_image_path` ON `events` (`imagePath`);

-- 8. Create index on isActive for filtering
CREATE INDEX `idx_events_active` ON `events` (`isActive`);

-- 9. Update existing records to have default values (optional)
UPDATE `events` SET 
    `title` = 'Event' 
WHERE `title` IS NULL OR `title` = '';

UPDATE `events` SET 
    `category` = 'general' 
WHERE `category` IS NULL OR `category` = '';

UPDATE `events` SET 
    `addedBy` = 'admin' 
WHERE `addedBy` IS NULL OR `addedBy` = '';

-- 10. Create uploads directory structure (run these commands on your server)
-- mkdir -p uploads/events
-- chmod 755 uploads/events

-- 11. Sample data insert with new structure
INSERT INTO `events` (`description`, `category`, `isActive`) VALUES
('Welcome to our annual sports day! Join us for exciting competitions and activities.', 'sports', 1),
('Academic excellence workshop for NEET aspirants. Limited seats available.', 'academic', 1),
('Cultural fest celebrating diverse talents of our students.', 'cultural', 1);

-- 12. Query to get all active events (for reference)
-- SELECT id, title, description, eventDate, imageUrl, imagePath, category, isActive, createdAt 
-- FROM events 
-- WHERE isActive = 1 
-- ORDER BY createdAt DESC;

-- 13. Query to get events with images (for frontend)
-- SELECT id, title, description, eventDate, 
--        CASE 
--            WHEN imagePath IS NOT NULL THEN CONCAT('/api/events/image/', id)
--            WHEN imageUrl IS NOT NULL THEN imageUrl
--            ELSE NULL 
--        END as displayImageUrl,
--        category, createdAt
-- FROM events 
-- WHERE isActive = 1 
-- ORDER BY createdAt DESC;

-- 14. Clean up query (if needed to remove test data)
-- DELETE FROM events WHERE description LIKE '%test%' OR title LIKE '%test%';

-- 15. Backup query before making changes (recommended)
-- CREATE TABLE events_backup AS SELECT * FROM events;
