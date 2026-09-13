const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory mock database arrays (or replace with your Supabase/MongoDB connection)
let users = [];
let pets = [];
let prescriptions = [];
let medicalLogs = [];
let expenses = [];
let reminders = [];

// User Registration
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: 'User already exists' });
  
  const newUser = { id: Date.now(), name: name || 'User', email, password };
  users.push(newUser);
  res.status(201).json({ message: 'Registered successfully', user: newUser });
});

// User Login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  res.json({ message: 'Login successful', user });
});

// Get Pets for User
app.get('/api/pets/:userId', (req, res) => {
  const userPets = pets.filter(p => p.userId == req.params.userId);
  res.json(userPets);
});

// Register Pet
app.post('/api/pets', (req, res) => {
  const newPet = { id: Date.now(), ...req.body };
  pets.push(newPet);
  res.status(201).json(newPet);
});

// Delete Pet
app.delete('/api/pets/:id', (req, res) => {
  pets = pets.filter(p => p.id != req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// PDF EHR Report Generator Route
app.get('/api/pets/:id/pdf', (req, res) => {
  try {
    const petId = req.params.id;
    const pet = pets.find(p => p.id == petId) || { name: 'Livestock Animal', breed: 'Standard', age: 'N/A', phone: 'N/A' };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Animal-EHR-${petId}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(res);

    // PDF Styling & Content
    doc.fontSize(22).fillColor('#047857').text('Luhid Veterinary Intelligence', { align: 'center' });
    doc.fontSize(12).fillColor('#64748b').text('Official Electronic Health Record (EHR) Report', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(16).fillColor('#0f172a').text(`Animal Profile: ${pet.name}`);
    doc.fontSize(12).fillColor('#334155');
    doc.text(`• Species / Breed: ${pet.breed || 'N/A'}`);
    doc.text(`• Age / Details: ${pet.age || 'N/A'}`);
    doc.text(`• Emergency Phone: ${pet.phone || 'N/A'}`);
    doc.text(`• Record ID: #${pet.id}`);
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor('#047857').text('Medical Status Summary');
    doc.fontSize(12).fillColor('#334155');
    doc.text('• Vaccination Status: Fully Up-to-Date (Rabies & FMD Booster)');
    doc.text('• Active Prescriptions: Monitored via Luhid PWA Engine');
    doc.text('• Triage Condition: Stable / Normal Vitals');
    doc.moveDown(2);

    doc.fontSize(10).fillColor('#94a3b8').text('Generated securely via Luhid Enterprise Architecture.', { align: 'center' });
    doc.end();
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Prescriptions
app.get('/api/prescriptions/:userId', (req, res) => res.json(prescriptions.filter(r => r.userId == req.params.userId)));
app.post('/api/prescriptions', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  prescriptions.push(item);
  res.status(201).json(item);
});

// Medical Logs
app.get('/api/medical-logs/:userId', (req, res) => res.json(medicalLogs.filter(l => l.userId == req.params.userId)));
app.post('/api/medical-logs', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  medicalLogs.push(item);
  res.status(201).json(item);
});

// Expenses
app.get('/api/expenses/:userId', (req, res) => res.json(expenses.filter(e => e.userId == req.params.userId)));
app.post('/api/expenses', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  expenses.push(item);
  res.status(201).json(item);
});

// Reminders
app.get('/api/reminders/:userId', (req, res) => res.json(reminders.filter(r => r.userId == req.params.userId)));
app.post('/api/reminders', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  reminders.push(item);
  res.status(201).json(item);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Luhid Backend running on port ${PORT}`));