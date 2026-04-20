import React, { useState, useEffect, useCallback } from 'react';
import Table from '../../components/Table';
import { Search, Filter, CheckCircle2, RefreshCw, UserPlus, Users, Wifi, WifiOff, Stethoscope, PhoneCall, CheckSquare } from 'lucide-react';
import { getQueue, servePatient, getAllDoctors, getAllPatients, assignDoctorToPatient } from '../../services/api';

// Admin helpers for calling and serving (since we removed doctor portal)
const adminCallPatient = async (patientId) => {
  return fetch(`http://localhost:5000/api/queue/call/${patientId}`, { method: 'POST' }).then(r => r.json());
};

const adminStartConsultation = async (patientId) => {
    // We update status to IN_CONSULTATION
    return fetch(`http://localhost:5000/api/queue/start/${patientId}`, { method: 'POST' }).then(r => r.json());
};

const QueueManagement = () => {
  const [queue,       setQueue]       = useState([]);
  const [doctors,     setDoctors]     = useState([]);
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);
  const [online,      setOnline]      = useState(true);
  const [activeTab,   setActiveTab]   = useState('pending');
  const [acting,      setActing]      = useState(null);

  const load = useCallback(async () => {
    try {
      const [qData, dData, allData] = await Promise.all([getQueue(), getAllDoctors(), getAllPatients()]);
      const allPatients = allData.patients || [];
      
      setQueue(allPatients.map(p => ({
        ...p,
        priority:  p.triage?.level || 'NORMAL',
        department: p.triage?.department || 'General'
      })));
      
      setDoctors(dData.doctors || []);
      setOnline(true);
    } catch (error) {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleManualAssign = async (patientId, doctorId) => {
    if (!doctorId) return;
    setActing(patientId);
    try { await assignDoctorToPatient(patientId, doctorId); await load(); }
    catch (err) { alert('Assignment failed'); }
    finally { setActing(null); }
  };

  const handleAction = async (patientId, action) => {
      setActing(patientId);
      try {
          if (action === 'call') await adminCallPatient(patientId);
          if (action === 'start') await adminStartConsultation(patientId);
          if (action === 'serve') await servePatient(patientId);
          await load();
      } catch (err) {
          alert('Action failed');
      } finally {
          setActing(null);
      }
  };

  const currentList = queue.filter(p => {
    if (activeTab === 'pending') return p.status === 'PENDING_ASSIGNMENT';
    if (activeTab === 'active')  return ['WAITING', 'CALLED', 'IN_CONSULTATION'].includes(p.status);
    return p.status === 'SERVED';
  }).filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.id || '').toLowerCase().includes(search.toLowerCase())
  );

  const getBadge = (level = '') => {
    const l = level.toUpperCase();
    if (l === 'EMERGENCY') return 'badge-emergency';
    if (l === 'URGENT')    return 'badge-urgent';
    return 'badge-normal';
  };

  const columns = activeTab === 'pending' 
    ? ['Triage', 'Patient', 'Symptom', 'Suggested Dept', 'Assign Doctor']
    : (activeTab === 'active' ? ['Pos.', 'Patient', 'Status', 'Doctor', 'Management Controls'] : ['Patient', 'Doctor', 'Completion Date', 'Status']);

  const renderRow = (item, idx) => {
    if (activeTab === 'pending') {
      return (
        <tr key={item.id}>
          <td><span className={`badge ${getBadge(item.priority)}`}>{item.priority}</span></td>
          <td><p className="font-bold text-sm">{item.name}</p></td>
          <td className="text-xs text-muted italic truncate max-w-[120px]">"{item.symptoms}"</td>
          <td className="text-xs font-semibold text-primary">{item.department}</td>
          <td>
            <select disabled={acting === item.id} onChange={(e) => handleManualAssign(item.id, e.target.value)}
              className="text-xs p-1.5 rounded-md border border-slate-200">
              <option value="" disabled selected>Choose Doctor...</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.department})</option>)}
            </select>
          </td>
        </tr>
      );
    }

    if (activeTab === 'active') {
        const isWaiting = item.status === 'WAITING';
        const isCalled  = item.status === 'CALLED';
        const isInConsult = item.status === 'IN_CONSULTATION';

        return (
            <tr key={item.id}>
                <td><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px]">{item.queuePosition || idx+1}</div></td>
                <td>
                    <p className="font-bold text-sm">{item.name}</p>
                    <span className={`text-[9px] font-bold uppercase ${getBadge(item.priority)} px-1.5 py-0.5 rounded-full`}>{item.priority}</span>
                </td>
                <td>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isCalled ? 'bg-amber-100 text-amber-700' : (isInConsult ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}`}>
                        {item.status.replace('_', ' ')}
                    </span>
                </td>
                <td className="text-xs font-semibold">{item.assignedDoctor || 'N/A'}</td>
                <td>
                    <div className="flex gap-2">
                        {isWaiting && (
                             <button onClick={() => handleAction(item.id, 'call')} disabled={acting === item.id} className="btn-call flex items-center gap-1 text-[10px] bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold">
                                <PhoneCall size={12} /> Call
                             </button>
                        )}
                        {isCalled && (
                             <button onClick={() => handleAction(item.id, 'start')} disabled={acting === item.id} className="btn-start flex items-center gap-1 text-[10px] bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold">
                                <Stethoscope size={12} /> Start
                             </button>
                        )}
                        {isInConsult && (
                             <button onClick={() => handleAction(item.id, 'serve')} disabled={acting === item.id} className="btn-serve flex items-center gap-1 text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">
                                <CheckSquare size={12} /> Complete
                             </button>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    return (
      <tr key={item.id}>
        <td><p className="font-bold text-sm">{item.name}</p></td>
        <td className="text-xs font-semibold">{item.assignedDoctor}</td>
        <td className="text-xs text-muted">{new Date(item.servedAt).toLocaleString()}</td>
        <td><span className="badge badge-normal">SERVED</span></td>
      </tr>
    );
  };

  return (
    <div className="queue-mgmt">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black">All-in-One Command Center</h2>
            {online ? <Wifi size={14} className="text-green-500"/> : <WifiOff size={14} className="text-red-500"/>}
          </div>
          <button onClick={load} className="btn-outline text-xs px-4 py-2 flex items-center gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Systems
          </button>
        </div>

        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { id: 'pending', label: '1. New Requests', icon: <UserPlus size={14}/> },
            { id: 'active',  label: '2. Live Queue', icon: <Users size={14}/> },
            { id: 'history', label: '3. Archives', icon: <CheckCircle2 size={14}/> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-6 text-xs font-black flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-primary' : 'text-slate-500'}`}
              style={{ borderRadius: '10px' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-5">
            <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full md:w-80 text-sm p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20" />
        </div>

        {loading ? (
          <div className="text-center py-20"><RefreshCw className="animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table columns={columns} data={currentList} renderRow={renderRow} />
        )}
      </div>
    </div>
  );
};

export default QueueManagement;
