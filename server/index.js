import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 5000;

// CORS setup to allow your live Vercel frontend
app.use(cors({
  origin: ['https://luhid.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// PostgreSQL connection using Render's cloud environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize tables automatically on startup
const initDb = async () => {
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

initDb();

// Routes
app.get('/', (req, res) => {
  res.send('Luhid Backend is running!');
});

// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'Registration successful! Please login.', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const user = userCheck.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Pets
app.get('/api/pets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await pool.query('SELECT * FROM pets WHERE user_id = $1', [userId]);
    res.json(pets.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Pet
app.post('/api/pets', async (req, res) => {
  try {
    const { userId, name, type, breed, age, phone, image } = req.body;
    const newPet = await pool.query(
      'INSERT INTO pets (user_id, name, type, breed, age, phone, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, name, type, breed, age, phone, image]
    );
    res.status(201).json(newPet.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Pet
app.delete('/api/pets/:petId', async (req, res) => {
  try {
    const { petId } = req.params;
    await pool.query('DELETE FROM pets WHERE id = $1', [petId]);
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Reminders
app.get('/api/reminders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reminders = await pool.query('SELECT * FROM reminders WHERE user_id = $1', [userId]);
    res.json(reminders.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Reminder
app.post('/api/reminders', async (req, res) => {
  try {
    const { userId, petName, title, dueDate } = req.body;
    const newRem = await pool.query(
      'INSERT INTO reminders (user_id, pet_name, title, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, petName, title, dueDate]
    );
    res.status(201).json(newRem.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Medical Logs
app.get('/api/medical-logs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await pool.query('SELECT * FROM medical_logs WHERE user_id = $1', [userId]);
    res.json(logs.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Medical Log
app.post('/api/medical-logs', async (req, res) => {
  try {
    const { userId, petName, title, category, notes, date } = req.body;
    const newLog = await pool.query(
      'INSERT INTO medical_logs (user_id, pet_name, title, category, notes, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, petName, title, category, notes, date]
    );
    res.status(201).json(newLog.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Prescriptions
app.get('/api/prescriptions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rx = await pool.query('SELECT * FROM prescriptions WHERE user_id = $1', [userId]);
    res.json(rx.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Prescription
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { userId, petName, doctorName, medication, dosage, duration, dateIssued } = req.body;
    const newRx = await pool.query(
      'INSERT INTO prescriptions (user_id, pet_name, doctor_name, medication, dosage, duration, date_issued) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, petName, doctorName, medication, dosage, duration, dateIssued]
    );
    res.status(201).json(newRx.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Expenses
app.get('/api/expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const exp = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
    res.json(exp.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { userId, petName, item, amount, date } = req.body;
    const newExp = await pool.query(
      'INSERT INTO expenses (user_id, pet_name, item, amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, petName, item, amount, date]
    );
    res.status(201).json(newExp.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});