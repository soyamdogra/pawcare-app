const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const cron = require('node-cron');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());

const dbPath = path.resolve(__dirname, 'luhid.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to Luhid Enterprise SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'pet_parent',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    phone TEXT DEFAULT '+919876543210',
    image TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pet_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    medication TEXT NOT NULL,
    dosage TEXT NOT NULL,
    duration TEXT NOT NULL,
    date_issued TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medical_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pet_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    notes TEXT NOT NULL,
    date TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pet_name TEXT NOT NULL,
    item TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pet_name TEXT NOT NULL,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending'
  )`);
});

cron.schedule('0 9 * * *', () => {
  const today = new Date().toISOString().split('T')[0];
  db.all(`SELECT * FROM reminders WHERE due_date <= ? AND status = 'Pending'`, [today], (err, rows) => {
    if (!err && rows.length > 0) {
      console.log(`[Luhid Engine] Dispatched ${rows.length} healthcare reminders for today.`);
    }
  });
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const password_hash = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`, [name, email, password_hash], function(err) {
      if (err) return res.status(400).json({ message: 'Email already exists' });
      return res.status(201).json({ message: 'Registration successful! Please log in.', userId: this.lastID });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    return res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  });
});

app.get('/api/pets/:userId', (req, res) => {
  db.all(`SELECT * FROM pets WHERE user_id = ?`, [req.params.userId], (err, rows) => res.json(rows || []));
});

app.post('/api/pets', (req, res) => {
  const { userId, name, type, breed, age, phone, image } = req.body;
  db.run(`INSERT INTO pets (user_id, name, type, breed, age, phone, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, type, breed, age, phone || '+919876543210', image], function(err) {
      if (err) return res.status(500).json({ message: 'Failed to add pet' });
      res.status(201).json({ id: this.lastID, userId, name, type, breed, age, phone: phone || '+919876543210', image });
  });
});

app.get('/api/reminders/:userId', (req, res) => {
  db.all(`SELECT * FROM reminders WHERE user_id = ?`, [req.params.userId], (err, rows) => res.json(rows || []));
});

app.post('/api/reminders', (req, res) => {
  const { userId, petName, title, dueDate } = req.body;
  db.run(`INSERT INTO reminders (user_id, pet_name, title, due_date) VALUES (?, ?, ?, ?)`,
    [userId, petName, title, dueDate], function(err) {
      res.status(201).json({ id: this.lastID, user_id: userId, pet_name: petName, title, due_date: dueDate, status: 'Pending' });
  });
});

app.get('/api/medical-logs/:userId', (req, res) => {
  db.all(`SELECT * FROM medical_logs WHERE user_id = ?`, [req.params.userId], (err, rows) => res.json(rows || []));
});

app.post('/api/medical-logs', (req, res) => {
  const { userId, petName, title, category, notes, date } = req.body;
  db.run(`INSERT INTO medical_logs (user_id, pet_name, title, category, notes, date) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, petName, title, category, notes, date], function(err) {
      res.status(201).json({ id: this.lastID, userId, pet_name: petName, title, category, notes, date });
  });
});

app.get('/api/prescriptions/:userId', (req, res) => {
  db.all(`SELECT * FROM prescriptions WHERE user_id = ?`, [req.params.userId], (err, rows) => res.json(rows || []));
});

app.post('/api/prescriptions', (req, res) => {
  const { userId, petName, doctorName, medication, dosage, duration, dateIssued } = req.body;
  db.run(`INSERT INTO prescriptions (user_id, pet_name, doctor_name, medication, dosage, duration, date_issued) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, petName, doctorName, medication, dosage, duration, dateIssued], function(err) {
      res.status(201).json({ id: this.lastID, userId, pet_name: petName, doctor_name: doctorName, medication, dosage, duration, date_issued: dateIssued });
  });
});

app.get('/api/expenses/:userId', (req, res) => {
  db.all(`SELECT * FROM expenses WHERE user_id = ?`, [req.params.userId], (err, rows) => res.json(rows || []));
});

app.post('/api/expenses', (req, res) => {
  const { userId, petName, item, amount, date } = req.body;
  db.run(`INSERT INTO expenses (user_id, pet_name, item, amount, date) VALUES (?, ?, ?, ?, ?)`,
    [userId, petName, item, amount, date], function(err) {
      res.status(201).json({ id: this.lastID, userId, pet_name: petName, item, amount, date });
  });
});

app.get('/api/pets/:id/qrcode', (req, res) => {
  db.get(`SELECT * FROM pets WHERE id = ?`, [req.params.id], async (err, pet) => {
    if (err || !pet) return res.status(404).json({ message: 'Pet not found' });

    const contactPhone = pet.phone || '+919876543210';
    const telPayload = `tel:${contactPhone}`;

    try {
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
});

app.get('/api/pets/:id/pdf', (req, res) => {
  db.get(`SELECT * FROM pets WHERE id = ?`, [req.params.id], (err, pet) => {
    if (err || !pet) return res.status(404).json({ message: 'Pet not found' });

    db.all(`SELECT * FROM medical_logs WHERE pet_name = ?`, [pet.name], (err, logs) => {
      db.all(`SELECT * FROM prescriptions WHERE pet_name = ?`, [pet.name], (err, rxs) => {
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
      });
    });
  });
});

app.listen(PORT, () => console.log(`Luhid backend running on port ${PORT}`));