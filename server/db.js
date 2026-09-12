import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100),
        type VARCHAR(50),
        breed VARCHAR(100),
        age VARCHAR(50),
        phone VARCHAR(50),
        image TEXT
      );
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        pet_name VARCHAR(100),
        title VARCHAR(255),
        due_date VARCHAR(50)
      );
      CREATE TABLE IF NOT EXISTS medical_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        pet_name VARCHAR(100),
        title VARCHAR(255),
        category VARCHAR(100),
        notes TEXT,
        date VARCHAR(50)
      );
      CREATE TABLE IF NOT EXISTS prescriptions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        pet_name VARCHAR(100),
        doctor_name VARCHAR(100),
        medication VARCHAR(255),
        dosage VARCHAR(100),
        duration VARCHAR(100),
        date_issued VARCHAR(50)
      );
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        pet_name VARCHAR(100),
        item VARCHAR(255),
        amount NUMERIC(10,2),
        date VARCHAR(50)
      );
    `);
    console.log("PostgreSQL tables initialized successfully!");
  } catch (err) {
    console.error("Error initializing PostgreSQL tables:", err);
  }
};

export default pool;