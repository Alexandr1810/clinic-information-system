const express = require('express');
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  let query = `
    SELECT a.*, 
           u_doc.full_name as doctor_name,
           u_pat.full_name as patient_name
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u_doc ON d.user_id = u_doc.id
    JOIN patients p ON a.patient_id = p.id
    JOIN users u_pat ON p.user_id = u_pat.id
  `;

  if (req.user.role === 'doctor') {
    query += ` WHERE d.user_id = ${req.user.id}`;
  }

  if (req.user.role === 'patient') {
    query += ` WHERE p.user_id = ${req.user.id}`;
  }

  const result = await pool.query(query);
  res.json(result.rows);
});

router.post('/', auth, role(['patient']), async (req, res) => {
  const { doctor_id, appointment_date } = req.body;

  const patient = await pool.query(
    `SELECT id FROM patients WHERE user_id=$1`,
    [req.user.id]
  );

  const result = await pool.query(
    `INSERT INTO appointments (doctor_id,patient_id,appointment_date)
     VALUES ($1,$2,$3) RETURNING *`,
    [doctor_id, patient.rows[0].id, appointment_date]
  );

  res.json(result.rows[0]);
});

router.patch('/:id', auth, role(['doctor']), async (req, res) => {
  const { status, diagnosis, notes } = req.body;

  const result = await pool.query(
    `UPDATE appointments 
     SET status=$1, diagnosis=$2, notes=$3
     WHERE id=$4 RETURNING *`,
    [status, diagnosis, notes, req.params.id]
  );

  res.json(result.rows[0]);
});

router.patch('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Проверяем, что приём принадлежит этому врачу
  const appointmentRes = await pool.query(
    `SELECT * FROM appointments WHERE id=$1 AND doctor_id=(SELECT id FROM doctors WHERE user_id=$2)`,
    [id, req.user.id]
  );

  if (appointmentRes.rows.length === 0) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  const updated = await pool.query(
    `UPDATE appointments SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );

  res.json(updated.rows[0]);
});

module.exports = router;