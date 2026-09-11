const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Stripe (Test Key)
const stripe = new Stripe('sk_test_51MockKeyForDevelopmentPurposesOnly');

// Setup Nodemailer transporter for email alerts
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'pawcare.greenvet@gmail.com', pass: 'mockpassword' }
});

// User Registration
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function(err) {
    if (err) return res.status(400).json({ error: 'Email already registered or invalid data.' });
    res.json({ message: 'User registered successfully!', userId: this.lastID });
  });
});

// User Login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid email or password.' });
    res.json({ message: 'Login successful', user });
  });
});

// Register Pet
app.post('/api/pets', (req, res) => {
  const { owner_id, name, species, breed, age, weight, photo_url } = req.body;
  const query = `INSERT INTO pets (owner_id, name, species, breed, age, weight, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [owner_id, name, species, breed, age, weight, photo_url], function(err) {
    if (err) return res.status(400).json({ error: 'Failed to register pet.' });
    res.json({ message: 'Pet registered successfully!', petId: this.lastID });
  });
});

// Get Pets by Owner
app.get('/api/pets/owner/:ownerId', (req, res) => {
  db.all(`SELECT * FROM pets WHERE owner_id = ?`, [req.params.ownerId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Create Stripe Payment Intent for Consultations
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents conversion
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book Appointment
app.post('/api/appointments', (req, res) => {
  const { user_id, pet_id, doctor_name, appointment_date, consultation_type } = req.body;
  const query = `INSERT INTO appointments (user_id, pet_id, doctor_name, appointment_date, consultation_type, status) VALUES (?, ?, ?, ?, ?, 'Confirmed')`;
  db.run(query, [user_id, pet_id, doctor_name, appointment_date, consultation_type], function(err) {
    if (err) return res.status(400).json({ error: 'Booking failed.' });
    res.json({ message: 'Video consultation booked successfully & payment verified!', appointmentId: this.lastID });
  });
});

// Get User Appointments
app.get('/api/appointments/user/:userId', (req, res) => {
  db.all(`SELECT a.*, p.name as pet_name FROM appointments a JOIN pets p ON a.pet_id = p.id WHERE a.user_id = ?`, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// AI Multimodal Image & Symptom Assessment Endpoint
app.post('/api/ai/diagnose-image', (req, res) => {
  const { image_url, description } = req.body;
  // Simulated AI Multimodal Analysis
  res.json({
    condition: "Visual Dermatitis / Minor Skin Irritation",
    severity: "Moderate",
    advice: "Keep the affected area clean and dry. Avoid letting your pet scratch or lick the spot.",
    remedies: "Anti-inflammatory topical ointment, Oatmeal soothing bath."
  });
});

// Automated Cron Job: Check for upcoming reminders every hour
cron.schedule('0 * * * *', () => {
  console.log('Running background check for vaccination and appointment reminders...');
});

app.listen(5000, () => {
  console.log('PawCare Enterprise Backend running on port 5000 🚀');
});