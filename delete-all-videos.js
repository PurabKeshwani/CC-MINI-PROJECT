const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function deleteAllVideos() {
  try {
    console.log('🗑️ Deleting all videos from database...');
    
    // Delete all videos (this will also delete related comments due to cascade)
    const result = await prisma.video.deleteMany();
    
    console.log(`✅ Successfully deleted ${result.count} videos from database.`);
    console.log('🎉 Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllVideos();
