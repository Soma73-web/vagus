const db = require('../models');
const Lead = db.Lead;
const LeadPopupConfig = db.sequelize.LeadPopupConfig;

// POST /api/leads - Create a new lead
exports.createLead = async (req, res) => {
  try {
    // Check if popup is enabled
    const config = await LeadPopupConfig.findOne({ where: { id: 1 } });
    if (config && config.enabled === false) {
      return res.status(403).json({ error: 'Lead popup is currently disabled.' });
    }
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
    }
    const lead = await Lead.create({ name, phone });
    res.status(201).json({ message: 'Lead submitted successfully', lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Server error while creating lead.' });
  }
};

// GET /api/leads - List all leads (admin only)
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Server error while fetching leads.' });
  }
};

// GET /api/leads/popup-config - Get popup enabled/disabled state
exports.getPopupConfig = async (req, res) => {
  try {
    let config = await LeadPopupConfig.findOne({ where: { id: 1 } });
    if (!config) {
      config = await LeadPopupConfig.create({ id: 1, enabled: true });
    }
    res.json({ enabled: config.enabled });
  } catch (error) {
    console.error('Error fetching popup config:', error);
    res.status(500).json({ error: 'Server error while fetching popup config.' });
  }
};

// POST /api/leads/popup-config - Set popup enabled/disabled state (admin only)
exports.setPopupConfig = async (req, res) => {
  try {
    const { enabled } = req.body;
    let config = await LeadPopupConfig.findOne({ where: { id: 1 } });
    if (!config) {
      config = await LeadPopupConfig.create({ id: 1, enabled: !!enabled });
    } else {
      config.enabled = !!enabled;
      await config.save();
    }
    res.json({ enabled: config.enabled });
  } catch (error) {
    console.error('Error updating popup config:', error);
    res.status(500).json({ error: 'Server error while updating popup config.' });
  }
}; 