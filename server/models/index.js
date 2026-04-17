const { getDb } = require('../utils/db');
const { COLLECTIONS, SCHEMAS, INDEXES } = require('./schemas');

async function initializeDatabase() {
  const db = getDb();
  
  try {
    // Create collections with validation schemas
    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(c => c.name);
    
    for (const [collectionName, schema] of Object.entries(SCHEMAS)) {
      if (!existingCollections.includes(collectionName)) {
        await db.createCollection(collectionName, schema);
        console.log(`✅ Created collection: ${collectionName}`);
      }
    }
    
    // Create indexes
    for (const [collectionName, indexes] of Object.entries(INDEXES)) {
      const collection = db.collection(collectionName);
      
      for (const index of indexes) {
        try {
          await collection.createIndex(index.key, {
            name: index.name,
            unique: index.unique || false,
          });
        } catch (error) {
          // Index might already exist, skip
          if (!error.message.includes('already exists')) {
            console.warn(`Warning creating index ${index.name}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

module.exports = { initializeDatabase };
