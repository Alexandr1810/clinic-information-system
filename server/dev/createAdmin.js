const bcrypt = require("bcrypt");
const pool = require("../db");

async function create() {
  const hash = await bcrypt.hash("123456", 10);

  await pool.query(
    `UPDATE users 
     SET password=$1, role='admin' 
     WHERE email=$2`,
    [hash, "admin@clinic.com"]
  );

  console.log("Admin password updated");
  process.exit();
}

create();