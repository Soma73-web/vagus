const { Event } = require("../models");
const path = require("path");
const fs = require("fs");
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

// File validation
const validateImageFile = (file) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimes.includes(file.mimetype)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }

  return true;
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isActive: true },
      order: [
        ["displayOrder", "ASC"],
        ["created_at", "DESC"],
      ],
      attributes: [
        "id",
        "title",
        "description",
        "imageUrl",
        "displayOrder",
        "isActive",
        "created_at",
      ],
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
    const { description, title, eventDate, category } = req.body;
    const addedBy = req.admin?.username || "admin";

    // Validate required file upload
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    try {
      validateImageFile(req.file);
    } catch (fileError) {
      // Clean up uploaded file if validation fails
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: fileError.message });
    }

    // Sanitize inputs
    const sanitizedData = {
      title: title ? sanitizeInput(title) : "Event Image",
      description: description ? sanitizeInput(description) : null,
    };

    const imagePath = req.file.path;
    const imageUrl = `/uploads/events/${req.file.filename}`;

    // Get the next display order
    const maxOrder = (await Event.max("displayOrder")) || 0;

    const event = await Event.create({
      title: sanitizedData.title,
      description: sanitizedData.description,
      imageUrl,
      imagePath,
      displayOrder: maxOrder + 1,
      addedBy,
      isActive: true,
    });

    res.status(201).json({
      message: "Event image uploaded successfully",
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        displayOrder: event.displayOrder,
        addedBy: event.addedBy,
        isActive: event.isActive,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Failed to create event" });
  }
};

// Update event (admin only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, title, eventDate, category } = req.body;

    // Validate event exists
    const existingEvent = await Event.findByPk(id);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Input validation
    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Description is required" });
    }

    // Sanitize inputs
    let updateData = {
      description: sanitizeInput(description),
    };

    if (title) updateData.title = sanitizeInput(title);
    if (category) updateData.category = sanitizeInput(category);
    if (eventDate) {
      const parsedDate = new Date(eventDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid event date" });
      }
      updateData.eventDate = parsedDate;
    }

    // Handle file upload with validation
    if (req.file) {
      try {
        validateImageFile(req.file);

        // Delete old image if exists
        if (existingEvent.imagePath && fs.existsSync(existingEvent.imagePath)) {
          fs.unlinkSync(existingEvent.imagePath);
        }

        updateData.imagePath = req.file.path;
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      } catch (fileError) {
        // Clean up uploaded file if validation fails
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: fileError.message });
      }
    }

    await Event.update(updateData, { where: { id } });

    const updatedEvent = await Event.findByPk(id, {
      attributes: { exclude: ["imagePath"] },
    });

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete event (admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Soft delete - set isActive to false
    await Event.update({ isActive: false }, { where: { id } });

    res.json({
      message: "Event deleted successfully",
      deletedEvent: {
        id: event.id,
        title: event.title,
        description: event.description,
      },
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Permanently delete event (admin only)
const permanentDeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete associated image file
    if (event.imagePath && fs.existsSync(event.imagePath)) {
      fs.unlinkSync(event.imagePath);
    }

    // Permanently delete from database
    await Event.destroy({ where: { id } });

    res.json({
      message: "Event permanently deleted",
      deletedEvent: {
        id: event.id,
        title: event.title,
        description: event.description,
      },
    });
  } catch (error) {
    console.error("Permanent delete event error:", error);
    res.status(500).json({ error: "Failed to permanently delete event" });
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
  permanentDeleteEvent,
  getEventImage,
};
