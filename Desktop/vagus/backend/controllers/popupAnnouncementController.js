const { PopupAnnouncement } = require("../models");
const { Op } = require("sequelize");

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>"'&]/g, (match) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "&": "&amp;",
    };
    return entities[match];
  });
};

// Get active popup for homepage
const getActivePopup = async (req, res) => {
  try {
    const now = new Date();

    const popup = await PopupAnnouncement.findOne({
      where: {
        isEnabled: true,
        showOnHomepage: true,
        [Op.or]: [{ startDate: null }, { startDate: { [Op.lte]: now } }],
        [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: now } }],
      },
      order: [["created_at", "DESC"]],
      attributes: [
        "id",
        "title",
        "description",
        "imageUrl",
        "announcementType",
      ],
    });

    if (popup) {
      res.json(popup);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error("Get active popup error:", error);
    res.status(500).json({ error: "Failed to fetch popup" });
  }
};

// Get all popups (admin only)
const getAllPopups = async (req, res) => {
  try {
    const popups = await PopupAnnouncement.findAll({
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["createdBy"] },
    });

    res.json(popups);
  } catch (error) {
    console.error("Get popups error:", error);
    res.status(500).json({ error: "Failed to fetch popups" });
  }
};

// Create popup announcement (admin only)
const createPopup = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      announcementType,
      startDate,
      endDate,
      isEnabled,
      showOnHomepage,
    } = req.body;

    const createdBy = req.admin?.username || "admin";

    // Validate required fields
    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        error: "Title, description, and image URL are required",
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      imageUrl: sanitizeInput(imageUrl),
      announcementType: announcementType || "general",
      isEnabled: isEnabled === true || isEnabled === "true",
      showOnHomepage: showOnHomepage === true || showOnHomepage === "true",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    // Validate dates
    if (sanitizedData.startDate && sanitizedData.endDate) {
      if (sanitizedData.startDate >= sanitizedData.endDate) {
        return res.status(400).json({
          error: "End date must be after start date",
        });
      }
    }

    // If this popup is being enabled, disable all other active popups
    if (sanitizedData.isEnabled) {
      await PopupAnnouncement.update(
        { isEnabled: false },
        { where: { isEnabled: true } },
      );
    }

    const popup = await PopupAnnouncement.create({
      title: sanitizedData.title,
      description: sanitizedData.description,
      imageUrl: sanitizedData.imageUrl,
      announcementType: sanitizedData.announcementType,
      isEnabled: sanitizedData.isEnabled,
      showOnHomepage: sanitizedData.showOnHomepage,
      startDate: sanitizedData.startDate,
      endDate: sanitizedData.endDate,
      createdBy,
    });

    res.status(201).json({
      message: "Popup announcement created successfully",
      popup: {
        id: popup.id,
        title: popup.title,
        description: popup.description,
        imageUrl: popup.imageUrl,
        announcementType: popup.announcementType,
        isEnabled: popup.isEnabled,
        showOnHomepage: popup.showOnHomepage,
        startDate: popup.startDate,
        endDate: popup.endDate,
      },
    });
  } catch (error) {
    console.error("Create popup error:", error);
    res.status(500).json({ error: "Failed to create popup announcement" });
  }
};

// Update popup announcement (admin only)
const updatePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      imageUrl,
      announcementType,
      startDate,
      endDate,
      isEnabled,
      showOnHomepage,
    } = req.body;

    // Validate popup exists
    const popup = await PopupAnnouncement.findByPk(id);
    if (!popup) {
      return res.status(404).json({ error: "Popup announcement not found" });
    }

    // Sanitize inputs
    const updateData = {};
    if (title) updateData.title = sanitizeInput(title);
    if (description) updateData.description = sanitizeInput(description);
    if (imageUrl) updateData.imageUrl = sanitizeInput(imageUrl);
    if (announcementType) updateData.announcementType = announcementType;
    if (typeof isEnabled !== "undefined")
      updateData.isEnabled = isEnabled === true || isEnabled === "true";
    if (typeof showOnHomepage !== "undefined")
      updateData.showOnHomepage =
        showOnHomepage === true || showOnHomepage === "true";
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    // Validate dates
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        return res.status(400).json({
          error: "End date must be after start date",
        });
      }
    }

    // If this popup is being enabled, disable all other active popups
    if (updateData.isEnabled === true) {
      await PopupAnnouncement.update(
        { isEnabled: false },
        { where: { isEnabled: true, id: { [Op.ne]: id } } },
      );
    }

    await PopupAnnouncement.update(updateData, { where: { id } });

    const updatedPopup = await PopupAnnouncement.findByPk(id, {
      attributes: { exclude: ["createdBy"] },
    });

    res.json({
      message: "Popup announcement updated successfully",
      popup: updatedPopup,
    });
  } catch (error) {
    console.error("Update popup error:", error);
    res.status(500).json({ error: "Failed to update popup announcement" });
  }
};

// Delete popup announcement (admin only)
const deletePopup = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate popup exists
    const popup = await PopupAnnouncement.findByPk(id);
    if (!popup) {
      return res.status(404).json({ error: "Popup announcement not found" });
    }

    await PopupAnnouncement.destroy({ where: { id } });

    res.json({
      message: "Popup announcement deleted successfully",
      deletedPopup: {
        id: popup.id,
        title: popup.title,
      },
    });
  } catch (error) {
    console.error("Delete popup error:", error);
    res.status(500).json({ error: "Failed to delete popup announcement" });
  }
};

// Toggle popup status (admin only)
const togglePopupStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate popup exists
    const popup = await PopupAnnouncement.findByPk(id);
    if (!popup) {
      return res.status(404).json({ error: "Popup announcement not found" });
    }

    const newStatus = !popup.isEnabled;

    // If enabling this popup, disable all others
    if (newStatus) {
      await PopupAnnouncement.update(
        { isEnabled: false },
        { where: { isEnabled: true, id: { [Op.ne]: id } } },
      );
    }

    await PopupAnnouncement.update({ isEnabled: newStatus }, { where: { id } });

    res.json({
      message: `Popup announcement ${newStatus ? "enabled" : "disabled"} successfully`,
      popup: {
        id: popup.id,
        title: popup.title,
        isEnabled: newStatus,
      },
    });
  } catch (error) {
    console.error("Toggle popup status error:", error);
    res.status(500).json({ error: "Failed to toggle popup status" });
  }
};

module.exports = {
  getActivePopup,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
  togglePopupStatus,
};
