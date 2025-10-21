const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function cleanupDatabase() {
  try {
    console.log('🔍 Checking database for video records...');
    
    // Get all videos
    const videos = await prisma.video.findMany({
      include: {
        user: true,
        comments: true
      }
    });

    console.log(`📹 Found ${videos.length} videos in database:`);
    videos.forEach((video, index) => {
      console.log(`${index + 1}. ID: ${video.id}`);
      console.log(`   Title: ${video.title}`);
      console.log(`   User: ${video.user.username}`);
      console.log(`   Key: ${video.key}`);
      console.log(`   Comments: ${video.comments.length}`);
      console.log(`   Created: ${video.uploadedAt}`);
      console.log('---');
    });

    if (videos.length === 0) {
      console.log('✅ No videos found in database.');
      return;
    }

    // Ask user which videos to delete
    console.log('\n🗑️ To delete specific videos, you can:');
    console.log('1. Delete all videos: DELETE ALL');
    console.log('2. Delete by video ID: DELETE <video_id>');
    console.log('3. Delete by user: DELETE USER <username>');
    console.log('4. Exit without deleting: EXIT');

    // For now, let's just show what would be deleted
    console.log('\n⚠️  WARNING: This will permanently delete video records from the database!');
    console.log('📝 To actually delete, you would need to run specific delete commands.');
    
    // Example delete commands (commented out for safety)
    console.log('\n💡 Example delete commands (uncomment to use):');
    console.log('// Delete all videos:');
    console.log('// await prisma.video.deleteMany();');
    console.log('// Delete specific video:');
    console.log('// await prisma.video.delete({ where: { id: "video_id_here" } });');
    console.log('// Delete videos by user:');
    console.log('// await prisma.video.deleteMany({ where: { user: { username: "username_here" } } });');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
