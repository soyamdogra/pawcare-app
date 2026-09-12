const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const cron = require('node-cron');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://luhid.vercel.app', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());

async function initializeTables() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'pet_parent',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS pets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      breed TEXT NOT NULL,
      age TEXT NOT NULL,
      phone TEXT DEFAULT '+919876543210',
      image TEXT
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS prescriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pet_name TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      medication TEXT NOT NULL,
      dosage TEXT NOT NULL,
      duration TEXT NOT NULL,
      date_issued TEXT NOT NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS medical_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pet_name TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      notes TEXT NOT NULL,
      date TEXT NOT NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pet_name TEXT NOT NULL,
      item TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS reminders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      pet_name TEXT NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending'
    )`);

    console.log('PostgreSQL tables verified/initialized successfully.');
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err.message);
  }
}

initializeTables();

cron.schedule('0 9 * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.query(
      `SELECT * FROM reminders WHERE due_date <= $1 AND status = 'Pending'`,
      [today]
    );
    if (result.rows.length > 0) {
      console.log(`[Luhid Engine] Dispatched ${result.rows.length} healthcare reminders for today.`);
    }
  } catch (err) {
    console.error('Cron job error:', err.message);
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [name, email, password_hash]
    );
    return res.status(201).json({ message: 'Registration successful! Please log in.', userId: result.rows[0].id });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    return res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/pets/:userId', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM pets WHERE user_id = $1`, [req.params.userId]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/pets', async (req, res) => {
  try {
    const { userId, name, type, breed, age, phone, image } = req.body;
    const resolvedPhone = phone || '+919876543210';
    const result = await db.query(
      `INSERT INTO pets (user_id, name, type, breed, age, phone, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [userId, name, type, breed, age, resolvedPhone, image]
    );
    res.status(201).json({ id: result.rows[0].id, userId, name, type, breed, age, phone: resolvedPhone, image });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add pet' });
  }
});

app.get('/api/reminders/:userId', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM reminders WHERE user_id = $1`, [req.params.userId]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/reminders', async (req, res) => {
  try {
    const { userId, petName, title, dueDate } = req.body;
    const result = await db.query(
      `INSERT INTO reminders (user_id, pet_name, title, due_date) VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, petName, title, dueDate]
    );
    res.status(201).json({ id: result.rows[0].id, user_id: userId, pet_name: petName, title, due_date: dueDate, status: 'Pending' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/medical-logs/:userId', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM medical_logs WHERE user_id = $1`, [req.params.userId]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/medical-logs', async (req, res) => {
  try {
    const { userId, petName, title, category, notes, date } = req.body;
    const result = await db.query(
      `INSERT INTO medical_logs (user_id, pet_name, title, category, notes, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [userId, petName, title, category, notes, date]
    );
    res.status(201).json({ id: result.rows[0].id, userId, pet_name: petName, title, category, notes, date });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/prescriptions/:userId', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM prescriptions WHERE user_id = $1`, [req.params.userId]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const { userId, petName, doctorName, medication, dosage, duration, dateIssued } = req.body;
    const result = await db.query(
      `INSERT INTO prescriptions (user_id, pet_name, doctor_name, medication, dosage, duration, date_issued) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [userId, petName, doctorName, medication, dosage, duration, dateIssued]
    );
    res.status(201).json({ id: result.rows[0].id, userId, pet_name: petName, doctor_name: doctorName, medication, dosage, duration, date_issued: dateIssued });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/expenses/:userId', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM expenses WHERE user_id = $1`, [req.params.userId]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { userId, petName, item, amount, date } = req.body;
    const result = await db.query(
      `INSERT INTO expenses (user_id, pet_name, item, amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, petName, item, amount, date]
    );
    res.status(201).json({ id: result.rows[0].id, userId, pet_name: petName, item, amount, date });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/pets/:id/qrcode', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM pets WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pet not found' });

    const pet = result.rows[0];
    const contactPhone = pet.phone || '+919876543210';
    const telPayload = `tel:${contactPhone}`;

    const dataUrl = await QRCode.toDataURL(telPayload, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' }
    });
    res.json({ qrcode: dataUrl, phone: contactPhone });
  } catch (qrErr) {
    res.status(500).json({ message: 'QR Error' });
  }
});

app.get('/api/pets/:id/pdf', async (req, res) => {
  try {
    const petResult = await db.query(`SELECT * FROM pets WHERE id = $1`, [req.params.id]);
    if (petResult.rows.length === 0) return res.status(404).json({ message: 'Pet not found' });
    const pet = petResult.rows[0];

    const logsResult = await db.query(`SELECT * FROM medical_logs WHERE pet_name = $1`, [pet.name]);
    const rxsResult = await db.query(`SELECT * FROM prescriptions WHERE pet_name = $1`, [pet.name]);

    const logs = logsResult.rows;
    const rxs = rxsResult.rows;

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${pet.name}_Luhid_Report.pdf`);
    doc.pipe(res);

    doc.fontSize(24).fillColor('#0f172a').text('Luhid Medical Enterprise', { align: 'left' });
    doc.fontSize(10).fillColor('#16a34a').text('Every Animal. A Safer Tomorrow.', { align: 'left' });
    doc.moveDown(1.5);

    doc.fontSize(16).fillColor('#334155').text(`Patient Profile: ${pet.name}`);
    doc.fontSize(11).fillColor('#0f172a')
       .text(`Species: ${pet.type}`)
       .text(`Breed: ${pet.breed}`)
       .text(`Age: ${pet.age}`)
       .text(`Emergency Contact: ${pet.phone}`);
    doc.moveDown(1.5);

    doc.fontSize(13).fillColor('#2563eb').text('Clinical & Vaccination History:', { underline: true });
    if (logs.length === 0) doc.fontSize(10).fillColor('#94a3b8').text('No clinical records logged.');
    logs.forEach(l => doc.fontSize(10).fillColor('#0f172a').text(`• [${l.date}] ${l.title} (${l.category}): ${l.notes}`));
    doc.moveDown(1.5);

    doc.fontSize(13).fillColor('#16a34a').text('Active Prescriptions:', { underline: true });
    if (rxs.length === 0) doc.fontSize(10).fillColor('#94a3b8').text('No active prescriptions.');
    rxs.forEach(r => doc.fontSize(10).fillColor('#0f172a').text(`• ${r.medication} - ${r.dosage} (${r.duration}) | Doctor: ${r.doctor_name}`));

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating PDF report' });
  }
});

app.listen(PORT, () => console.log(`Luhid backend running on port ${PORT}`));