import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const SPECIES_BREEDS = {
  Dog: ["Golden Retriever", "German Shepherd", "Labrador Retriever", "Pug", "Beagle", "Bulldog", "Poodle", "Rottweiler", "Shih Tzu", "Indie / Local Breed"],
  Cat: ["Persian", "Siamese", "Maine Coon", "Bengal", "British Shorthair", "Ragdoll", "Indie / Domestic Shorthair"],
  Bird: ["Budgerigar (Budgie)", "Cockatiel", "Lovebird", "Macaw", "African Grey Parrot", "Canary"],
  Rabbit: ["Holland Lop", "Netherland Dwarf", "Flemish Giant", "Mini Rex", "Lionhead"],
  Hamster: ["Syrian Hamster", "Dwarf Campbell", "Roborovski", "Winter White"]
};

const PRESET_PHOTOS = {
  Dog: [
    { label: "Golden Retriever", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80" },
    { label: "German Shepherd", url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&auto=format&fit=crop&q=80" },
    { label: "Labrador", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80" }
  ],
  Cat: [
    { label: "Persian Cat", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80" },
    { label: "Cute Kitten", url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&auto=format&fit=crop&q=80" }
  ],
  Bird: [{ label: "Parrot", url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&auto=format&fit=crop&q=80" }],
  Rabbit: [{ label: "Bunny", url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&auto=format&fit=crop&q=80" }],
  Hamster: [{ label: "Hamster", url: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&auto=format&fit=crop&q=80" }]
};

const DOCTORS_LIST = [
  { id: 1, name: "Dr. Rajesh Sharma", spec: "Canine Specialist & Surgeon", fee: 30, rating: "4.9 ⭐", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80" },
  { id: 2, name: "Dr. Ananya Roy", spec: "Feline & Exotics Specialist", fee: 35, rating: "4.8 ⭐", photo: "https://images.unsplash.com/photo-1594824813566-88855ce78905?w=150&auto=format&fit=crop&q=80" },
  { id: 3, name: "Dr. Vikram Verma", spec: "Veterinary Nutritionist", fee: 40, rating: "4.9 ⭐", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80" },
  { id: 4, name: "Dr. Priya Nair", spec: "Avian & Small Mammals Vet", fee: 25, rating: "4.7 ⭐", photo: "https://images.unsplash.com/photo-1594824813566-88855ce78905?w=150&auto=format&fit=crop&q=80" },
  { id: 5, name: "Dr. Amit Malhotra", spec: "Emergency & Critical Care Vet", fee: 50, rating: "5.0 ⭐", photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80" },
  { id: 6, name: "Dr. Neha Kapoor", spec: "Dermatology & Allergy Specialist", fee: 35, rating: "4.8 ⭐", photo: "https://images.unsplash.com/photo-1527613426441-2da17477ef66?w=150&auto=format&fit=crop&q=80" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [user, setUser] = useState(null);

  const [regData, setRegData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [authMsg, setAuthMsg] = useState('');

  const [pets, setPets] = useState([]);
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'Dog',
    breed: SPECIES_BREEDS.Dog[0],
    age: '',
    weight: '10',
    photo_url: PRESET_PHOTOS.Dog[0].url
  });

  const [symptoms, setSymptoms] = useState('');
  const [aiResult, setAiResult] = useState(null);
  
  const [vaccineLogs, setVaccineLogs] = useState({});
  const [newVaccine, setNewVaccine] = useState({ petId: '', vaccineName: '', date: '' });

  const [appointments, setAppointments] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptMsg, setApptMsg] = useState('');
  
  const [activeVideoRoom, setActiveVideoRoom] = useState(null);
  const [behaviorInput, setBehaviorInput] = useState('');
  const [behaviorResult, setBehaviorResult] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [streakCount] = useState(7);

  const [forumPosts, setForumPosts] = useState([
    { id: 1, author: "Sarah M.", title: "Best food for sensitive puppy stomachs?", replies: 3 },
    { id: 2, author: "Dr. Rajesh Sharma", title: "Monsoon Tick Prevention Guidelines", replies: 12 }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');

  useEffect(() => {
    if (user) {
      fetchPets();
      fetchAppointments();
    }
  }, [user]);

  const handleSpeciesChange = (species) => {
    const defaultBreed = SPECIES_BREEDS[species][0];
    const defaultPhoto = PRESET_PHOTOS[species][0]?.url || PRESET_PHOTOS.Dog[0].url;
    setPetForm({ ...petForm, species, breed: defaultBreed, photo_url: defaultPhoto });
  };

  const fetchPets = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pets/owner/${user.id}`);
      setPets(res.data);
      if (res.data.length > 0 && !selectedPetId) setSelectedPetId(res.data[0].id);
    } catch (err) {
      console.error('Error fetching pets:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/appointments/user/${user.id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', regData);
      setAuthMsg(res.data.message);
      setActiveTab('login');
    } catch (err) {
      setAuthMsg(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', loginData);
      setUser(res.data.user);
      setAuthMsg('');
    } catch (err) {
      setAuthMsg(err.response?.data?.error || 'Invalid credentials');
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/pets', { ...petForm, owner_id: user.id });
      setPetForm({ name: '', species: 'Dog', breed: SPECIES_BREEDS.Dog[0], age: '', weight: '10', photo_url: PRESET_PHOTOS.Dog[0].url });
      fetchPets();
    } catch (err) {
      alert('Failed to add pet');
    }
  };

  const handleAIAnalysis = (e) => {
    e.preventDefault();
    if (!symptoms) return;
    setAiResult({
      condition: symptoms.toLowerCase().includes('vomit') ? "Gastroenteritis / Upset Stomach" : "Localized Skin Irritation",
      advice: "Maintain hydration and feed bland diet (boiled chicken & rice) for 24 hours.",
      remedies: "Electrolytes & Mild Probiotics",
      warning: "⚠️ AI Preliminary triage report. Consult a certified veterinarian."
    });
  };

  const handleTranslateBehavior = (e) => {
    e.preventDefault();
    const query = behaviorInput.toLowerCase();
    let emotion = "Playful & Happy 🐾";
    let meaning = "Your pet is seeking active engagement or treats.";
    if (query.includes('whine') || query.includes('tail tucked')) {
      emotion = "Anxious or Stressed 😰";
      meaning = "Provide a safe, quiet zone away from external disturbances.";
    }
    setBehaviorResult({ emotion, meaning });
  };

  const downloadPrescriptionPDF = () => {
    if (!aiResult) return;
    const doc = new jsPDF();
    doc.setFillColor(13, 148, 136);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("PawCare Enterprise - Medical Prescription", 15, 20);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.text(`Owner: ${user.name} | Date: ${new Date().toLocaleDateString()}`, 15, 45);
    doc.text(`Condition: ${aiResult.condition}`, 15, 58);
    doc.text(`Advice: ${aiResult.advice}`, 15, 72);
    doc.save("PawCare_Prescription.pdf");
  };

  const downloadPetPassportPDF = (pet) => {
    const doc = new jsPDF();
    doc.setFillColor(13, 148, 136);
    doc.rect(0, 0, 210, 32, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Official Digital Pet Passport", 15, 21);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text(`Pet Name: ${pet.name}`, 15, 48);
    doc.text(`Species & Breed: ${pet.species} - ${pet.breed}`, 15, 58);
    doc.text(`Age: ${pet.age || 'N/A'} Years | Weight: ${pet.weight || 'N/A'} kg`, 15, 68);

    doc.save(`${pet.name}_Digital_Passport.pdf`);
  };

  const handleAddVaccine = (e) => {
    e.preventDefault();
    if (!newVaccine.petId || !newVaccine.vaccineName || !newVaccine.date) return;
    const petList = vaccineLogs[newVaccine.petId] || [];
    setVaccineLogs({ ...vaccineLogs, [newVaccine.petId]: [...petList, { name: newVaccine.vaccineName, date: newVaccine.date }] });
    setNewVaccine({ petId: '', vaccineName: '', date: '' });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPetId || !selectedDoctor || !apptDate) {
      alert('Please fill out all appointment fields.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/appointments', {
        user_id: user.id,
        pet_id: selectedPetId,
        doctor_name: selectedDoctor,
        appointment_date: apptDate,
        consultation_type: 'Secure Telehealth Video Room'
      });
      setApptMsg(res.data.message);
      fetchAppointments();
    } catch (err) {
      setApptMsg('Booking failed');
    }
  };

  const cardStyle = {
    background: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #E2E8F0'
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    transition: 'border-color 0.2s'
  };

  const btnPrimaryStyle = {
    background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
    color: '#FFF',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#334155' }}>
      
      {/* NAVBAR */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🌿🐾</span>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.3px' }}>PawCare Enterprise</h1>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ background: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
              🔥 {streakCount}-Day Care Streak
            </span>
            <button onClick={() => setUser(null)} style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Logout
            </button>
          </div>
        )}
      </header>

      {/* EMERGENCY SOS MODAL */}
      {sosActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '460px', background: '#FFFFFF', borderRadius: '20px', padding: '32px', textAlign: 'center', border: '1px solid #FEE2E2', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '42px' }}>🚨</span>
            <h2 style={{ color: '#DC2626', margin: '12px 0 6px 0', fontSize: '20px' }}>Emergency Dispatch Active</h2>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>Broadcasting live GPS coordinates to the nearest 24/7 veterinary trauma center...</p>
            <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', padding: '14px', borderRadius: '12px', margin: '18px 0', fontSize: '13px', color: '#991B1B', textAlign: 'left' }}>
              <strong>Nearest Facility:</strong> Metro 24/7 Animal ER (1.8 miles)<br/>
              <strong>Priority Hotline:</strong> +1 (800) 555-PAWS
            </div>
            <button onClick={() => setSosActive(false)} style={{ background: '#DC2626', color: '#FFF', border: 'none', padding: '11px 22px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', width: '100%' }}>
              Dismiss Emergency Alert
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE VIDEO ROOM MODAL */}
      {activeVideoRoom && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '760px', height: '420px', background: '#0F172A', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #334155', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: '44px', marginBottom: '8px' }}>📹🩺</span>
            <h2 style={{ color: '#FFF', margin: '0 0 6px 0', fontSize: '20px' }}>Secure Telehealth Session</h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Connected with {activeVideoRoom}</p>
            <div style={{ position: 'absolute', bottom: '24px' }}>
              <button onClick={() => setActiveVideoRoom(null)} style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BODY CONTAINER */}
      <div style={{ maxWidth: '1120px', margin: '32px auto', padding: '0 20px' }}>
        {!user ? (
          <div style={{ ...cardStyle, maxWidth: '400px', margin: '40px auto', padding: '36px' }}>
            <h2 style={{ color: '#0F172A', textAlign: 'center', margin: '0 0 20px 0', fontSize: '22px' }}>{activeTab === 'register' ? 'Create Account' : 'Welcome Back'}</h2>
            {authMsg && <p style={{ color: '#0D9488', textAlign: 'center', fontSize: '13px', background: '#F0FDFA', padding: '8px', borderRadius: '8px' }}>{authMsg}</p>}
            
            <form onSubmit={activeTab === 'register' ? handleRegister : handleLogin}>
              {activeTab === 'register' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input type="text" required style={inputStyle} value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="e.g. Alex Morgan" />
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input type="email" required style={inputStyle} value={activeTab === 'register' ? regData.email : loginData.email} onChange={e => activeTab === 'register' ? setRegData({...regData, email: e.target.value}) : setLoginData({...loginData, email: e.target.value})} placeholder="you@example.com" />
              </div>
              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Password</label>
                <input type="password" required style={inputStyle} value={activeTab === 'register' ? regData.password : loginData.password} onChange={e => activeTab === 'register' ? setRegData({...regData, password: e.target.value}) : setLoginData({...loginData, password: e.target.value})} placeholder="••••••••" />
              </div>
              <button type="submit" style={btnPrimaryStyle}>
                {activeTab === 'register' ? 'Register Account' : 'Secure Login'}
              </button>
            </form>
            
            <p onClick={() => setActiveTab(activeTab === 'register' ? 'login' : 'register')} style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', cursor: 'pointer', color: '#0D9488', fontWeight: '500' }}>
              {activeTab === 'register' ? 'Already registered? Login here' : "Need an account? Register"}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* EMERGENCY SOS BANNER */}
            <div style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)', border: '1px solid #FCA5A5', padding: '16px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', color: '#991B1B', fontWeight: '700' }}>🚨 Emergency SOS Hotline</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#7F1D1D' }}>Immediate dispatch routing for trauma and critical care.</p>
              </div>
              <button onClick={() => setSosActive(true)} style={{ background: '#DC2626', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 8px rgba(220,38,38,0.2)' }}>
                Trigger SOS 🚨
              </button>
            </div>

            {/* AI HEALTH TRIAGE */}
            <div style={cardStyle}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>🩺 AI Health Triage</h3>
              <form onSubmit={handleAIAnalysis}>
                <textarea rows="2" placeholder="Describe symptoms (e.g. vomiting, lethargy)..." value={symptoms} onChange={e => setSymptoms(e.target.value)} style={{ ...inputStyle, resize: 'none', marginBottom: '12px' }} />
                <button type="submit" style={btnPrimaryStyle}>Analyze Symptoms</button>
              </form>
              {aiResult && (
                <div style={{ marginTop: '16px', background: '#F0FDFA', padding: '14px', borderRadius: '12px', border: '1px solid #CCFBF1', fontSize: '13px' }}>
                  <p style={{ margin: '2px 0', color: '#134E4A' }}><strong>Condition:</strong> {aiResult.condition}</p>
                  <p style={{ margin: '6px 0 10px 0', color: '#134E4A' }}><strong>Advice:</strong> {aiResult.advice}</p>
                  <button onClick={downloadPrescriptionPDF} style={{ background: '#0D9488', color: '#FFF', border: 'none', padding: '7px 12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>
                    📥 Download Prescription PDF
                  </button>
                </div>
              )}
            </div>

            {/* AI PET BEHAVIOR TRANSLATOR */}
            <div style={cardStyle}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>🗣️ Behavior Translator</h3>
              <form onSubmit={handleTranslateBehavior}>
                <input type="text" placeholder="e.g. Whining near door, pacing..." value={behaviorInput} onChange={e => setBehaviorInput(e.target.value)} style={{ ...inputStyle, marginBottom: '12px' }} />
                <button type="submit" style={btnPrimaryStyle}>Translate Behavior</button>
              </form>
              {behaviorResult && (
                <div style={{ marginTop: '16px', background: '#FEFCE8', padding: '14px', borderRadius: '12px', border: '1px solid #FEF08A', fontSize: '13px', color: '#713F12' }}>
                  <p style={{ margin: '2px 0' }}><strong>Emotion:</strong> {behaviorResult.emotion}</p>
                  <p style={{ margin: '6px 0 0 0' }}><strong>Meaning:</strong> {behaviorResult.meaning}</p>
                </div>
              )}
            </div>

            {/* DIET & NUTRITION PLANNER */}
            <div style={cardStyle}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>🥗 AI Diet & Nutrition Planner</h3>
              {pets.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748B', margin: '8px 0 0 0' }}>Register a pet below to view customized calorie targets.</p>
              ) : (
                pets.map(p => (
                  <div key={p.id} style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#334155' }}>
                    <strong>{p.name} ({p.breed || p.species}):</strong>
                    <br />• Daily Target: ~{(p.weight ? p.weight * 30 + 70 : 450)} kcal
                    <br />• Safe Foods: Lean chicken, carrots, pumpkin.
                    <br />• ⚠️ Toxic: Chocolate, grapes, onions.
                  </div>
                ))
              )}
            </div>

            {/* TELEHEALTH VIDEO CONSULTATION */}
            <div style={cardStyle}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>👨‍⚕️ Telehealth Consultation</h3>
              {apptMsg && <p style={{ color: '#0D9488', fontSize: '12px', fontWeight: '600', margin: '0 0 8px 0' }}>{apptMsg}</p>}
              <form onSubmit={handleBookAppointment}>
                <select required value={selectedPetId} onChange={e => setSelectedPetId(e.target.value)} style={{ ...inputStyle, marginBottom: '10px' }}>
                  <option value="">-- Select Patient Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select required value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} style={{ ...inputStyle, marginBottom: '10px' }}>
                  <option value="">-- Select Specialist --</option>
                  {DOCTORS_LIST.map(d => <option key={d.id} value={d.name}>{d.name} (${d.fee})</option>)}
                </select>
                <input type="datetime-local" required value={apptDate} onChange={e => setApptDate(e.target.value)} style={{ ...inputStyle, marginBottom: '12px' }} />
                <button type="submit" style={btnPrimaryStyle}>Book & Pay Consultation</button>
              </form>
              {appointments.length > 0 && (
                <div style={{ marginTop: '12px', maxHeight: '70px', overflowY: 'auto' }}>
                  {appointments.map(a => (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', marginBottom: '4px', border: '1px solid #E2E8F0' }}>
                      <span>{a.doctor_name} ({a.pet_name})</span>
                      <button onClick={() => setActiveVideoRoom(a.doctor_name)} style={{ background: '#0D9488', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                        Join Room 📹
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VACCINATION & MED TRACKER */}
            <div style={cardStyle}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>💉 Vaccine & Med Tracker</h3>
              <form onSubmit={handleAddVaccine} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '12px' }}>
                <select required value={newVaccine.petId} style={{ ...inputStyle, fontSize: '12px' }} onChange={e => setNewVaccine({...newVaccine, petId: e.target.value})}>
                  <option value="">-- Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Vaccine Name" required style={{ ...inputStyle, fontSize: '12px' }} value={newVaccine.vaccineName} onChange={e => setNewVaccine({...newVaccine, vaccineName: e.target.value})} />
                <input type="date" required style={{ ...inputStyle, fontSize: '12px' }} value={newVaccine.date} onChange={e => setNewVaccine({...newVaccine, date: e.target.value})} />
                <button type="submit" style={{ background: '#0D9488', color: '#FFF', padding: '8px 14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>+ Log</button>
              </form>
              {pets.map(p => {
                const logs = vaccineLogs[p.id] || [];
                return (
                  <div key={p.id} style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                    <strong>{p.name}:</strong> {logs.length === 0 ? 'No shots recorded.' : logs.map(v => `${v.name} (${v.date})`).join(', ')}
                  </div>
                );
              })}
            </div>

            {/* COMMUNITY FORUM */}
            <div style={cardStyle}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>💬 Community Vet Q&A</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input type="text" placeholder="Ask community question..." value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} style={{ ...inputStyle, fontSize: '13px' }} />
                <button onClick={() => { if(newPostTitle) { setForumPosts([{ id: Date.now(), author: user.name, title: newPostTitle, replies: 0 }, ...forumPosts]); setNewPostTitle(''); }}} style={{ background: '#0D9488', color: '#FFF', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Ask</button>
              </div>
              <div style={{ maxHeight: '110px', overflowY: 'auto' }}>
                {forumPosts.map(f => (
                  <div key={f.id} style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', border: '1px solid #E2E8F0', fontSize: '12px' }}>
                    <strong>{f.author}:</strong> {f.title} <span style={{ float: 'right', color: '#0D9488' }}>{f.replies} replies</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REGISTER PETS & PASSPORT */}
            <div style={{ gridColumn: 'span 2', ...cardStyle }}>
              <h3 style={{ color: '#0F172A', marginTop: 0, fontSize: '16px', fontWeight: '700' }}>🐾 Pet Registry & Digital Passport</h3>
              <form onSubmit={handleAddPet} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '20px' }}>
                <input type="text" placeholder="Pet Name" required value={petForm.name} onChange={e => setPetForm({...petForm, name: e.target.value})} style={{ ...inputStyle, fontSize: '13px' }} />
                <select value={petForm.species} onChange={e => handleSpeciesChange(e.target.value)} style={{ ...inputStyle, fontSize: '13px' }}>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                </select>
                <select value={petForm.breed} onChange={e => setPetForm({...petForm, breed: e.target.value})} style={{ ...inputStyle, fontSize: '13px' }}>
                  {SPECIES_BREEDS[petForm.species].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <input type="number" placeholder="Age (yrs)" value={petForm.age} onChange={e => setPetForm({...petForm, age: e.target.value})} style={{ ...inputStyle, fontSize: '13px' }} />
                <input type="number" placeholder="Weight (kg)" value={petForm.weight} onChange={e => setPetForm({...petForm, weight: e.target.value})} style={{ ...inputStyle, fontSize: '13px' }} />
                <button type="submit" style={{ ...btnPrimaryStyle, padding: '11px 18px', width: 'auto' }}>+ Add Pet</button>
              </form>

              {pets.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {pets.map(p => (
                    <div key={p.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={p.photo_url} alt={p.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>{p.name} ({p.breed})</div>
                        <button onClick={() => downloadPetPassportPDF(p)} style={{ background: 'transparent', color: '#0D9488', border: '1px solid #0D9488', padding: '3px 10px', borderRadius: '6px', marginTop: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                          📄 Export Digital Passport PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}