const { sequelize } = require('../config/db');

async function migrateEventsTable() {
  try {
    console.log('🔄 Starting events table migration...');
    
    // 1. Change imageUrl column type to TEXT to store large base64 data
    console.log('📝 Updating imageUrl column type to TEXT...');
    await sequelize.query(`
      ALTER TABLE events 
      MODIFY COLUMN image_url TEXT NOT NULL
    `);
    console.log('✅ imageUrl column updated to TEXT');
    
    // 2. Remove imagePath column if it exists
    console.log('🗑️ Removing imagePath column...');
    try {
      await sequelize.query(`
        ALTER TABLE events 
        DROP COLUMN imagePath
      `);
      console.log('✅ imagePath column removed');
    } catch (error) {
      if (error.message.includes('doesn\'t exist')) {
        console.log('ℹ️ imagePath column doesn\'t exist, skipping...');
      } else {
        throw error;
      }
    }
    
    // 3. Add index on imageUrl for better performance
    console.log('📊 Adding index on imageUrl...');
    try {
      await sequelize.query(`
        CREATE INDEX idx_events_image_url ON events (image_url(100))
      `);
      console.log('✅ Index added on imageUrl');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('ℹ️ Index already exists, skipping...');
      } else {
        throw error;
      }
    }
    
    console.log('🎉 Events table migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migrateEventsTable()
    .then(() => {
      console.log('🏁 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = migrateEventsTable; 