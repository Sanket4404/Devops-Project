const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    "INSERT INTO users(email,password) VALUES($1,$2) RETURNING id,email",
    [email, hash]
  );

  res.json(rows[0]);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!rows.length)
    return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, rows[0].password);

  if (!valid)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

app.listen(process.env.PORT, async () => {
  await init();
  console.log("User Service running");
});

