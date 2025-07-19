const { Event } = require("../models");
const path = require("path");
const fs = require("fs");

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isActive: true },
      order: [["eventDate", "DESC"]],
    });

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Create event (admin only)
const createEvent = async (req, res) => {
  try {
    const { description } = req.body;
    const addedBy = req.admin?.username || "admin";

    let imagePath = null;
    let imageUrl = null;

    // Handle file upload
    if (req.file) {
      imagePath = req.file.path;
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title: "Event",
      description: description || "",
      eventDate: new Date(),
      imageUrl,
      imagePath,
      category: "general",
      addedBy,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Update event (admin only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    let updateData = { description };

    // Handle file upload
    if (req.file) {
      updateData.imagePath = req.file.path;
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await Event.update(updateData, { where: { id } });

    const updatedEvent = await Event.findByPk(id);

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete event (admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.update({ isActive: false }, { where: { id } });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Serve event image
const getEventImage = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event || !event.imagePath) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = path.resolve(event.imagePath);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Image file not found" });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error("Get event image error:", error);
    res.status(500).json({ error: "Failed to get image" });
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventImage,
};
