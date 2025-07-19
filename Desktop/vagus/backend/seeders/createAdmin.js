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
    const adminData = {
      email: process.env.ADMIN_EMAIL || "admin@neetacademy.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      name: process.env.ADMIN_NAME || "NEET Academy Admin",
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
