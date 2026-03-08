const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES ($1,$2,$3,'patient') RETURNING *`,
    [full_name, email, hash]
  );

  const user = result.rows[0];

  await pool.query(
    `INSERT INTO patients (user_id) VALUES ($1)`,
    [user.id]
  );

  res.json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Wrong password' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    'supersecretkey',
    { expiresIn: '1d' }
  );

  res.json({ token, role: user.role });
});

module.exports = router;