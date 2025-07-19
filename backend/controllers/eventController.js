const { Event } = require("../models");
const path = require("path");
const fs = require("fs");

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isActive: true },
      order: [["eventDate", "DESC"]],
      attributes: { exclude: ['imageData'] } // Exclude BLOB data from response
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

    let imageData = null;
    let imageMimeType = null;
    let imageUrl = null;

    // Handle file upload - store as BLOB
    if (req.file) {
      imageData = req.file.buffer;
      imageMimeType = req.file.mimetype;
      imageUrl = `/api/events/image/${Date.now()}`; // URL for serving the image
    }

    const event = await Event.create({
      title: "Event",
      description: description || "",
      eventDate: new Date(),
      imageUrl,
      imageData,
      imageMimeType,
      category: "general",
      addedBy,
    });

    res.status(201).json({
      message: "Event created successfully",
      event: {
        ...event.toJSON(),
        imageData: undefined // Don't send BLOB data in response
      },
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

    // Handle file upload - store as BLOB
    if (req.file) {
      updateData.imageData = req.file.buffer;
      updateData.imageMimeType = req.file.mimetype;
      updateData.imageUrl = `/api/events/image/${Date.now()}`;
    }

    await Event.update(updateData, { where: { id } });

    const updatedEvent = await Event.findByPk(id);

    res.json({
      message: "Event updated successfully",
      event: {
        ...updatedEvent.toJSON(),
        imageData: undefined // Don't send BLOB data in response
      },
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

// Serve event image from BLOB
const getEventImage = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event || !event.imageData) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', event.imageMimeType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Send the BLOB data
    res.send(event.imageData);
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
