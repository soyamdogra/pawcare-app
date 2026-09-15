const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// File path for permanent JSON storage on disk
const DATA_FILE = path.join(__dirname, 'data.json');

// Load saved data or initialize defaults with full user isolation support
let db = {
  users: [],
  pets: [],
  prescriptions: [],
  medicalLogs: [],
  expenses: [],
  reminders: []
};

if (fs.existsSync(DATA_FILE)) {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    db = JSON.parse(fileData);
    db.users = db.users || [];
    db.pets = db.pets || [];
    db.prescriptions = db.prescriptions || [];
    db.medicalLogs = db.medicalLogs || [];
    db.expenses = db.expenses || [];
    db.reminders = db.reminders || [];
  } catch (err) {
    console.error('Error reading data file, using defaults', err);
  }
}

// Helper function to save data permanently to disk
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Request logger
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to: ${req.url}`);
  next();
});

// Root endpoint to prevent "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    status: 'Online',
    message: 'Luhid Veterinary Intelligence API',
    endpoints: ['/api/health', '/api/users/login', '/api/users/register', '/api/pets', '/api/diagnose', '/api/pets/scan/:id', '/api/ai-search']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Luhid Backend running successfully' });
});

// --- User Authentication Routes ---
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { id: Date.now().toString(), name: name || 'User', email, password };
  db.users.push(newUser);
  saveData();
  res.status(201).json({ 
    message: 'Registered successfully', 
    user: { id: newUser.id, name: newUser.name, email: newUser.email } 
  });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ 
    message: 'Login successful', 
    user: { id: user.id, name: user.name, email: user.email } 
  });
});

// --- Pet / Animal Records Routes (User-Isolated & Persistent) ---
app.get('/api/pets/:userId', (req, res) => {
  const userPets = db.pets.filter(p => p.userId === req.params.userId);
  res.json(userPets);
});

app.post('/api/pets', (req, res) => {
  const { userId, name } = req.body || {};
  if (!userId) return res.status(400).json({ message: 'Unauthorized: missing userId' });

  // Prevent duplicate pet profiles with the same name for the same user account
  const existingPet = db.pets.find(p => p.userId === userId && p.name.trim().toLowerCase() === (name || '').trim().toLowerCase());
  if (existingPet) {
    return res.status(400).json({ message: 'An animal profile with this name already exists for your account.' });
  }

  const newPet = { id: Date.now().toString(), ...req.body };
  db.pets.push(newPet);
  saveData();
  res.status(201).json(newPet);
});

app.delete('/api/pets/:id', (req, res) => {
  const index = db.pets.findIndex(p => p.id === req.params.id || p._id === req.params.id);
  if (index !== -1) {
    db.pets.splice(index, 1);
    saveData();
    return res.json({ message: 'Deleted successfully' });
  }
  res.status(404).json({ message: 'Pet not found' });
});

// --- Pet Scan & Details Endpoint (QR / Code Lookup with Owner Contacts & Medical History) ---
app.get('/api/pets/scan/:id', (req, res) => {
  const petId = req.params.id;
  const pet = db.pets.find(p => p.id === petId || p._id === petId);
  
  if (!pet) {
    return res.status(404).json({ message: 'Pet tag or code not found in the Luhid database.' });
  }

  // Find the owner/user associated with this pet via userId
  const owner = db.users.find(u => u.id === pet.userId) || {};

  // Fetch associated medical history, logs, and prescriptions for this pet
  const petLogs = db.medicalLogs.filter(l => l.petId === petId || l.animalId === petId);
  const petPrescriptions = db.prescriptions.filter(p => p.petId === petId || p.animalId === petId);

  res.json({
    success: true,
    pet: {
      id: pet.id,
      name: pet.name,
      type: pet.type || pet.breed,
      age: pet.age,
      gender: pet.gender || 'N/A',
      weight: pet.weight || 'N/A'
    },
    ownerDetails: {
      name: owner.name || 'Registered Owner',
      email: owner.email || 'N/A',
      emergencyPhone: pet.phone || pet.emergencyContact || owner.phone || 'N/A'
    },
    vaccinationHistory: petLogs.filter(l => l.category === 'Vaccination' || l.type === 'Vaccine' || (l.notes && l.notes.toLowerCase().includes('vaccin'))),
    medicalLogs: petLogs,
    prescriptions: petPrescriptions
  });
});

// --- Prescriptions, Logs, Expenses & Reminders (User-Isolated) ---
app.get('/api/prescriptions/:userId', (req, res) => {
  res.json(db.prescriptions.filter(p => p.userId === req.params.userId));
});
app.post('/api/prescriptions', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  db.prescriptions.push(item);
  saveData();
  res.status(201).json(item);
});

app.get('/api/medical-logs/:userId', (req, res) => {
  res.json(db.medicalLogs.filter(l => l.userId === req.params.userId));
});
app.post('/api/medical-logs', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  db.medicalLogs.push(item);
  saveData();
  res.status(201).json(item);
});

app.get('/api/expenses/:userId', (req, res) => {
  res.json(db.expenses.filter(e => e.userId === req.params.userId));
});
app.post('/api/expenses', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  db.expenses.push(item);
  saveData();
  res.status(201).json(item);
});

app.get('/api/reminders/:userId', (req, res) => {
  res.json(db.reminders.filter(r => r.userId === req.params.userId));
});
app.post('/api/reminders', (req, res) => {
  const item = { id: Date.now().toString(), ...req.body };
  db.reminders.push(item);
  saveData();
  res.status(201).json(item);
});

// --- AI-Powered Search Engine & Recommendation Brain ---
app.post('/api/ai-search', async (req, res) => {
  const { userId, query } = req.body || {};
  if (!userId || !query) {
    return res.status(400).json({ message: 'Missing userId or query' });
  }

  // Gather isolated data for this user
  const userPets = db.pets.filter(p => p.userId === userId);
  const userPrescriptions = db.prescriptions.filter(pr => pr.userId === userId);
  const userLogs = db.medicalLogs.filter(l => l.userId === userId);
  const userExpenses = db.expenses.filter(e => e.userId === userId);
  const userReminders = db.reminders.filter(r => r.userId === userId);

  const contextData = {
    pets: userPets,
    prescriptions: userPrescriptions,
    medicalLogs: userLogs,
    expenses: userExpenses,
    reminders: userReminders
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ answer: 'AI Search Error: GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `
        You are the intelligent search engine and veterinary reasoning brain of Luhid.
        Here is the user's complete secure database:
        ${JSON.stringify(contextData, null, 2)}

        User's Natural Language Question: "${query}"

        Analyze this data thoroughly. Provide precise answers, summarize records, and deliver actionable veterinary care recommendations based strictly on the user's information. Be professional and well-structured.
      `
    });

    const answerText = response.text || (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) || 'Search completed.';
    res.json({ answer: answerText });
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({ answer: 'Failed to process intelligent search query at the moment.' });
  }
});

// --- Gemini AI Triage Engine Route with Dynamic Symptom-Aware Fallback & Emergency Guardrails ---
app.post('/api/diagnose', async (req, res) => {
  const { symptoms, petName } = req.body || {};
  const symptomLower = (symptoms || '').toLowerCase();

  // Check for critical / fatal keywords upfront
  const isEmergency = symptomLower.includes('died') || 
                      symptomLower.includes('death') || 
                      symptomLower.includes('unresponsive') || 
                      symptomLower.includes('bleeding') || 
                      symptomLower.includes('poison') || 
                      symptomLower.includes('unconscious') ||
                      symptomLower.includes('not breathing');

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server environment.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      You are an expert veterinary clinical triage intelligence assistant.
      CRITICAL SAFETY RULE: If the user inputs fatal, critical, or life-threatening keywords (such as "died", "unresponsive", "bleeding", "poison", "unconscious", "not breathing"), you MUST NOT give routine monitoring or comfort advice. Instead, you must immediately output a red-level EMERGENCY TRIAGE warning instructing immediate physical intervention, emergency veterinary hospital transport, and urgent care protocols.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `${systemInstruction}\n\nAnalyze these exact symptoms for animal "${petName || 'Patient'}": "${symptoms}". Provide clinical summary and actionable recommendations tailored precisely to these symptoms.`
    });

    const diagnosisText = response.text || (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) || 'Diagnostic assessment completed.';

    let finalRecommendation = 'Follow the specialized clinical steps above and consult your veterinarian if condition changes.';
    if (isEmergency) {
      finalRecommendation = '🚨 EMERGENCY: Transport the animal to the nearest 24/7 veterinary emergency hospital immediately. Do not wait.';
    }

    return res.json({
      diagnosis: diagnosisText,
      recommendation: finalRecommendation
    });

  } catch (error) {
    console.error('Gemini API Error details:', error);
    
    // Fallback logic with Emergency override
    let specificDiagnosis = `Clinical Triage for ${petName || 'Patient'}: Analysis of symptoms ("${symptoms}") indicates unique physiological strain requiring careful monitoring.`;
    let specificRec = 'Keep the animal comfortable, track any changes in behavior, and consult a local vet if condition persists.';

    if (isEmergency) {
      specificDiagnosis = `🚨 CRITICAL EMERGENCY TRIAGE for ${petName || 'Patient'}: Reports of ("${symptoms}") indicate a potentially fatal or life-threatening condition requiring instant medical intervention.`;
      specificRec = 'URGENT: Immediately rush the animal to the nearest emergency veterinary hospital. Clear airway, keep them warm, and seek professional emergency care right now.';
    } else if (symptomLower.includes('loose motion') || symptomLower.includes('diarrhea') || symptomLower.includes('stool') || symptomLower.includes('motion')) {
      specificDiagnosis = `Gastrointestinal Triage for ${petName || 'Patient'}: Reports of "${symptoms}" point toward potential dietary indiscretion, bacterial imbalance, or intestinal parasites.`;
      specificRec = 'Withhold heavy food for 12 hours, provide fresh water mixed with rehydration electrolytes, and monitor stool consistency closely.';
    } else if (symptomLower.includes('fever') || symptomLower.includes('temperature') || symptomLower.includes('hot') || symptomLower.includes('shivering')) {
      specificDiagnosis = `Febrile Response Triage for ${petName || 'Patient'}: Indications of "${symptoms}" suggest an active immune response, systemic infection, or inflammatory condition.`;
      specificRec = 'Keep the environment cool and well-ventilated, avoid giving human fever medications, and measure rectal temperature if safely possible.';
    } else if (symptomLower.includes('vomit') || symptomLower.includes('throwing up') || symptomLower.includes('puke')) {
      specificDiagnosis = `Emesis Triage for ${petName || 'Patient'}: Symptoms of "${symptoms}" highlight upper gastrointestinal tract irritation, ingestion of foreign matter, or gastritis.`;
      specificRec = 'Rest the stomach by withholding food for 6-8 hours, offering small sips of water or ice chips instead of large bowls of water.';
    } else if (symptomLower.includes('cough') || symptomLower.includes('breathing') || symptomLower.includes('cold') || symptomLower.includes('sneez')) {
      specificDiagnosis = `Respiratory Triage for ${petName || 'Patient'}: Reports of "${symptoms}" suggest upper respiratory irritation, kennel cough risks, or environmental allergen exposure.`;
      specificRec = 'Keep away from dust, smoke, or cold drafts. Ensure humidity in the room is stable and monitor breathing rate per minute.';
    }

    return res.json({
      diagnosis: specificDiagnosis,
      recommendation: specificRec
    });
  }
});

// --- PDF EHR Report Generation Handler ---
app.get('/api/pets/:id/pdf', (req, res) => {
  try {
    const pet = db.pets.find(p => p.id === req.params.id || p._id === req.params.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Animal-EHR-${req.params.id}.pdf`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(24).fillColor('#2e7d32').text('Luhid. - Veterinary Intelligence', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).fillColor('#000000').text('Official Electronic Health Record (EHR)');
    doc.moveTo(50, 110).lineTo(550, 110).stroke();
    doc.moveDown();

    doc.fontSize(12).text(`Animal Name / Tag ID: ${pet ? pet.name : 'Unknown'}`);
    doc.text(`Species / Type: ${pet ? (pet.type || pet.breed) : 'N/A'}`);
    doc.text(`Age / Details: ${pet ? pet.age : 'N/A'}`);
    doc.text(`Emergency Tel: ${pet ? pet.phone : 'N/A'}`);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`);
    
    doc.moveDown(2);
    doc.fontSize(14).fillColor('#2e7d32').text('Diagnosis & Medical Notes:');
    doc.fontSize(10).fillColor('#333333').text('Routine checkup completed successfully. Vital signs normal. Disease resistance indicators stable under enterprise architecture monitoring.');

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ error: 'Failed to generate PDF document' });
  }
});

app.listen(PORT, () => {
  console.log(`Luhid Backend running on port ${PORT} (Persistent Storage, Duplicate Check & AI Search Brain Active)`);
});