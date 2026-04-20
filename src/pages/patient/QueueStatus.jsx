import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowUpRight, RefreshCw, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { getQueue } from '../../services/api';
import { getPatients, sortQueue as localSort } from '../../utils/queue';
import { calculateWaitTime } from '../../utils/waitTime';

const QueueStatus = () => {
  const [queue,       setQueue]       = useState([]);
  const [stats,       setStats]       = useState(null);
  const [isRefreshing,setIsRefreshing]= useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [online,      setOnline]      = useState(true);

  const load = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await getQueue();
      setQueue(data.queue  || []);
      setStats(data.stats  || null);
      setOnline(true);
    } catch {
      // fallback to localStorage
      const local  = localSort(getPatients());
      const mapped = local.map((p, i) => ({
        id:            p.id,
        name:          p.name || p.fullName,
        priority:      p.triage?.level || 'NORMAL',
        priorityScore: p.triage?.priority || 3,
        color:         p.triage?.color || '#10b981',
        badgeClass:    p.triage?.badgeClass || 'badge-normal',
        position:      i + 1,
        estimatedWait: `${calculateWaitTime(i + 1, p.triage?.level || 'NORMAL')} min`
      }));
      setQueue(mapped);
      setStats(null);
      setOnline(false);
    } finally {
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 15_000);
    return () => clearInterval(iv);
  }, [load]);

  const serving  = queue[0] || null;
  const waiting  = queue.slice(1, 5);
  
  // Find current user's entry by ID from sessionStorage
  const myPatientId = sessionStorage.getItem('my_patient_id');
  const myEntry     = queue.find(p => p.id === myPatientId) || (queue.length > 0 ? queue[queue.length - 1] : null);

  const getBadge = (level = '') => {
    const l = level.toUpperCase();
    if (l === 'EMERGENCY') return 'badge-emergency';
    if (l === 'URGENT')    return 'badge-urgent';
    return 'badge-normal';
  };

  return (
    <div className="py-20">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {online
                ? <span className="flex items-center gap-1 text-xs font-bold text-normal px-3 py-1 rounded-full" style={{ background: '#d1fae5' }}><Wifi size={12} /> Live API</span>
                : <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}><WifiOff size={12} /> Offline Mode</span>
              }
            </div>
            <h2 className="text-2xl font-bold">Patient Flow Status</h2>
            <p className="text-muted text-sm">Managing {queue.length} active patients · Last sync: {lastUpdated}</p>
          </div>
          <button onClick={load} disabled={isRefreshing} className="btn-outline px-5 py-2 flex items-center gap-2 text-sm">
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Personal Status Area */}
        {myEntry ? (
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="card text-center py-10" style={{ border: '2px solid var(--primary)' }}>
              <p className="text-xs text-muted font-bold uppercase mb-3 flex items-center justify-center gap-2">
                <Users size={14} /> Your Queue Position
              </p>
              <p className="font-bold" style={{ fontSize: '5rem', color: 'var(--primary)', lineHeight: 1 }}>{myEntry.position}</p>
              <p className="text-xs text-muted mt-3">of {queue.length} patients in queue</p>
            </div>
            <div className="card text-center py-10">
              <p className="text-xs text-muted font-bold uppercase mb-3 flex items-center justify-center gap-2">
                <Clock size={14} /> Est. Wait Time
              </p>
              <p className="font-bold text-urgent" style={{ fontSize: '4rem', lineHeight: 1 }}>{myEntry.estimatedWait}</p>
              <p className="text-xs text-muted mt-3">Priority level: {myEntry.priority}</p>
            </div>
          </div>
        ) : (
          <div className="card mb-8 p-10 text-center" style={{ border: '1px dashed var(--border)', background: '#f8fafc' }}>
            <div className="w-16 h-16 bg-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold">No Active Registration Found</h3>
            <p className="text-muted text-sm mt-1 max-w-sm mx-auto">
              Register now to see your AI-triage priority and estimated wait time.
            </p>
            <Link to="/register" className="btn-primary mt-6">
              Register for Treatment
            </Link>
          </div>
        )}

        {/* Stats row (when API is live) */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card text-center py-5">
              <p className="text-xs text-muted font-bold uppercase mb-1">Emergency</p>
              <p className="text-2xl font-bold text-danger">{stats.emergency}</p>
            </div>
            <div className="card text-center py-5">
              <p className="text-xs text-muted font-bold uppercase mb-1">Urgent</p>
              <p className="text-2xl font-bold text-urgent">{stats.urgent}</p>
            </div>
            <div className="card text-center py-5">
              <p className="text-xs text-muted font-bold uppercase mb-1">Normal</p>
              <p className="text-2xl font-bold text-normal">{stats.normal}</p>
            </div>
          </div>
        )}

        {/* Live queue panel */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h4 className="font-bold flex items-center gap-2"><ArrowUpRight size={18} className="text-primary" /> Live Queue</h4>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Auto-refreshing
            </span>
          </div>

          {/* Currently serving */}
          {serving ? (
            <div className="p-5 rounded-2xl mb-4 flex items-center justify-between" style={{ background: '#eff6ff', border: '2px solid #dbeafe' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {(serving.name || 'P').charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold">Currently Serving</p>
                  <p className="font-bold text-lg">{serving.name}</p>
                </div>
              </div>
              <span className={`badge ${getBadge(serving.priority)}`}>{serving.priority}</span>
            </div>
          ) : (
            <div className="p-6 rounded-2xl text-center text-muted text-sm" style={{ background: '#f8fafc' }}>
              Queue is currently empty
            </div>
          )}

          {/* Up next */}
          {waiting.length > 0 && (
            <div>
              <p className="text-xs text-muted uppercase font-bold mb-3 mt-5">Upcoming</p>
              <div className="flex flex-col gap-2">
                {waiting.map((p, i) => (
                  <div key={p.id} className="p-4 rounded-xl border border-border flex items-center justify-between" style={{ background: '#fafafa' }}>
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-main flex items-center justify-center text-xs font-bold text-muted"
                        style={{ background: '#f1f5f9' }}>{i + 2}</span>
                      <span className="text-sm font-semibold">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">{p.estimatedWait}</span>
                      <span className={`badge ${getBadge(p.priority)}`} style={{ fontSize: '9px' }}>{p.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="p-5 rounded-2xl flex items-start gap-4 text-sm" style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
          <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
          <p className="text-primary opacity-80 leading-relaxed">
            <strong>Priority Re-ranking:</strong> If a new Emergency patient arrives, the queue is automatically re-sorted and your estimated wait time will update on the next refresh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
