const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

async function runMigration() {
  try {
    console.log('🔄 Starting migration...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Add instagram_link column
    await sequelize.query(`
      ALTER TABLE testimonials 
      ADD COLUMN instagram_link TEXT NULL 
      AFTER video_link
    `);
    
    console.log('✅ Instagram link column added successfully');
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Check if column already exists
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  Instagram link column already exists');
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

runMigration(); 