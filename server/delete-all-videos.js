const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function deleteAllVideos() {
  try {
    console.log('🗑️ Deleting all videos and comments from database...');
    
    // First delete all comments (to avoid foreign key constraint)
    console.log('📝 Deleting all comments...');
    const commentsResult = await prisma.comment.deleteMany();
    console.log(`✅ Deleted ${commentsResult.count} comments`);
    
    // Then delete all videos
    console.log('🎥 Deleting all videos...');
    const videosResult = await prisma.video.deleteMany();
    console.log(`✅ Deleted ${videosResult.count} videos`);
    
    console.log('🎉 Database cleanup completed!');
    console.log(`📊 Total deleted: ${commentsResult.count} comments, ${videosResult.count} videos`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllVideos();
