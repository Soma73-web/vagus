const { Event } = require("../models");
const fs = require("fs");
const path = require("path");

// Migration script to populate imageData for existing events
async function migrateEventImages() {
  try {
    console.log("Starting event image migration...");

    // Get all events that have imagePath but no imageData
    const events = await Event.findAll({
      where: {
        imagePath: { [require("sequelize").Op.ne]: null },
        imageData: null,
      },
    });

    console.log(`Found ${events.length} events to migrate`);

    for (const event of events) {
      try {
        if (event.imagePath && fs.existsSync(event.imagePath)) {
          // Read the image file
          const imageData = fs.readFileSync(event.imagePath);

          // Determine MIME type from file extension
          const ext = path.extname(event.imagePath).toLowerCase();
          let mimeType = "image/jpeg"; // default

          switch (ext) {
            case ".png":
              mimeType = "image/png";
              break;
            case ".gif":
              mimeType = "image/gif";
              break;
            case ".webp":
              mimeType = "image/webp";
              break;
            case ".jpg":
            case ".jpeg":
            default:
              mimeType = "image/jpeg";
              break;
          }

          // Update the event with image data
          await event.update({
            imageData: imageData,
            mimeType: mimeType,
          });

          console.log(`✅ Migrated event ${event.id}: ${event.title}`);
        } else {
          console.log(
            `⚠��  Skipped event ${event.id}: ${event.title} (file not found: ${event.imagePath})`,
          );
        }
      } catch (error) {
        console.error(`❌ Error migrating event ${event.id}:`, error.message);
      }
    }

    console.log("Migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateEventImages()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = migrateEventImages;
