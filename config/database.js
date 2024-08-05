const { Pool } = require('pg');

const pool = new Pool({
  user: 'adminavo',
  host: 'avo-adb-001.postgres.database.azure.com',
  database: 'leave-management',
  password: '$#fKcdXPg4@ue8AW', 
  port: 5432,
});

module.exports = pool;
