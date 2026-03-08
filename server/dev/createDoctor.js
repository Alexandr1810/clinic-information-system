const bcrypt = require("bcrypt");
const pool = require("../db");

async function create() {
  const hash = await bcrypt.hash("123456", 10);

  await pool.query(
    `INSERT INTO users (full_name, email, password, role)
    VALUES ($1,$2,$3,'doctor') RETURNING id`,
    ["Dr. Test", "doctor@clinic.com", hash]
  );

  console.log("Admin created");
  process.exit();
}

create();