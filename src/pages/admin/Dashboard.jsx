import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { Users, Activity, Clock, AlertTriangle, ArrowUpRight, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getQueueStats, getQueue } from '../../services/api';
import { getPatients, sortQueue as localSort } from '../../utils/queue';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    totalToday: 0, 
    emergency: 0, 
    urgent: 0, 
    normal: 0, 
    currentWaiting: 0, 
    servedToday: 0 
  });
  const [queue,   setQueue]   = useState([]);
  const [online,  setOnline]  = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [statsData, queueData] = await Promise.all([getQueueStats(), getQueue()]);
      
      if (statsData && statsData.stats) {
        setStats(statsData.stats);
      }
      
      if (queueData && queueData.queue) {
        setQueue(queueData.queue.map(p => ({
          ...p,
          priority: p.triage?.level || 'NORMAL',
          department: p.triage?.department || 'General'
        })));
      }
      setOnline(true);
    } catch (error) {
      console.error('Dashboard Load Error:', error);
      // Fallback
      const local = localSort(getPatients());
      setQueue(local.map((p, i) => ({
        id:       p.id,
        name:     p.name || p.fullName,
        priority: p.triage?.level || 'NORMAL',
        triage:   p.triage,
        position: i + 1
      })));
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    load(); 
    const iv = setInterval(load, 15000); 
    return () => clearInterval(iv); 
  }, [load]);

  const statCards = [
    { title: 'Total Patients Today', value: (stats?.totalToday || 0).toString(),     icon: <Users size={20}/>,         color: 'bg-blue',   trend: { positive: true,  value: 'Live' } },
    { title: 'Emergency Cases',      value: String(stats?.emergency || 0).padStart(2,'0'), icon: <AlertTriangle size={20}/>, color: 'bg-red',    trend: { positive: false, value: 'Action Req.' } },
    { title: 'Urgent Cases',         value: String(stats?.urgent || 0).padStart(2,'0'),    icon: <Activity size={20}/>,      color: 'bg-yellow', trend: { positive: true,  value: 'Monitoring' } },
    { title: 'Currently Waiting',    value: (stats?.currentWaiting || 0).toString(),  icon: <Clock size={20}/>,         color: 'bg-green',  trend: { positive: true,  value: `${stats?.servedToday || 0} served` } },
  ];

  const getBadge = (level = '') => {
    const l = level.toUpperCase();
    if (l === 'EMERGENCY') return 'badge-emergency';
    if (l === 'URGENT')    return 'badge-urgent';
    return 'badge-normal';
  };

  const columns = ['#', 'Patient', 'Priority', 'Department', 'Est. Wait', 'Status'];

  const renderRow = (item, idx) => (
    <tr key={item.id || idx}>
      <td className="font-bold text-primary" style={{ fontSize: '0.8rem' }}>{item.position || idx + 1}</td>
      <td>
        <div>
          <p className="font-semibold text-sm">{item.name || 'Anonymous'}</p>
          <p className="text-[10px] text-muted">{item.id || 'N/A'}</p>
        </div>
      </td>
      <td><span className={`badge ${getBadge(item.priority)}`} style={{ fontSize: '10px' }}>{item.priority}</span></td>
      <td className="text-xs text-muted">{(item.department || '').split('–')[0] || '-'}</td>
      <td className="text-xs font-semibold">{item.estimatedWait || '—'}</td>
      <td>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${idx === 0 ? 'bg-primary' : 'bg-muted'}`}></div>
          <span className={`text-[10px] font-bold ${item.status === 'PENDING_ASSIGNMENT' ? 'text-urgent' : (idx === 0 ? 'text-primary' : 'text-muted')}`}>
            {item.status === 'PENDING_ASSIGNMENT' ? 'PENDING REVIEW' : (idx === 0 ? 'SERVING' : 'WAITING')}
          </span>
        </div>
      </td>
    </tr>
  );

  if (loading) return (
    <div className="flex items-center justify-center" style={{ height: '60vh' }}>
      <div className="text-center">
        <RefreshCw size={32} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted font-semibold">Loading dashboard data...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {online
            ? <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#d1fae5', color: '#065f46' }}><Wifi size={12}/> Live Connectivity</span>
            : <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}><WifiOff size={12}/> Offline Mode</span>
          }
        </div>
        <button onClick={load} className="flex items-center gap-2 text-xs text-muted font-semibold hover:text-primary transition">
          <RefreshCw size={14}/> Force Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {statCards.map((s, i) => <Card key={i} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 style={{ fontSize: '1.05rem' }} className="font-bold">Live Priority Queue</h3>
              <p className="text-xs text-muted">Auto-sorted by priority level</p>
            </div>
          </div>
          <Table columns={columns} data={queue.slice(0, 8)} renderRow={renderRow} />
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem' }} className="font-bold mb-6">Triage Composition</h3>
          {[
            { label: 'EMERGENCY', count: stats?.emergency || 0, total: stats?.currentWaiting || 1, color: '#ef4444', textCls: 'text-danger' },
            { label: 'URGENT',    count: stats?.urgent || 0,    total: stats?.currentWaiting || 1, color: '#f59e0b', textCls: 'text-urgent' },
            { label: 'NORMAL',    count: stats?.normal || 0,    total: stats?.currentWaiting || 1, color: '#10b981', textCls: 'text-normal' },
          ].map(({ label, count, total, color, textCls }) => (
            <div key={label} className="mb-7">
              <div className="flex justify-between text-[11px] font-bold mb-2">
                <span className={textCls}>{label}</span>
                <span>{count} cases</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: total > 0 ? `${(count / Math.max(total, 1)) * 100}%` : '0%', height: '100%', background: color, borderRadius: '5px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
