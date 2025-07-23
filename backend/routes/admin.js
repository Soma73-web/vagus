const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../models");
const Admin = db.Admin;
const authMiddleware = require("../middleware/authMiddleware");
const analyticsController = require('../controllers/analyticsController');
require("dotenv").config();
const fetch = require('node-fetch');

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email, isActive: true } });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await admin.checkPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last activity
    await admin.updateActivity();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/verify
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      valid: true,
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Token verification failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
});

// POST /api/auth/create-admin (for initial setup)
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if any admin exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ error: "Admin already exists" });
    }

    const admin = await Admin.create({
      email,
      password,
      name: name || "Admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

// Analytics summary for admin
router.get('/analytics/summary', analyticsController.getSummary);
// Analytics trends for admin
router.get('/analytics/trends', analyticsController.getTrends);

// Proxy Perplexity API endpoint
router.post('/ai/perplexity', async (req, res) => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Perplexity proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Perplexity API' });
  }
});

module.exports = router;
