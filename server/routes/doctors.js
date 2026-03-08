const express = require('express');
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query(`
    SELECT d.id, u.full_name, d.specialization, d.experience_years
    FROM doctors d
    JOIN users u ON d.user_id = u.id
  `);

  res.json(result.rows);
});

router.post('/', auth, role(['admin']), async (req, res) => {
  const { full_name, email, password, specialization } = req.body;

  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(password, 10);

  const user = await pool.query(
    `INSERT INTO users (full_name,email,password,role)
     VALUES ($1,$2,$3,'doctor') RETURNING *`,
    [full_name, email, hash]
  );

  const doctor = await pool.query(
    `INSERT INTO doctors (user_id,specialization)
     VALUES ($1,$2) RETURNING *`,
    [user.rows[0].id, specialization]
  );

  res.json(doctor.rows[0]);
});

module.exports = router;