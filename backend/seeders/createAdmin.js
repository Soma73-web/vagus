const db = require("../models");
const Admin = db.Admin;
require("dotenv").config();

const createInitialAdmin = async () => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return;
    }

    // Create initial admin
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
      console.error('Missing required admin environment variables. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME.');
      process.exit(1);
    }
    const adminData = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME,
    };

    const admin = await Admin.create(adminData);

    console.log("✅ Initial admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", adminData.password);
    console.log("");
    console.log(
      "⚠️  IMPORTANT: Please change the default password after first login!",
    );
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    process.exit();
  }
};

createInitialAdmin();
