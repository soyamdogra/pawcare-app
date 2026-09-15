import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Safely initialize Google Gen AI client helper
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// In-memory data stores for development & testing
const users = [];
const pets = [];
const prescriptions = [];
const medicalLogs = [];
const expenses = [];
const reminders = [];

// --- User Authentication Routes ---
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { id: Date.now().toString(), name: name || 'User', email, password };
  users.push(newUser);
  res.status(201).json({ message: 'Registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

// --- Pet / Animal Records Routes ---
app.get('/api/pets/:userId', (req, res) => {
  const userPets = pets.filter(p => p.userId === req.params.userId);
  res.json(userPets);
});

app.post('/api/pets', (req, res) => {
  const newPet = { id: Date.now().toString(), ...req.body };
  pets.push(newPet);
  res.status(201).json(newPet);
});

app.delete('/api/pets/:id', (req, res) => {
  const index = pets.findIndex(p => p.id === req.params.id || p._id === req.params.id);
  if (index !== -1) {
    pets.splice(index, 1);
    return res.json({ message: 'Deleted successfully' });
  }
  res.status(404).json({ message: 'Pet not found' });
});

// --- PDF EHR Report Mock Endpoint ---
app.get('/api/pets/:id/pdf', (req, res) => {
  const pet = pets.find(p => p.id === req.params.id || p._id === req.params.id);
  const pdfContent = `Luhid Electronic Health Record (EHR)\nAnimal: ${pet ? pet.name : 'Unknown'}\nBreed: ${pet ? pet.breed : 'N/A'}\nStatus: Stable`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Animal-EHR-${req.params.id}.pdf`);
  res.send(Buffer.from(pdfContent));
});

// --- Prescriptions, Logs, Expenses & Reminders ---
app.get('/api/prescriptions/:userId', (req, res) => res.json(prescriptions.filter(p => p.userId === req.params.userId)));
app.post('/api/prescriptions', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  prescriptions.push(item);
  res.status(201).json(item);
});

app.get('/api/medical-logs/:userId', (req, res) => res.json(medicalLogs.filter(l => l.userId === req.params.userId)));
app.post('/api/medical-logs', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  medicalLogs.push(item);
  res.status(201).json(item);
});

app.get('/api/expenses/:userId', (req, res) => res.json(expenses.filter(e => e.userId === req.params.userId)));
app.post('/api/expenses', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  expenses.push(item);
  res.status(201).json(item);
});

app.get('/api/reminders/:userId', (req, res) => res.json(reminders.filter(r => r.userId === req.params.userId)));
app.post('/api/reminders', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  reminders.push(item);
  res.status(201).json(item);
});

// --- Gemini AI Triage Engine Route ---
app.post('/api/diagnose', async (req, res) => {
  try {
    const { symptoms, petName } = req.body;
    const aiClient = getAiClient();
    
    if (!aiClient) {
      console.warn("GEMINI_API_KEY is missing in server environment variables.");
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the Render backend environment variables.' });
    }
    
    // Call Gemini API using the official @google/genai SDK
    const response = await aiClient.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are an expert veterinary intelligence assistant. Analyze the following symptoms for animal "${petName || 'Patient'}": "${symptoms}". Provide a concise clinical summary and practical recommendations.`
    });

    res.json({
      diagnosis: response.text || 'No diagnosis generated.',
      recommendation: "Ensure regular hydration and consult local veterinary specialist if conditions persist."
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI diagnosis via Gemini API.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});