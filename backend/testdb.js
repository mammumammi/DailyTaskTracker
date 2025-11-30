const { Client } = require('pg');

const client = new Client({
  connectionString: 'YOUR_DATABASE_URL_HERE',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('✅ Database connected successfully!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Current time from DB:', result.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    client.end();
  });