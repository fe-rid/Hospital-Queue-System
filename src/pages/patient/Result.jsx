import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw, MapPin, Calendar, Clock, ArrowLeft, Printer, QrCode, Bell, Stethoscope, DoorOpen } from 'lucide-react';
import { getPatientById, getQueue } from '../../services/api';
import { getPatients, sortQueue as localSort } from '../../utils/queue';
import StatusCard from '../../components/StatusCard';
import QueueCard from '../../components/QueueCard';

const Result = () => {
  const { id } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const patientRes = await getPatientById(id);
      const queueRes   = await getQueue();
      const myPos      = (queueRes.queue || []).find(p => p.id === id);
      
      setData({
        patient:  patientRes.patient,
        position: myPos?.position || '--',
        wait:     myPos?.estimatedWait || '--',
        status:   patientRes.patient?.status || 'WAITING'
      });
      setOnline(true);
    } catch (err) {
      const localPatients = localSort(getPatients());
      const p = localPatients.find(x => x.id === id);
      const idx = localPatients.findIndex(x => x.id === id);
      
      if (p) {
        setData({
          patient:  p,
          position: idx !== -1 ? idx + 1 : '--',
          wait:     '-- (Offline)',
          status:   p.status || 'WAITING'
        });
      }
      setOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const iv = setInterval(() => fetchData(true), 5000); 
    return () => clearInterval(iv);
  }, [fetchData]);

  if (loading) return (
    <div className="py-20 text-center">
      <RefreshCw size={40} className="animate-spin text-primary mx-auto mb-4" />
      <h3 className="font-bold">Syncing Patient Status...</h3>
    </div>
  );

  if (!data) return (
    <div className="py-20 text-center container">
      <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
      <Link to="/patient/register" className="btn-primary">Register Now</Link>
    </div>
  );

  const { patient, position, wait, status } = data;
  const triage = patient.triage || {};
  const isCalled = status === 'CALLED' || status === 'IN_CONSULTATION';
  const isPending = status === 'PENDING_ASSIGNMENT';

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Pending Assignment Alert */}
        {isPending && (
          <div className="mb-8 p-6 rounded-3xl flex items-center justify-between" 
               style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e' }}>
            <div className="flex items-center gap-4">
              <div className="bg-white/50 p-3 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Admin Review in Progress</h3>
                <p className="opacity-90 text-sm">Please wait while an administrator assigns you to the best available doctor.</p>
              </div>
            </div>
          </div>
        )}

        {/* Urgent Call Alert */}
        {isCalled && (
          <div className="mb-8 p-6 rounded-3xl flex items-center justify-between text-white animate-pulse" 
               style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.3)' }}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">You are being called!</h3>
                <p className="opacity-90 text-sm">Please proceed to {patient.assignedRoom || 'the assigned room'} immediately.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase opacity-60">Room Number</p>
              <p className="text-3xl font-black">{patient.assignedRoom || 'TBD'}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link to="/patient" className="flex items-center gap-2 text-muted hover:text-primary transition font-bold text-sm">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-4">
            {refreshing && <RefreshCw size={12} className="animate-spin text-primary" />}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-normal' : 'bg-urgent'}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                {online ? 'Live Server' : 'Cloud Sync'}
              </span>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome, {patient.name || patient.fullName}</h1>
          <div className="flex justify-center gap-6 text-sm text-muted">
            <p className="flex items-center gap-1 font-semibold"><Calendar size={14} /> {new Date(patient.createdAt).toLocaleDateString()}</p>
            <p className="flex items-center gap-1 font-semibold"><MapPin size={14} /> ID: <span className="text-primary">{patient.id}</span></p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <QueueCard label="Queue Position" value={isPending ? 'WAIT' : (status === 'SERVED' ? 'DONE' : `#${position}`)} subtext="Live Rank" type="position" />
          <QueueCard label="Estimated Wait" value={isPending ? '--' : (status === 'SERVED' ? 'COMPLETE' : wait)} subtext="Minutes" type="wait" />
          <QueueCard label="Session Status" value={status === 'PENDING_ASSIGNMENT' ? 'REVIEW' : status} subtext="Live Update" type="status" />
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <StatusCard 
            type="triage" 
            level={triage.level} 
            label="AI Triage Result" 
            value={triage.level?.toUpperCase() || 'NORMAL'}
            explanation={triage.explanation}
          />
          <div className="flex flex-col gap-6">
            <StatusCard 
              type="department" 
              label="Assigned Department" 
              value={triage.department || 'General Medicine'} 
            />
            {/* Assigned Staff Card */}
            <div className="card p-6 border-l-4" style={{ borderColor: '#2563eb' }}>
              <div className="flex items-center gap-4">
                <div className="bg-blue p-3 rounded-2xl text-primary">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Assigned Medical Professional</p>
                  <p className="text-lg font-bold">{patient.assignedDoctor || 'Assigning soon...'}</p>
                  <p className="text-sm text-muted flex items-center gap-1 mt-1 font-medium">
                    <DoorOpen size={14} /> Room: <span className="text-primary">{patient.assignedRoom || 'TBD'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-8 border-t border-border">
          <button className="btn-outline flex-1 py-4 flex items-center justify-center gap-2" style={{ borderRadius: '12px' }}>
            <Printer size={18} /> Print E-Ticket
          </button>
          <button className="btn-outline flex-1 py-4 flex items-center justify-center gap-2" style={{ borderRadius: '12px' }}>
            <QrCode size={18} /> View QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
