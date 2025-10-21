const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

async function setupDynamoDB() {
  try {
    console.log('🔍 Checking existing tables...');
    
    // List existing tables
    const listResult = await dynamoClient.send(new ListTablesCommand({}));
    console.log('Existing tables:', listResult.TableNames);

    // Create VideoMetrics table
    if (!listResult.TableNames.includes('VideoMetrics')) {
      console.log('📊 Creating VideoMetrics table...');
      await dynamoClient.send(new CreateTableCommand({
        TableName: 'VideoMetrics',
        KeySchema: [
          { AttributeName: 'videoId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'videoId', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }));
      console.log('✅ VideoMetrics table created');
    } else {
      console.log('✅ VideoMetrics table already exists');
    }

    // Create UserEngagement table
    if (!listResult.TableNames.includes('UserEngagement')) {
      console.log('👤 Creating UserEngagement table...');
      await dynamoClient.send(new CreateTableCommand({
        TableName: 'UserEngagement',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
      }));
      console.log('✅ UserEngagement table created');
    } else {
      console.log('✅ UserEngagement table already exists');
    }

    console.log('🎉 DynamoDB setup completed!');
    console.log('📊 Tables created:');
    console.log('  - VideoMetrics: Stores video analytics data');
    console.log('  - UserEngagement: Stores user engagement metrics');

  } catch (error) {
    console.error('❌ Error setting up DynamoDB:', error);
  }
}

setupDynamoDB();
