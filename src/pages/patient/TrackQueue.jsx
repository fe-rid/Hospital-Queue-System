import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hash, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const TrackQueue = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      // Direct lookup by ID as per spec
      navigate(`/patient/result/${value.trim()}`);
    }
  };

  return (
    <div className="py-20">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-blue rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Search size={36} className="text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold mb-3">Track My Queue</h2>
          <p className="text-muted text-sm mb-10 px-4">
            Enter your Ticket ID or registered Phone Number to check your live status and estimated wait time.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted">
                <Hash size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Ticket ID (e.g. PAT-1234)" 
                className="pl-12 py-5 bg-gray-50 border-transparent focus:bg-white focus:border-primary text-lg"
                style={{ borderRadius: '16px' }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary py-5 text-lg font-bold" style={{ borderRadius: '16px' }}>
              Track My Status <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
              <ShieldCheck size={14} className="text-primary" /> Encrypted & Secure
            </div>
            <p className="text-[10px] text-muted mt-2 px-10">
              Only authorized patients can access status information. Your data is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackQueue;
