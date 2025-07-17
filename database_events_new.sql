-- Drop existing events table
DROP TABLE IF EXISTS events;

-- Create new events table for image slider with auto-slide functionality
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) DEFAULT 'Event Image',
  description TEXT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  added_by VARCHAR(100) DEFAULT 'admin'
);

-- Create events upload directory table to track file uploads
CREATE TABLE event_uploads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_id INT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Create popup announcements table for admission/achievement popups
CREATE TABLE popup_announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL, -- Cloudinary URL
  announcement_type ENUM('admission', 'achievement', 'general') DEFAULT 'general',
  is_enabled BOOLEAN DEFAULT FALSE,
  show_on_homepage BOOLEAN DEFAULT TRUE,
  start_date DATE NULL,
  end_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(100) DEFAULT 'admin'
);

-- Insert sample data
INSERT INTO events (title, description, image_url, image_path, display_order) VALUES
('Welcome to NEET Academy', 'Join us for comprehensive NEET preparation', '/uploads/events/sample1.jpg', 'uploads/events/sample1.jpg', 1),
('Top Achievers 2024', 'Celebrating our students success in NEET 2024', '/uploads/events/sample2.jpg', 'uploads/events/sample2.jpg', 2);
