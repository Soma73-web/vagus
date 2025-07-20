const db = require('../models');
const Popup = db.Popup;

exports.getAllPopups = async (req, res) => {
  try {
    const popups = await Popup.findAll();
    res.json(popups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPopup = async (req, res) => {
  try {
    const { title, message, isActive } = req.body;
    const popup = await Popup.create({ title, message, isActive });
    res.status(201).json(popup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, isActive } = req.body;
    const popup = await Popup.findByPk(id);
    if (!popup) return res.status(404).json({ error: 'Popup not found' });
    await popup.update({ title, message, isActive });
    res.json(popup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findByPk(id);
    if (!popup) return res.status(404).json({ error: 'Popup not found' });
    await popup.destroy();
    res.json({ message: 'Popup deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 