const fs = require('fs');
const path = require('path');
const { Event } = require('../models');

async function convertEventsToBase64() {
  try {
    console.log('🔄 Starting conversion of events to base64...');
    
    // Get all events
    const events = await Event.findAll();
    console.log(`📊 Found ${events.length} events to process`);
    
    let convertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const event of events) {
      try {
        console.log(`🖼️ Processing event ${event.id}: ${event.title || 'Untitled'}`);
        
        // Check if imageUrl is already base64
        if (event.imageUrl && event.imageUrl.startsWith('data:')) {
          console.log(`✅ Event ${event.id} already has base64 image`);
          skippedCount++;
          continue;
        }
        
        // Check if imagePath exists and convert to base64
        if (event.imagePath && fs.existsSync(event.imagePath)) {
          console.log(`📁 Converting file: ${event.imagePath}`);
          
          const imageBuffer = fs.readFileSync(event.imagePath);
          const base64Image = imageBuffer.toString('base64');
          const mimeType = path.extname(event.imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
          const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;
          
          // Update the event in database
          await event.update({
            imageUrl: base64ImageUrl
          });
          
          console.log(`✅ Converted event ${event.id} to base64 (${base64Image.length} chars)`);
          convertedCount++;
          
        } else if (event.imageUrl && !event.imageUrl.startsWith('data:')) {
          console.log(`⚠️ Event ${event.id} has imageUrl but no file path: ${event.imageUrl}`);
          // Keep the existing imageUrl as is
          skippedCount++;
        } else {
          console.log(`⚠️ Event ${event.id} has no image data`);
          skippedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing event ${event.id}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📈 Conversion Summary:');
    console.log(`✅ Converted: ${convertedCount} events`);
    console.log(`⏭️ Skipped: ${skippedCount} events`);
    console.log(`❌ Errors: ${errorCount} events`);
    console.log(`🎉 Total processed: ${events.length} events`);
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
  }
}

// Run the conversion if this script is executed directly
if (require.main === module) {
  convertEventsToBase64()
    .then(() => {
      console.log('🏁 Conversion script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Conversion script failed:', error);
      process.exit(1);
    });
}

module.exports = convertEventsToBase64; 