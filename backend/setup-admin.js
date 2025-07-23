const db = require("./models");
const Admin = db.Admin;
require("dotenv").config();

const setupAdmin = async () => {
  try {
    console.log("🔧 Setting up admin account...");
    console.log("Database:", process.env.DB_NAME);
    console.log("Host:", process.env.DB_HOST);
    
    // Test database connection
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    
    // Sync models (create tables if they don't exist)
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database tables synced!");
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log("ℹ️  Admin already exists:");
      console.log("   Email:", existingAdmin.email);
      console.log("   Name:", existingAdmin.name);
      return;
    }
    
    // Create admin account
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
      console.error('Missing required admin environment variables. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME.');
      process.exit(1);
    }
    const adminData = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME
    };
    
    const admin = await Admin.create(adminData);
    
    console.log("✅ Admin account created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", adminData.password);
    console.log("");
    console.log("⚠️  IMPORTANT: Change the password after first login!");
    console.log("");
    console.log("🌐 Access your admin panel at:");
    console.log("   http://74.176.208.152:3000/#/admin-login");
    
  } catch (error) {
    console.error("❌ Error setting up admin:", error.message);
    if (error.original) {
      console.error("Database error:", error.original.message);
    }
  } finally {
    process.exit();
  }
};

setupAdmin(); 