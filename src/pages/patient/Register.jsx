import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Thermometer, Calendar, Loader2, ChevronRight } from 'lucide-react';
import { registerPatient } from '../../services/api';
import { classifySymptoms } from '../../utils/triage';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'male', phone: '', symptoms: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ── Try backend API ───────────────────────────────────────────
      const data = await registerPatient(formData);
      
      const id = data.patientId || data.patient?.id;
      sessionStorage.setItem('my_patient_id', id);

      navigate(`/patient/result/${id}`);
    } catch (err) {
      console.warn('API fallback to local mode:', err.message);

      // ── Fallback: local triage ────────────────────────────────────
      const triage = classifySymptoms(formData.symptoms);
      const id = `PAT-${Math.floor(Math.random() * 9000) + 1000}`;
      
      const patient = {
        id,
        ...formData,
        fullName:  formData.name,
        triage,
        status:    'WAITING',
        createdAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
      existing.push(patient);
      localStorage.setItem('hospital_patients', JSON.stringify(existing));
      sessionStorage.setItem('my_patient_id', id);

      navigate(`/patient/result/${id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <div className="container" style={{ maxWidth: '620px' }}>
        <div className="card p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Patient Registration</h2>
            <p className="text-muted text-sm px-4">Please provide your details for AI-assisted triage and priority assignment.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="flex items-center gap-2"><User size={15} /> Full Name</label>
              <input name="name" type="text" placeholder="e.g. Abebe Kebede" required value={formData.name} onChange={handleChange} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2"><Calendar size={15} /> Age</label>
                <input name="age" type="number" min="1" max="120" required value={formData.age} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2"><Phone size={15} /> Phone Number</label>
              <input name="phone" type="tel" placeholder="09XX XXX XXX" value={formData.phone} onChange={handleChange} />
            </div>

            <div>
              <label className="flex items-center gap-2"><Thermometer size={15} /> Symptoms & Concerns</label>
              <textarea
                name="symptoms"
                rows="4"
                placeholder="Describe how you feel (e.g. chest pain, high fever)..."
                required
                value={formData.symptoms}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-sm uppercase tracking-widest font-bold" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Registration →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
