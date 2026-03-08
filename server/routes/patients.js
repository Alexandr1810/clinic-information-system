const express = require('express');
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', auth, role(['doctor','admin']), async (req, res) => {
  const result = await pool.query(`
    SELECT p.id, u.full_name, p.birth_date, p.phone
    FROM patients p
    JOIN users u ON p.user_id = u.id
  `);

  res.json(result.rows);
});
router.get('/me', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT birth_date, phone, address FROM patients WHERE user_id=$1`,
    [req.user.id]
  );
  res.json(result.rows[0] || {});
});

router.patch('/me', auth, async (req, res) => {
  const { birth_date, phone, address } = req.body;
  const result = await pool.query(
    `UPDATE patients SET birth_date=$1, phone=$2, address=$3
     WHERE user_id=$4 RETURNING *`,
    [birth_date, phone, address, req.user.id]
  );
  res.json(result.rows[0]);
});
module.exports = router;