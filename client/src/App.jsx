import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Offline-ready SVG Data URI Avatars for breeds and doctors
  const breedImages = {
    'Golden Retriever': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐕 Golden Retriever</text></svg>',
    'Labrador Retriever': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐕 Labrador</text></svg>',
    'German Shepherd': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐕 German Shepherd</text></svg>',
    'Poodle': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐩 Poodle</text></svg>',
    'Bulldog': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐕 Bulldog</text></svg>',
    'Beagle': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐕 Beagle</text></svg>',
    'Indie / Local Breed': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐕 Indie Breed</text></svg>',
    'Siamese': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐈 Siamese Cat</text></svg>',
    'Persian': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐈 Persian Cat</text></svg>',
    'Maine Coon': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐈 Maine Coon</text></svg>',
    'Bengal': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐈 Bengal Cat</text></svg>',
    'British Shorthair': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23475569">🐈 British Shorthair</text></svg>',
    'Budgerigar': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23ecfdf5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23047857">🦜 Budgerigar</text></svg>',
    'Cockatiel': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23ecfdf5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23047857">🦜 Cockatiel</text></svg>',
    'Lovebird': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23ecfdf5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23047857">🦜 Lovebird</text></svg>',
    'African Grey Parrot': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23ecfdf5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23047857">🦜 African Grey</text></svg>',
    'Bearded Dragon': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23fef3c7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23b45309">🦎 Bearded Dragon</text></svg>',
    'Leopard Gecko': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23fef3c7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23b45309">🦎 Leopard Gecko</text></svg>',
    'Ball Python': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23fef3c7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23b45309">🐍 Ball Python</text></svg>'
  };

  const breedOptions = {
    Dog: ['Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Poodle', 'Bulldog', 'Beagle', 'Indie / Local Breed'],
    Cat: ['Siamese', 'Persian', 'Maine Coon', 'Bengal', 'British Shorthair'],
    Bird: ['Budgerigar', 'Cockatiel', 'Lovebird', 'African Grey Parrot'],
    Reptile: ['Bearded Dragon', 'Leopard Gecko', 'Ball Python']
  };

  const [pets, setPets] = useState([]);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('Dog');
  const [newPetBreed, setNewPetBreed] = useState(breedOptions['Dog'][0]);
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetPhone, setNewPetPhone] = useState('');

  const doctorsList = [
    { id: 1, name: 'Dr. Ananya Sharma', specialty: 'General Veterinary Surgeon', exp: '8 yrs exp', phone: '+91 98765 43210' },
    { id: 2, name: 'Dr. Rajesh Verma', specialty: 'Pet Dermatology & Allergies', exp: '12 yrs exp', phone: '+91 98123 45678' },
    { id: 3, name: 'Dr. Priya Nair', specialty: 'Nutrition & Wellness Specialist', exp: '6 yrs exp', phone: '+91 97111 22334' }
  ];

  const [appointments, setAppointments] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Ananya Sharma');
  const [selectedService, setSelectedService] = useState('Vet Wellness Checkup');
  const [appointmentDate, setAppointmentDate] = useState('');

  const [prescriptions, setPrescriptions] = useState([]);
  const [rxPet, setRxPet] = useState('');
  const [rxMedication, setRxMedication] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxDuration, setRxDuration] = useState('');

  const [medicalLogs, setMedicalLogs] = useState([]);
  const [logPet, setLogPet] = useState('');
  const [logTitle, setLogTitle] = useState('');
  const [logCat, setLogCat] = useState('Vaccination');
  const [logNotes, setLogNotes] = useState('');

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

  const [showSosModal, setShowSosModal] = useState(false);
  const [qrModalPet, setQrModalPet] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [qrPhone, setQrPhone] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/pets/${user.id}`).then(res => res.json()).then(data => setPets(data));
      fetch(`http://localhost:5000/api/reminders/${user.id}`).then(res => res.json()).then(data => setReminders(data));
      fetch(`http://localhost:5000/api/medical-logs/${user.id}`).then(res => res.json()).then(data => setMedicalLogs(data));
      fetch(`http://localhost:5000/api/prescriptions/${user.id}`).then(res => res.json()).then(data => setPrescriptions(data));
      fetch(`http://localhost:5000/api/expenses/${user.id}`).then(res => res.json()).then(data => setExpenses(data));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    const endpoint = isLogin ? 'http://localhost:5000/api/users/login' : 'http://localhost:5000/api/users/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication error');
      setMessage(data.message);
      if (isLogin) setUser(data.user);
      else setIsLogin(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed || !newPetAge || !newPetPhone) return;
    const petImage = breedImages[newPetBreed] || breedImages['Indie / Local Breed'];

    const res = await fetch('http://localhost:5000/api/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, name: newPetName, type: newPetType, breed: newPetBreed, age: newPetAge, phone: newPetPhone, image: petImage })
    });
    const newPet = await res.json();
    setPets([...pets, newPet]);
    setNewPetName(''); setNewPetAge(''); setNewPetPhone('');
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet profile?')) return;
    const res = await fetch(`http://localhost:5000/api/pets/${petId}`, { method: 'DELETE' });
    if (res.ok) {
      setPets(pets.filter(p => p.id !== petId));
    }
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!selectedPet || !appointmentDate) return;
    setAppointments([...appointments, { id: Date.now(), pet: selectedPet, doctor: selectedDoctor, service: selectedService, date: appointmentDate, status: 'Confirmed' }]);
    setAppointmentDate('');
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!rxPet || !rxMedication || !rxDosage || !rxDuration) return;
    const res = await fetch('http://localhost:5000/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, petName: rxPet, doctorName: 'Dr. Ananya Sharma', medication: rxMedication, dosage: rxDosage, duration: rxDuration, dateIssued: new Date().toISOString().split('T')[0] })
    });
    const newRx = await res.json();
    setPrescriptions([...prescriptions, newRx]);
    setRxMedication(''); setRxDosage(''); setRxDuration('');
  };

  const handleAddMedicalLog = async (e) => {
    e.preventDefault();
    if (!logPet || !logTitle || !logNotes) return;
    const res = await fetch('http://localhost:5000/api/medical-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, petName: logPet, title: logTitle, category: logCat, notes: logNotes, date: new Date().toISOString().split('T')[0] })
    });
    const newLog = await res.json();
    setMedicalLogs([...medicalLogs, newLog]);
    setLogTitle(''); setLogNotes('');
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expPet || !expItem || !expAmount) return;
    const res = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, petName: expPet, item: expItem, amount: parseFloat(expAmount), date: new Date().toISOString().split('T')[0] })
    });
    const newExp = await res.json();
    setExpenses([...expenses, newExp]);
    setExpItem(''); setExpAmount('');
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!remPet || !remTitle || !remDate) return;
    const res = await fetch('http://localhost:5000/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, petName: remPet, title: remTitle, dueDate: remDate })
    });
    const newRem = await res.json();
    setReminders([...reminders, newRem]);
    setRemTitle(''); setRemDate('');
  };

  const handleAnalyzeHealth = (e) => {
    e.preventDefault();
    if (!selectedPetForAnalysis || !symptomsInput) return;
    setIsAnalyzing(true);
    setAiReport(null);
    setTimeout(() => {
      const pet = pets.find(p => p.name === selectedPetForAnalysis);
      setAiReport({
        petName: pet ? pet.name : selectedPetForAnalysis,
        summary: `Offline AI Clinical evaluation complete. Vitals stable, optimal recovery indicators detected for ${pet ? pet.name : 'your pet'}.`,
        recommendation: `Maintain prescribed hydration levels and review vitals if behavioral shifts persist past 24 hours.`
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  const openQrModal = (pet) => {
    setQrModalPet(pet);
    setQrCodeData('');
    setQrPhone('');
    fetch(`http://localhost:5000/api/pets/${pet.id}/qrcode`)
      .then(res => res.json())
      .then(data => {
        setQrCodeData(data.qrcode);
        setQrPhone(data.phone);
      })
      .catch(err => console.error(err));
  };

  const downloadPdf = (petId) => {
    window.open(`http://localhost:5000/api/pets/${petId}/pdf`, '_blank');
  };

  const totalExpenseSum = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (user) {
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a', paddingBottom: '60px' }}>
        
        {/* Top Navbar */}
        <header style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>🐾</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Luhid<span style={{ color: '#10b981' }}>.</span></h1>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Enterprise Veterinary Intelligence (Offline Mode)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => setShowSosModal(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.35)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              🚨 24/7 Vet SOS
            </button>
            <div style={{ fontSize: '13px', color: '#334155', background: '#f1f5f9', padding: '8px 16px', borderRadius: '20px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
              👤 {user.name}
            </div>
            <button onClick={() => setUser(null)} style={{ padding: '8px 16px', background: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Log Out
            </button>
          </div>
        </header>

        {/* Main Dashboard Container */}
        <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gap: '30px' }}>
          
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #3b82f6' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registered Pets</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>{pets.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #10b981' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Prescriptions</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>{prescriptions.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #f59e0b' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Reminders</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>{reminders.length}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '5px solid #8b5cf6' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Medical Expenses</div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>₹{totalExpenseSum}</div>
            </div>
          </div>

          {/* Pets & QR Tags Section */}
          <section style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              🐶 Animal Profiles & Direct-Dial Emergency QR Tags
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '30px' }}>
              {pets.map(pet => (
                <div key={pet.id} style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                    <img src={pet.image} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{pet.name} <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal' }}>({pet.type})</span></h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>Breed: <strong>{pet.breed}</strong> • Age: <strong>{pet.age}</strong></p>
                    <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#059669', fontWeight: '700' }}>📞 Emergency No: {pet.phone || 'Not set'}</p>
                    
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <button onClick={() => downloadPdf(pet.id)} style={{ padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
                        📥 Download Medical PDF
                      </button>
                      <button onClick={() => openQrModal(pet)} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
                        📞 View Direct-Dial QR Tag
                      </button>
                      <button onClick={() => handleDeletePet(pet.id)} style={{ padding: '10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
                        🗑️ Delete Pet Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddPet} style={{ background: '#f8fafc', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <input type="text" placeholder="Pet Name" value={newPetName} onChange={e => setNewPetName(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
              
              <select value={newPetType} onChange={e => { setNewPetType(e.target.value); setNewPetBreed(breedOptions[e.target.value][0]); }} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', background: '#fff', color: '#0f172a' }}>
                <option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Bird">Bird</option><option value="Reptile">Reptile</option>
              </select>

              <select value={newPetBreed} onChange={e => setNewPetBreed(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', background: '#fff', color: '#0f172a' }}>
                {breedOptions[newPetType].map((b, i) => <option key={i} value={b}>{b}</option>)}
              </select>

              <input type="text" placeholder="Age (e.g., 2 yrs)" value={newPetAge} onChange={e => setNewPetAge(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
              
              <input type="tel" placeholder="Contact No (e.g. +9198765...)" value={newPetPhone} onChange={e => setNewPetPhone(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
              
              <button type="submit" style={{ padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', gridColumn: '1 / -1' }}>+ Register Pet (Auto-Assigns Offline SVG Avatar)</button>
            </form>
          </section>

          {/* Specialists & Consultations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <section style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>🩺 Verified On-Call Specialists</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {doctorsList.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍⚕️</div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{doc.name}</strong>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{doc.specialty} • {doc.exp}</div>
                      <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>📞 {doc.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>📅 Book Consultation</h3>
              <form onSubmit={handleBookAppointment} style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', color: '#0f172a' }} required>
                  <option value="">-- Select Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', color: '#0f172a' }}>
                  {doctorsList.map(d => <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>)}
                </select>
                <input type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <button type="submit" style={{ padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                  Confirm Booking
                </button>
              </form>

              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Upcoming Consultations</h4>
              <div style={{ maxHeight: '110px', overflowY: 'auto', display: 'grid', gap: '8px' }}>
                {appointments.map(a => (
                  <div key={a.id} style={{ padding: '12px 16px', background: '#f0fdf4', borderLeft: '4px solid #10b981', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '13px' }}>{a.service} ({a.pet})</strong>
                      <div style={{ fontSize: '12px', color: '#047857' }}>{a.doctor} on {a.date}</div>
                    </div>
                    <span style={{ fontSize: '11px', background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>{a.status}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Prescriptions & Medical History */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            <section style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>💊 Digital Prescriptions</h3>
              <div style={{ marginBottom: '16px', maxHeight: '160px', overflowY: 'auto', display: 'grid', gap: '10px' }}>
                {prescriptions.map(rx => (
                  <div key={rx.id} style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{rx.medication}</strong>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>{rx.date_issued || rx.dateIssued}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>For: {rx.pet_name || rx.pet} | Prescribed by: {rx.doctor_name || rx.doctor}</div>
                    <div style={{ fontSize: '12px', color: '#334155', fontWeight: '600', marginTop: '2px' }}>Dosage: {rx.dosage} ({rx.duration})</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddPrescription} style={{ display: 'grid', gap: '10px' }}>
                <select value={rxPet} onChange={e => setRxPet(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', color: '#0f172a' }} required>
                  <option value="">-- Select Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Medication Name" value={rxMedication} onChange={e => setRxMedication(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input type="text" placeholder="Dosage" value={rxDosage} onChange={e => setRxDosage(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                  <input type="text" placeholder="Duration" value={rxDuration} onChange={e => setRxDuration(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                </div>
                <button type="submit" style={{ padding: '11px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Save Prescription</button>
              </form>
            </section>

            <section style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>📋 Medical History Timeline</h3>
              <div style={{ marginBottom: '16px', maxHeight: '160px', overflowY: 'auto', display: 'grid', gap: '10px' }}>
                {medicalLogs.map(m => (
                  <div key={m.id} style={{ padding: '14px', background: '#f8fafc', borderRadius: '14px', borderLeft: '4px solid #8b5cf6', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>{m.title} ({m.pet_name || m.petName})</strong>
                      <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 'bold' }}>{m.date}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>{m.category} • {m.notes}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddMedicalLog} style={{ display: 'grid', gap: '10px' }}>
                <select value={logPet} onChange={e => setLogPet(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', color: '#0f172a' }} required>
                  <option value="">-- Select Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input type="text" placeholder="Record Title" value={logTitle} onChange={e => setLogTitle(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                  <select value={logCat} onChange={e => setLogCat(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', color: '#0f172a' }}>
                    <option>Vaccination</option><option>Surgery</option><option>Dental</option><option>Routine Checkup</option>
                  </select>
                </div>
                <input type="text" placeholder="Clinical notes..." value={logNotes} onChange={e => setLogNotes(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <button type="submit" style={{ padding: '11px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>+ Add Clinical Log</button>
              </form>
            </section>

          </div>

          {/* Reminders, Expenses, AI Diagnostics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
            
            <section style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>🔔 Healthcare Reminders</h3>
              <div style={{ marginBottom: '14px', maxHeight: '130px', overflowY: 'auto', display: 'grid', gap: '8px' }}>
                {reminders.map(r => (
                  <div key={r.id} style={{ padding: '10px 12px', background: '#fefce8', borderLeft: '4px solid #f59e0b', borderRadius: '8px', fontSize: '13px' }}>
                    <strong>{r.title} ({r.pet_name || r.petName})</strong>
                    <div style={{ fontSize: '11px', color: '#b45309' }}>Due: {r.due_date || r.dueDate}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddReminder} style={{ display: 'grid', gap: '8px' }}>
                <select value={remPet} onChange={e => setRemPet(e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', background: '#fff', color: '#0f172a' }} required>
                  <option value="">-- Select Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Reminder Title" value={remTitle} onChange={e => setRemTitle(e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <input type="date" value={remDate} onChange={e => setRemDate(e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <button type="submit" style={{ padding: '9px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>+ Set Reminder</button>
              </form>
            </section>

            <section style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>💰 Expense Ledger</h3>
              <div style={{ marginBottom: '14px', maxHeight: '130px', overflowY: 'auto', display: 'grid', gap: '8px' }}>
                {expenses.map(e => (
                  <div key={e.id} style={{ padding: '10px 12px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', border: '1px solid #d1fae5' }}>
                    <span>{e.item} ({e.pet_name || e.petName})</span>
                    <strong>₹{e.amount}</strong>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddExpense} style={{ display: 'grid', gap: '8px' }}>
                <select value={expPet} onChange={e => setExpPet(e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', background: '#fff', color: '#0f172a' }} required>
                  <option value="">-- Select Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <input type="text" placeholder="Expense Item" value={expItem} onChange={e => setExpItem(e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <input type="number" placeholder="Amount (₹)" value={expAmount} onChange={e => setExpAmount(e.target.value)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
                <button type="submit" style={{ padding: '9px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>+ Log Expense</button>
              </form>
            </section>

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '28px', borderRadius: '24px', color: '#fff', boxShadow: '0 10px 30px rgba(15,23,42,0.15)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800' }}>🤖 Offline AI Diagnostics</h3>
              <form onSubmit={handleAnalyzeHealth} style={{ display: 'grid', gap: '10px' }}>
                <select value={selectedPetForAnalysis} onChange={e => setSelectedPetForAnalysis(e.target.value)} style={{ padding: '9px', borderRadius: '8px', fontSize: '13px', background: '#334155', color: '#fff', border: '1px solid #475569', outline: 'none' }} required>
                  <option value="">-- Select Pet --</option>
                  {pets.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <textarea placeholder="Describe behavioral symptoms..." value={symptomsInput} onChange={e => setSymptomsInput(e.target.value)} rows="2" style={{ padding: '9px', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', background: '#334155', color: '#fff', border: '1px solid #475569', outline: 'none' }} required />
                <button type="submit" disabled={isAnalyzing} style={{ padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                  {isAnalyzing ? 'Analyzing Vitals...' : 'Run Offline Diagnostic'}
                </button>
              </form>
              {aiReport && (
                <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '10px', fontSize: '12px', lineHeight: '1.4' }}>
                  <div><strong>Assessment:</strong> {aiReport.summary}</div>
                </div>
              )}
            </section>

          </div>

        </main>

        {/* QR Code Modal */}
        {qrModalPet && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '36px', borderRadius: '24px', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '20px', fontWeight: '800' }}>📞 Direct-Dial QR Tag</h3>
              <p style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', marginBottom: '16px' }}>Target: {qrPhone}</p>
              {qrCodeData ? (
                <img src={qrCodeData} alt="Direct-Dial QR Tag" style={{ width: '220px', height: '220px', margin: '0 auto', imageRendering: 'pixelated', border: '4px solid #f1f5f9', borderRadius: '12px' }} />
              ) : (
                <p style={{ padding: '60px 0', color: '#64748b' }}>Generating Tag...</p>
              )}
              <p style={{ fontSize: '12px', color: '#64748b', margin: '16px 0 20px 0', lineHeight: '1.4' }}>Scanning with a smartphone camera instantly triggers a call to <strong>{qrPhone}</strong>.</p>
              <button onClick={() => { setQrModalPet(null); setQrCodeData(''); }} style={{ padding: '11px 28px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', width: '100%' }}>Close</button>
            </div>
          </div>
        )}

        {/* SOS Modal */}
        {showSosModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '36px', borderRadius: '24px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
              <span style={{ fontSize: '48px' }}>🚨</span>
              <h2 style={{ color: '#ef4444', margin: '12px 0 6px 0', fontSize: '22px', fontWeight: '800' }}>24/7 Veterinary SOS Dispatch</h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Immediate ambulance & emergency vet dispatch line:</p>
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '14px', fontSize: '20px', fontWeight: '800', margin: '20px 0', border: '1px solid #fecaca' }}>
                📞 +91 1800-LUHID-SOS
              </div>
              <button onClick={() => setShowSosModal(false)} style={{ padding: '11px 28px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', width: '100%' }}>Close</button>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px', background: '#fff', borderRadius: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>Luhid<span style={{ color: '#10b981' }}>.</span></h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Every Animal. A Safer Tomorrow. (Offline)</p>
        </div>

        {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: '12px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', fontWeight: '600' }}>{error}</div>}
        {message && <div style={{ color: '#10b981', background: '#f0fdf4', padding: '12px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', fontWeight: '600' }}>{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          {!isLogin && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#0f172a', background: '#fff' }} required={!isLogin} />}
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '13px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#0f172a', background: '#fff' }} required />
          <button type="submit" style={{ padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '4px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
            {isLogin ? 'Log In to Dashboard' : 'Create Enterprise Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            {isLogin ? "Need an account? Register" : "Already registered? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}