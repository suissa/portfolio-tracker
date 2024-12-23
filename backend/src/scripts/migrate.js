require('dotenv').config({ path: '.env.railway' });
const { initializeDatabase } = require('../migrations/init');

console.log('Using database URL:', process.env.DATABASE_URL);

// Run the migration
initializeDatabase()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 