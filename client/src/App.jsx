import React, { useState, useEffect } from 'react';

const API_URL ="https://luhid-a3f4ayh6fdbjgzdn.eastasia-01.azurewebsites.net"; 

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const animalPresets = {
    Cattle: [
      { breed: 'Gir Dairy', icon: '🐄', desc: 'Renowned for high disease resistance and A2 milk production.' },
      { breed: 'Holstein Friesian', icon: '🐄', desc: 'High-yield dairy cattle optimized for professional farms.' },
      { breed: 'Jersey Cow', icon: '🐄', desc: 'Compact dairy breed with high butterfat milk content.' }
    ],
    Sheep: [
      { breed: 'Dorper Sheep', icon: '🐑', desc: 'Hardy mutton breed with exceptional adaptability.' },
      { breed: 'Merino Sheep', icon: '🐑', desc: 'World-renowned wool-producing breed with soft fleece.' }
    ],
    Swine: [
      { breed: 'Large White', icon: '🐖', desc: 'Commercial pig breed known for high fertility.' },
      { breed: 'Duroc Pig', icon: '🐖', desc: 'Robust reddish-brown breed favored for fast growth.' }
    ],
    Poultry: [
      { breed: 'Rhode Island Red', icon: '🐓', desc: 'Versatile dual-purpose chicken breed for brown eggs.' },
      { breed: 'Broiler Cobb 500', icon: '🐓', desc: 'High-yield meat poultry breed optimized for efficiency.' }
    ],
    Dogs: [
      { breed: 'German Shepherd', icon: '🐕', desc: 'Loyal, intelligent working dog ideal for herd guarding.' },
      { breed: 'Golden Retriever', icon: '🐕', desc: 'Friendly, intelligent family and companion pet.' },
      { breed: 'Indian Pariah (Indie)', icon: '🐕', desc: 'Extremely resilient local breed with low maintenance needs.' }
    ],
    Goats: [
      { breed: 'Boer Goat', icon: '🐐', desc: 'Premier meat and dairy goat breed with strong build.' },
      { breed: 'Alpine Dairy', icon: '🐐', desc: 'Hardy dairy goat known for consistent milk production.' }
    ]
  };

  const [selectedCategory, setSelectedCategory] = useState('Cattle');
  const [selectedBreedObj, setSelectedBreedObj] = useState(animalPresets['Cattle'][0]);

  const [pets, setPets] = useState([]);
  const [newPetName, setNewPetName] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetPhone, setNewPetPhone] = useState('');

  const doctorsList = [
    { id: 1, name: 'Dr. Ananya Sharma', specialty: 'Senior Veterinary Surgeon', exp: '10 yrs exp', phone: '+91 98765 43210', status: 'Available' },
    { id: 2, name: 'Dr. Rajesh Verma', specialty: 'Livestock & Herd Specialist', exp: '14 yrs exp', phone: '+91 98123 45678', status: 'On Field' },
    { id: 3, name: 'Dr. Ramesh Patel', specialty: 'Avian & Exotic Pet Care', exp: '9 yrs exp', phone: '+91 99887 76655', status: 'Available Today' },
    { id: 4, name: 'Dr. Sneha Kulkarni', specialty: 'Veterinary Internal Medicine', exp: '15 yrs exp', phone: '+91 91234 56789', status: 'In Surgery' },
    { id: 5, name: 'Dr. Vikram Singh', specialty: 'Equine & Large Animal Specialist', exp: '11 yrs exp', phone: '+91 99112 23344', status: 'Available Today' }
  ];

  const [prescriptions, setPrescriptions] = useState([]);
  const [rxPet, setRxPet] = useState('');
  const [rxMedication, setRxMedication] = useState('');
  const [rxDosage, setRxDosage] = useState('');

  const [medicalLogs, setMedicalLogs] = useState([]);
  const [logPet, setLogPet] = useState('');
  const [logTitle, setLogTitle] = useState('');

  const [expenses, setExpenses] = useState([]);
  const [expPet, setExpPet] = useState('');
  const [expItem, setExpItem] = useState('');
  const [expAmount, setExpAmount] = useState('');

  const [reminders, setReminders] = useState([]);
  const [remPet, setRemPet] = useState('');
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState('');

  const [selectedPetForAnalysis, setSelectedPetForAnalysis] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [aiReport, setAiReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // AI Search Engine States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const [showSosModal, setShowSosModal] = useState(false);
  const [qrModalPet, setQrModalPet] = useState(null);
  const [vetScanData, setVetScanData] = useState(null);
  const [isLoadingScan, setIsLoadingScan] = useState(false);

  useEffect(() => {
    const currentUserId = user?.id || user?._id;
    if (user && currentUserId) {
      fetch(`${API_URL}/api/pets/${currentUserId}`).then(res => res.json()).then(data => setPets(data)).catch(err => console.error(err));
      fetch(`${API_URL}/api/reminders/${currentUserId}`).then(res => res.json()).then(data => setReminders(data)).catch(err => console.error(err));
      fetch(`${API_URL}/api/medical-logs/${currentUserId}`).then(res => res.json()).then(data => setMedicalLogs(data)).catch(err => console.error(err));
      fetch(`${API_URL}/api/prescriptions/${currentUserId}`).then(res => res.json()).then(data => setPrescriptions(data)).catch(err => console.error(err));
      fetch(`${API_URL}/api/expenses/${currentUserId}`).then(res => res.json()).then(data => setExpenses(data)).catch(err => console.error(err));
    } else {
      setPets([]);
      setReminders([]);
      setMedicalLogs([]);
      setPrescriptions([]);
      setExpenses([]);
      setAiReport(null);
      setSelectedPetForAnalysis('');
      setSymptomsInput('');
      setSearchResult('');
      setSearchQuery('');
    }
  }, [user]);

  const handleVetScan = async (petId) => {
    setIsLoadingScan(true);
    try {
      const res = await fetch(`${API_URL}/api/pets/scan/${petId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch pet scan details');
      setVetScanData(data);
    } catch (err) {
      console.error(err);
      alert('Could not load scanned pet profile.');
    } finally {
      setIsLoadingScan(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');

      if (isLogin) {
        setUser(data.user);
      } else {
        setMessage('Registration successful! Please login.');
        setTimeout(() => setIsLogin(true), 1200);
      }
    } catch (err) {
      setError(err.message || 'Network Error / Server is starting up');
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!newPetName || !newPetAge || !newPetPhone) return;
    
    const currentUserId = user?.id || user?._id;
    if (!currentUserId) return;

    try {
      const response = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, 
          name: newPetName, 
          type: selectedCategory, 
          breed: selectedBreedObj.breed, 
          age: newPetAge, 
          phone: newPetPhone, 
          image: selectedBreedObj.icon 
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add pet');
      setPets([...pets, data]);
      setNewPetName(''); setNewPetAge(''); setNewPetPhone('');
    } catch (err) {
      alert(err.message || 'Error adding pet');
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to remove this animal profile?')) return;
    try {
      await fetch(`${API_URL}/api/pets/${petId}`, { method: 'DELETE' });
      setPets(pets.filter(p => p.id !== petId && p._id !== petId));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!rxPet || !rxMedication || !rxDosage) return;
    const currentUserId = user?.id || user?._id;
    try {
      const response = await fetch(`${API_URL}/api/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, petName: rxPet, doctorName: 'Dr. Ananya Sharma', medication: rxMedication, dosage: rxDosage, duration: '7 days', dateIssued: new Date().toISOString().split('T')[0] 
        })
      });
      const data = await response.json();
      setPrescriptions([...prescriptions, data]);
      setRxMedication(''); setRxDosage('');
    } catch (err) { console.error(err); }
  };

  const handleAddMedicalLog = async (e) => {
    e.preventDefault();
    if (!logPet || !logTitle) return;
    const currentUserId = user?.id || user?._id;
    try {
      const response = await fetch(`${API_URL}/api/medical-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, petName: logPet, title: logTitle, category: 'Routine Check', notes: 'Checked normal vitals', date: new Date().toISOString().split('T')[0] 
        })
      });
      const data = await response.json();
      setMedicalLogs([...medicalLogs, data]);
      setLogTitle('');
    } catch (err) { console.error(err); }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expPet || !expItem || !expAmount) return;
    const currentUserId = user?.id || user?._id;
    try {
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, petName: expPet, item: expItem, amount: parseFloat(expAmount), date: new Date().toISOString().split('T')[0] 
        })
      });
      const data = await response.json();
      setExpenses([...expenses, data]);
      setExpItem(''); setExpAmount('');
    } catch (err) { console.error(err); }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!remPet || !remTitle || !remDate) return;
    const currentUserId = user?.id || user?._id;
    try {
      const response = await fetch(`${API_URL}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUserId, petName: remPet, title: remTitle, dueDate: remDate 
        })
      });
      const data = await response.json();
      setReminders([...reminders, data]);
      setRemTitle(''); setRemDate('');
    } catch (err) { console.error(err); }
  };

  const handleAnalyzeHealth = async (e) => {
    e.preventDefault();
    if (!selectedPetForAnalysis || !symptomsInput) return;
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const response = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomsInput, petName: selectedPetForAnalysis })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process AI diagnosis');
      
      setAiReport({
        petName: selectedPetForAnalysis,
        summary: data.diagnosis,
        recommendation: data.recommendation
      });
    } catch (err) {
      console.error('AI Diagnosis Error:', err);
      setAiReport({
        petName: selectedPetForAnalysis,
        summary: `Error processing diagnosis: ${err.message}`,
        recommendation: 'Please verify server configuration.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // AI Knowledge Search Handler
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingAI(true);
    setSearchResult('');
    const currentUserId = user?.id || user?._id;
    try {
      const response = await fetch(`${API_URL}/api/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, query: searchQuery })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to query AI search engine');
      setSearchResult(data.answer || 'No insights returned.');
    } catch (err) {
      console.error('AI Search Error:', err);
      setSearchResult('Error connecting to Luhid AI Brain.');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSymptomsInput(prev => prev ? `${prev} ${speechToText}` : speechToText);
    };

    recognition.start();
  };

  const downloadPdf = async (petId) => {
    try {
      const response = await fetch(`${API_URL}/api/pets/${petId}/pdf`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Animal-EHR-${petId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to download PDF.');
    }
  };

  const LuhidLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 15px rgba(16,185,129,0.3)' }}>
        <span style={{ fontSize: '22px' }}>🍃</span>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>Luhid<span style={{ color: '#10b981' }}>.</span></h1>
        <p style={{ margin: 0, fontSize: '10px', color: '#047857', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Veterinary Intelligence</p>
      </div>
    </div>
  );

  if (user) {
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a', paddingBottom: '60px' }}>
        <header style={{ background: '#ffffff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <LuhidLogo />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => setShowSosModal(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.25)', fontSize: '13px' }}>
              🚨 24/7 Vet SOS
            </button>
            <div style={{ fontSize: '13px', color: '#334155', background: '#f1f5f9', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', border: '1px solid #cbd5e1' }}>
              👤 {user.name || user.email}
            </div>
            <button onClick={() => setUser(null)} style={{ padding: '8px 16px', background: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Log Out
            </button>
          </div>
        </header>

        <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gap: '30px' }}>
          
          {/* AI Search Engine Brain Component */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#047857', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
              🧠 Luhid AI Knowledge Search Engine
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>Ask anything about your livestock, medications, expenses, or care schedules using natural language.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="e.g., 'Do I have any cattle due for check-ups?' or 'Summarize expenses for my pets'..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
              <button 
                onClick={handleAISearch}
                disabled={isSearchingAI}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                {isSearchingAI ? 'Thinking...' : 'Search & Recommend'}
              </button>
            </div>

            {searchResult && (
              <div style={{ marginTop: '20px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
                <strong style={{ color: '#047857' }}>AI Brain Insights & Recommendations:</strong>
                <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{searchResult}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #10b981' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Livestock / Pets</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginTop: '6px' }}>{pets.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #3b82f6' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Prescriptions</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginTop: '6px' }}>{prescriptions.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #f59e0b' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Health Reminders</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginTop: '6px' }}>{reminders.length}</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '20px' }}>🐾 Register Animal with Pictorial Breed Selector</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '8px' }}>Select Species Category:</label>
                <select value={selectedCategory} onChange={e => {
                  setSelectedCategory(e.target.value);
                  setSelectedBreedObj(animalPresets[e.target.value][0]);
                }} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: '600', color: '#0f172a', outline: 'none' }}>
                  {Object.keys(animalPresets).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '8px' }}>Select Breed Type:</label>
                <select value={selectedBreedObj.breed} onChange={e => {
                  const found = animalPresets[selectedCategory].find(b => b.breed === e.target.value);
                  if (found) setSelectedBreedObj(found);
                }} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: '600', color: '#0f172a', outline: 'none' }}>
                  {animalPresets[selectedCategory].map(b => <option key={b.breed} value={b.breed}>{b.breed}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', borderRadius: '16px', border: '1px solid #a7f3d0', marginBottom: '25px' }}>
              <div style={{ width: '64px', height: '64px', background: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                {selectedBreedObj.icon}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#065f46' }}>{selectedBreedObj.breed}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#047857', fontWeight: '500' }}>{selectedBreedObj.desc}</p>
              </div>
            </div>

            <form onSubmit={handleAddPet} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <input type="text" placeholder="Animal Name / Tag ID" value={newPetName} onChange={e => setNewPetName(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
              <input type="text" placeholder="Age / Details (e.g. 3 Years)" value={newPetAge} onChange={e => setNewPetAge(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
              <input type="text" placeholder="Emergency Owner Phone" value={newPetPhone} onChange={e => setNewPetPhone(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
              <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>Register Animal</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '25px' }}>
              {pets.map(pet => (
                <div key={pet.id || pet._id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', background: '#ffffff', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                    {pet.image && !pet.image.startsWith('data:') ? pet.image : '🐄'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', color: '#0f172a' }}>{pet.name}</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>{pet.breed} • Age: {pet.age}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleVetScan(pet.id || pet._id)} disabled={isLoadingScan} style={{ padding: '5px 10px', background: '#047857', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🩺 Vet Scan</button>
                      <button onClick={() => setQrModalPet(pet)} style={{ padding: '5px 10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>QR Pass</button>
                      <button onClick={() => downloadPdf(pet.id || pet._id)} style={{ padding: '5px 10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>PDF</button>
                      <button onClick={() => handleDeletePet(pet.id || pet._id)} style={{ padding: '5px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#0f172a' }}>🤖 AI Health Analyzer (Gemini Engine)</h3>
              <button 
                type="button" 
                onClick={startVoiceInput} 
                style={{ background: isListening ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                {isListening ? '🎙️ Listening...' : '🎙️ Speak Symptoms'}
              </button>
            </div>
            <form onSubmit={handleAnalyzeHealth} style={{ display: 'grid', gap: '15px' }}>
              <select value={selectedPetForAnalysis} onChange={e => setSelectedPetForAnalysis(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}>
                <option value="">Select Animal for Triage</option>
                {pets.map(p => <option key={p.id || p._id} value={p.name}>{p.name}</option>)}
              </select>
              <textarea placeholder="Type symptoms or click 'Speak Symptoms' to use your voice..." value={symptomsInput} onChange={e => setSymptomsInput(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', minHeight: '80px', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
              <button type="submit" disabled={isAnalyzing} style={{ padding: '12px', background: 'linear-gradient(135deg, #2563eb 100%, #1d4ed8 0%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
                {isAnalyzing ? 'Analyzing Vitals...' : 'Run AI Triage Diagnosis'}
              </button>
            </form>
            {aiReport && (
              <div style={{ marginTop: '20px', padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#166534' }}>Diagnostic Report for {aiReport.petName}</h4>
                <p style={{ margin: '4px 0', color: '#15803d' }}>{aiReport.summary}</p>
                <p style={{ margin: '6px 0 0 0', color: '#334155' }}><strong>Recommendation:</strong> {aiReport.recommendation}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0 }}>💊 Prescriptions Manager</h3>
              <form onSubmit={handleAddPrescription} style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
                <select value={rxPet} onChange={e => setRxPet(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}>
                  <option value="">Select Animal</option>
                  {pets.map(p => <option key={p.id || p._id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Medication Name" value={rxMedication} onChange={e => setRxMedication(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <input type="text" placeholder="Dosage (e.g. 2 tablets daily)" value={rxDosage} onChange={e => setRxDosage(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <button type="submit" style={{ padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Add Prescription</button>
              </form>
              <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                {prescriptions.map(rx => (
                  <div key={rx.id || rx._id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                    <strong>{rx.petName}</strong>: {rx.medication} ({rx.dosage})
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0 }}>📋 Medical Logs & Reports</h3>
              <form onSubmit={handleAddMedicalLog} style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
                <select value={logPet} onChange={e => setLogPet(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}>
                  <option value="">Select Animal</option>
                  {pets.map(p => <option key={p.id || p._id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Report Title (e.g. Vaccination Check)" value={logTitle} onChange={e => setLogTitle(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <button type="submit" style={{ padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Save Medical Log</button>
              </form>
              <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                {medicalLogs.map(log => (
                  <div key={log.id || log._id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                    <strong>{log.petName}</strong>: {log.title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0 }}>💰 Expense Tracker</h3>
              <form onSubmit={handleAddExpense} style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
                <select value={expPet} onChange={e => setExpPet(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}>
                  <option value="">Select Animal</option>
                  {pets.map(p => <option key={p.id || p._id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Item (e.g. Feed, Supplement)" value={expItem} onChange={e => setExpItem(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <input type="number" placeholder="Amount ($)" value={expAmount} onChange={e => setExpAmount(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <button type="submit" style={{ padding: '12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Add Expense</button>
              </form>
              <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                {expenses.map(ex => (
                  <div key={ex.id || ex._id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>{ex.petName}: {ex.item}</span>
                    <strong style={{ color: '#d97706' }}>${ex.amount}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0 }}>⏰ Health Reminders</h3>
              <form onSubmit={handleAddReminder} style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
                <select value={remPet} onChange={e => setRemPet(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }}>
                  <option value="">Select Animal</option>
                  {pets.map(p => <option key={p.id || p._id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Reminder Title (e.g. Deworming)" value={remTitle} onChange={e => setRemTitle(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <input type="date" value={remDate} onChange={e => setRemDate(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
                <button type="submit" style={{ padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Set Reminder</button>
              </form>
              <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                {reminders.map(rem => (
                  <div key={rem.id || rem._id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>{rem.petName}: {rem.title}</span>
                    <span style={{ color: '#7c3aed' }}>{rem.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {showSosModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '35px', borderRadius: '20px', width: '400px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h2 style={{ color: '#dc2626', marginTop: 0 }}>🚨 24/7 Vet SOS Emergency</h2>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Immediate On-Call Helpline Contacts:</p>
              {doctorsList.map(doc => (
                <div key={doc.id} style={{ margin: '10px 0', padding: '12px', background: '#f8fafc', borderRadius: '10px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                  <strong>{doc.name}</strong><br/>
                  <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{doc.phone}</span>
                </div>
              ))}
              <button onClick={() => setShowSosModal(false)} style={{ marginTop: '20px', padding: '10px 24px', background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
            </div>
          </div>
        )}

        {qrModalPet && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '35px', borderRadius: '20px', width: '380px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginTop: 0, color: '#0f172a' }}>Smart Vet & Owner QR Tag</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 15px 0' }}>Animal: <strong>{qrModalPet.name}</strong> ({qrModalPet.breed})</p>
              
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${API_URL}/api/pets/scan/${qrModalPet.id || qrModalPet._id}`)}`} 
                  alt="Scannable Pet Profile QR Tag" 
                  style={{ width: '180px', height: '180px', display: 'block', margin: '0 auto' }} 
                />
              </div>

              <p style={{ fontSize: '12px', color: '#047857', fontWeight: 'bold', marginTop: '12px' }}>📱 Scanning loads full profile & owner contacts</p>
              
              <button onClick={() => handleVetScan(qrModalPet.id || qrModalPet._id)} style={{ display: 'block', width: '100%', marginTop: '10px', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                Preview Scanned Profile View
              </button>

              <button onClick={() => setQrModalPet(null)} style={{ marginTop: '15px', padding: '8px 20px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
            </div>
          </div>
        )}

        {vetScanData && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', width: '480px', textAlign: 'left', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '2px solid #047857', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Scanned EHR & Owner Details</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>ID: #{vetScanData.pet.id}</span>
              </div>
              <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>🩺 {vetScanData.pet.name}</h2>
              <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#64748b' }}>Breed: {vetScanData.pet.type} ({vetScanData.pet.breed}) • Age: {vetScanData.pet.age}</p>
              
              <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#166534' }}>👤 Owner Contact Details</h4>
                <p style={{ margin: '2px 0', fontSize: '13px', color: '#15803d' }}><strong>Name:</strong> {vetScanData.ownerDetails.name}</p>
                <p style={{ margin: '2px 0', fontSize: '13px', color: '#15803d' }}><strong>Email:</strong> {vetScanData.ownerDetails.email}</p>
                <p style={{ margin: '6px 0 0 0', fontSize: '14px' }}>
                  📞 <strong>Emergency Phone:</strong> <a href={`tel:${vetScanData.ownerDetails.emergencyPhone}`} style={{ color: '#047857', fontWeight: 'bold' }}>{vetScanData.ownerDetails.emergencyPhone}</a>
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#0f172a' }}>⚡ Vaccination & Medical History</h4>
                {vetScanData.vaccinationHistory.length > 0 ? (
                  vetScanData.vaccinationHistory.map((v, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#334155', marginBottom: '4px' }}>• {v.title || v.notes} ({v.date || 'Recent'})</div>
                  ))
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No active vaccination logs recorded yet.</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => downloadPdf(vetScanData.pet.id)} style={{ flex: 1, padding: '10px', background: '#047857', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Download Full EHR PDF</button>
                <button onClick={() => setVetScanData(null)} style={{ padding: '10px 20px', background: '#475569', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', width: '380px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <LuhidLogo />
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: '#ef4444', background: '#fee2e2', padding: '10px', borderRadius: '8px', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
          {message && <p style={{ color: '#10b981', background: '#dcfce7', padding: '10px', borderRadius: '8px', fontSize: '13px', textAlign: 'center' }}>{message}</p>}
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px 16px', margin: '8px 0', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
          )}
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', margin: '8px 0', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', margin: '8px 0 16px 0', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff', color: '#0f172a', outline: 'none' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)', fontSize: '14px' }}>
            {isLogin ? 'Sign In to Luhid' : 'Register Account'}
          </button>
          <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#2563eb', fontSize: '13px', fontWeight: '600' }}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </p>
        </form>
      </div>
    </div>
  );
}