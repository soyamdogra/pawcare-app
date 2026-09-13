const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini API client (ensure GEMINI_API_KEY is set in your environment variables)
const ai = new GoogleGenAI();

// In-memory or database mock storage simulating user isolation
// In production, replace this with MongoDB/PostgreSQL and filter by email
const database = {
  // format: "user@gmail.com": [ { disease, diagnosis, timestamp } ]
};

// 1. Endpoint to get user-specific diagnosis history
app.get('/api/history', (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(401).json({ error: "Unauthorized: Missing user email" });
  }

  // Fetch only records belonging strictly to this email
  const userRecords = database[userEmail] || [];
  return res.status(200).json(userRecords);
});

// 2. Endpoint to generate a dynamic AI diagnosis and save it per user email
app.post('/api/diagnose', async (req, res) => {
  const { email, diseaseName, symptoms } = req.body;

  if (!email || !diseaseName) {
    return res.status(400).json({ error: "Email and disease name are required" });
  }

  try {
    const prompt = `
      Act as an expert medical AI assistant. Provide a unique, detailed diagnosis for the condition: "${diseaseName}" with symptoms: "${symptoms || 'None specified'}".
      Your response must include:
      1. Tailored Prescription & Medical Guidance
      2. Specific Home Remedies
      3. Clear Do's and Don'ts list
      Do not give a generic response; customize it completely for this specific condition.
    `;

    // Call Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4, // Balanced for medical accuracy and context variation
      },
    });

    const aiDiagnosisResult = response.text();

    // Save record isolated to this specific user's email
    if (!database[email]) {
      database[email] = [];
    }

    const newRecord = {
      id: Date.now(),
      diseaseName,
      symptoms,
      diagnosis: aiDiagnosisResult,
      createdAt: new Date().toISOString()
    };

    database[email].push(newRecord);

    return res.status(200).json({
      success: true,
      message: "Diagnosis generated and saved successfully",
      data: newRecord
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate diagnosis from AI" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});