-- Popup table for managing website popups
CREATE TABLE IF NOT EXISTS popups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'NEET Success Workshop: From Preparation to Achievement',
  speaker VARCHAR(255) NOT NULL DEFAULT 'Dr. Sarah Johnson',
  affiliation VARCHAR(255) NOT NULL DEFAULT 'Senior Medical Officer, AIIMS Delhi',
  description TEXT,
  imageData LONGBLOB,
  imageMimeType VARCHAR(100),
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  displayDelay INT NOT NULL DEFAULT 5,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert a sample popup
INSERT INTO popups (title, speaker, affiliation, description, isActive, displayDelay) VALUES (
  'NEET Success Workshop: From Preparation to Achievement',
  'Dr. Sarah Johnson',
  'Senior Medical Officer, AIIMS Delhi',
  'Join our comprehensive workshop where Dr. Sarah Johnson will share her journey from NEET preparation to becoming a successful medical professional. Learn proven strategies, study techniques, and get insights into the medical field.',
  TRUE,
  5
); 