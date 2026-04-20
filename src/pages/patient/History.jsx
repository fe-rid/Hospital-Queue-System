import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Table from '../../components/Table';
import { FileText, Download, ArrowLeft, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { getPatientHistory } from '../../services/api';

const History = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online,  setOnline]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPatientHistory(id);
        setRecords(data.history || []);
        setOnline(true);
      } catch {
        // Fallback: search localStorage for any visits with this ID/Name
        const local = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
        // In local mode, we usually only have one active entry per 'fake id'
        setRecords(local.filter(p => p.id === id || id === 'ME')); // 'ME' is for demo
        setOnline(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getBadge = (level = '') => {
    const l = level.toUpperCase();
    if (l === 'EMERGENCY') return 'badge-emergency';
    if (l === 'URGENT')    return 'badge-urgent';
    return 'badge-normal';
  };

  const columns = ['Date', 'Symptoms', 'Triage Level', 'Final Status'];

  const renderRow = (item, idx) => {
    const level = item.triage?.level || 'NORMAL';
    const date  = item.createdAt || item.timestamp || new Date().toISOString();

    return (
      <tr key={item.id || idx}>
        <td className="font-semibold">
          {new Date(date).toLocaleDateString('en-ET', { day:'2-digit', month:'short', year:'numeric' })}
        </td>
        <td>
          <div className="text-xs text-muted italic max-w-[300px] truncate">"{item.symptoms || '—'}"</div>
        </td>
        <td>
          <span className={`badge ${getBadge(level)}`}>{level}</span>
        </td>
        <td>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.status === 'SERVED' ? 'text-normal bg-green-50' : 'text-urgent bg-amber-50'}`}>
            {item.status || 'WAITING'}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container">
        
        {/* Breadcrumb */}
        <div className="mb-10">
          <Link to="/patient" className="flex items-center gap-2 text-muted hover:text-primary transition font-bold text-sm">
            <ArrowLeft size={16} /> Patient Portal
          </Link>
        </div>

        <div className="card p-0 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-border bg-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FileText size={24} className="text-primary" /> Visit History
              </h2>
              <p className="text-muted text-sm mt-1">Full clinical record and triage logs for ID: {id}</p>
            </div>
            {!online && (
              <div className="flex items-center gap-2 text-urgent bg-amber-50 px-4 py-2 rounded-xl text-xs font-bold">
                <AlertCircle size={14} /> Offline Records
              </div>
            )}
          </div>

          {/* Table Area */}
          <div className="bg-white">
            {loading ? (
              <div className="text-center py-20">
                <RefreshCw size={32} className="animate-spin text-primary mx-auto mb-4" />
                <p className="font-semibold text-muted">Retrieving history...</p>
              </div>
            ) : records.length > 0 ? (
              <Table columns={columns} data={records} renderRow={renderRow} />
            ) : (
              <div className="text-center py-24 text-muted">
                <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                <p className="text-lg font-semibold">No medical history found</p>
                <p className="text-sm">Your visit records will appear here after completion.</p>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {records.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-border flex justify-end">
              <button className="btn-outline text-xs px-6 py-3 font-bold flex items-center gap-2" style={{ borderRadius: '10px' }}>
                <Download size={16} /> Export PDF Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
