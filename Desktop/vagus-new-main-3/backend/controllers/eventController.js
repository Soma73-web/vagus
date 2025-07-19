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

// Get all events with base64 images from database
const getAllEvents = async (req, res) => {
  try {
    console.log('🔍 Fetching all events from database...');
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

    console.log(`📊 Found ${events.length} events in database`);

    // Process events - convert file-based images to base64 if needed
    const processedEvents = await Promise.all(events.map(async (event) => {
      const eventData = event.toJSON();
      console.log(`🖼️ Processing event ${eventData.id}: imageUrl type = ${eventData.imageUrl ? (eventData.imageUrl.startsWith('data:') ? 'base64' : 'url') : 'none'}`);
      
      // If imageUrl is not base64, try to convert from file
      if (eventData.imageUrl && !eventData.imageUrl.startsWith('data:')) {
        console.log(`⚠️ Event ${eventData.id} has non-base64 imageUrl: ${eventData.imageUrl.substring(0, 50)}...`);
        
        // Try to convert file path to base64
        try {
          // Check if it's a relative path and convert to absolute
          let filePath = eventData.imageUrl;
          if (filePath.startsWith('/uploads/')) {
            filePath = path.join(__dirname, '..', filePath.substring(1)); // Remove leading slash
          }
          
          if (fs.existsSync(filePath)) {
            console.log(`✅ Converting file to base64: ${filePath}`);
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');
            const mimeType = path.extname(filePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
            eventData.imageUrl = `data:${mimeType};base64,${base64Image}`;
            
            // Update the database record
            await Event.update(
              { imageUrl: eventData.imageUrl },
              { where: { id: eventData.id } }
            );
            
            console.log(`✅ Converted event ${eventData.id} to base64 (${base64Image.length} chars)`);
          } else {
            console.log(`❌ File not found: ${filePath}`);
            // Keep the original URL as fallback
          }
        } catch (err) {
          console.error(`❌ Error converting event ${eventData.id} to base64:`, err);
          // Keep the original URL as fallback
        }
      }
      
      return eventData;
    }));

    console.log(`🎉 Returning ${processedEvents.length} events from database`);
    res.json(processedEvents);
  } catch (error) {
    console.error("❌ Get events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Create event (admin only) - Store image as base64 in database
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

    // Convert uploaded file to base64 and store in database
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;

    console.log(`✅ Converting uploaded image to base64 (${base64Image.length} chars)`);

    // Get the next display order
    const maxOrder = (await Event.max("displayOrder")) || 0;

    const event = await Event.create({
      title: sanitizedData.title,
      description: sanitizedData.description,
      imageUrl: base64ImageUrl, // Store base64 data directly
      displayOrder: maxOrder + 1,
      addedBy,
      isActive: true,
    });

    // Clean up the uploaded file since we've stored it as base64
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log(`🗑️ Cleaned up uploaded file: ${req.file.path}`);
    }

    res.status(201).json({
      message: "Event created successfully with base64 image",
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

    // Handle file upload with validation - Convert to base64
    if (req.file) {
      try {
        validateImageFile(req.file);

        // Convert uploaded file to base64
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = req.file.mimetype;
        const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;

        console.log(`✅ Converting updated image to base64 (${base64Image.length} chars)`);

        updateData.imageUrl = base64ImageUrl; // Store base64 data directly

        // Clean up the uploaded file since we've stored it as base64
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log(`🗑️ Cleaned up uploaded file: ${req.file.path}`);
        }
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

// Permanently delete event (admin only) - No file system dependencies
const permanentDeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event exists
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Permanently delete from database (no file cleanup needed since images are stored as base64)
    await Event.destroy({ where: { id } });

    console.log(`🗑️ Permanently deleted event ${id} from database`);

    res.json({
      message: "Event permanently deleted from database",
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

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  permanentDeleteEvent,
};
