const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://postgres:root@localhost:5432/clinic_db',
});

module.exports = pool;