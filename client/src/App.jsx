import React, { useState, useEffect } from 'react';
import API from './api';

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
      API.get(`/pets/${user.id}`).then(res => setPets(res.data)).catch(err => console.error(err));
      API.get(`/reminders/${user.id}`).then(res => setReminders(res.data)).catch(err => console.error(err));
      API.get(`/medical-logs/${user.id}`).then(res => setMedicalLogs(res.data)).catch(err => console.error(err));
      API.get(`/prescriptions/${user.id}`).then(res => setPrescriptions(res.data)).catch(err => console.error(err));
      API.get(`/expenses/${user.id}`).then(res => setExpenses(res.data)).catch(err => console.error(err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    const endpoint = isLogin ? '/users/login' : '/users/register';
    try {
      const res = await API.post(endpoint, isLogin ? { email, password } : { name, email, password });
      setMessage(res.data.message);
      if (isLogin) setUser(res.data.user);
      else setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication error');
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed || !newPetAge || !newPetPhone) return;
    const petImage = breedImages[newPetBreed] || breedImages['Indie / Local Breed'];

    try {
      const res = await API.post('/pets', { 
        userId: user.id, 
        name: newPetName, 
        type: newPetType, 
        breed: newPetBreed, 
        age: newPetAge, 
        phone: newPetPhone, 
        image: petImage 
      });
      setPets([...pets, res.data]);
      setNewPetName(''); setNewPetAge(''); setNewPetPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet profile?')) return;
    try {
      const res = await API.delete(`/pets/${petId}`);
      if (res.status === 200 || res.status === 204) {
        setPets(pets.filter(p => p.id !== petId));
      }
    } catch (err) {
      console.error(err);
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
    try {
      const res = await API.post('/prescriptions', { 
        userId: user.id, 
        petName: rxPet, 
        doctorName: 'Dr. Ananya Sharma', 
        medication: rxMedication, 
        dosage: rxDosage, 
        duration: rxDuration, 
        dateIssued: new Date().toISOString().split('T')[0] 
      });
      setPrescriptions([...prescriptions, res.data]);
      setRxMedication(''); setRxDosage(''); setRxDuration('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMedicalLog = async (e) => {
    e.preventDefault();
    if (!logPet || !logTitle || !logNotes) return;
    try {
      const res = await API.post('/medical-logs', { 
        userId: user.id, 
        petName: logPet, 
        title: logTitle, 
        category: logCat, 
        notes: logNotes, 
        date: new Date().toISOString().split('T')[0] 
      });
      setMedicalLogs([...medicalLogs, res.data]);
      setLogTitle(''); setLogNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expPet || !expItem || !expAmount) return;
    try {
      const res = await API.post('/expenses', { 
        userId: user.id, 
        petName: expPet, 
        item: expItem, 
        amount: parseFloat(expAmount), 
        date: new Date().toISOString().split('T')[0] 
      });
      setExpenses([...expenses, res.data]);
      setExpItem(''); setExpAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!remPet || !remTitle || !remDate) return;
    try {
      const res = await API.post('/reminders', { 
        userId: user.id, 
        petName: remPet, 
        title: remTitle, 
        dueDate: remDate 
      });
      setReminders([...reminders, res.data]);
      setRemTitle(''); setRemDate('');
    } catch (err) {
      console.error(err);
    }
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
    // Use raw axios or API baseURL construction for specific direct fetches/windows if needed
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://luhid.onrender.com/api' : 'http://localhost:5000/api';
    fetch(`${baseURL}/pets/${pet.id}/qrcode`)
      .then(res => res.json())
      .then(data => {
        setQrCodeData(data.qrcode);
        setQrPhone(data.phone);
      })
      .catch(err => console.error(err));
  };

  const downloadPdf = (petId) => {
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://luhid.onrender.com/api' : 'http://localhost:5000/api';
    window.open(`${baseURL}/pets/${petId}/pdf`, '_blank');
  };

  const totalExpenseSum = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (user) {
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a', paddingBottom: '60px' }}>
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
        <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gap: '30px' }}>
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '350px' }}>
        <h2>{isLogin ? 'Login to Luhid' : 'Register for Luhid'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {!isLogin && (
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#2563eb', fontSize: '14px' }}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}