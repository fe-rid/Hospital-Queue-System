import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Activity, Users, Star, Zap } from 'lucide-react';

const Landing = () => {
  const features = [
    { icon: <Zap size={28}/>,        title: 'AI-Powered Triage',    desc: 'Rule-based symptom analysis instantly classifies patients into Emergency, Urgent, or Normal — no paper forms, no guesswork.' },
    { icon: <Clock size={28}/>,       title: 'Real-time Queue',      desc: 'Patients see their live position and estimated wait time from any device. Queue re-ranks automatically when emergencies arrive.' },
    { icon: <ShieldCheck size={28}/>, title: 'Admin Dashboard',      desc: 'Hospital staff get a central command center to manage patient flow, serve consultations, and view real-time stats.' },
  ];

  const stats = [
    { icon: <Clock size={22}/>,    value: '-45%',  label: 'Wait Time Reduction',   color: 'bg-blue' },
    { icon: <Users size={22}/>,    value: '200+',  label: 'Patients Served Daily',  color: 'bg-green' },
    { icon: <Star size={22}/>,     value: '99.8%', label: 'Triage Accuracy',        color: 'bg-yellow' },
    { icon: <Activity size={22}/>, value: '< 5s',  label: 'Priority Assignment',    color: 'bg-red' },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ padding: '100px 0 80px', background: 'radial-gradient(ellipse at 70% 0%, #eff6ff 0%, #f8fafc 60%)' }}>
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <div className="badge badge-normal mb-4" style={{ marginBottom: '1.5rem' }}>
              🇪🇹 Built for Ethiopian Hospitals
            </div>
            <h1 style={{ fontSize: '3.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Smarter Patient Flow<br />
              <span style={{ color: 'var(--primary)' }}>Powered by AI Triage</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '560px', lineHeight: 1.7 }}>
              SmartHealth replaces manual queues with an intelligent, priority-based system that ensures the most critical patients are always seen first.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem', borderRadius: '12px', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}>
                Register as Patient <ArrowRight size={18}/>
              </Link>
              <Link to="/queue" className="btn-outline" style={{ padding: '0.9rem 2rem', fontSize: '1rem', borderRadius: '12px' }}>
                Check Queue Status
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4" style={{ marginTop: '4rem' }}>
            {stats.map((s, i) => (
              <div key={i} className="card flex items-center gap-4 stat-card">
                <div className={`card-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="font-bold text-xl">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem statement ── */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container text-center" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">The Problem We Solve</p>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>Ethiopian Hospitals Are Overwhelmed</h2>
          <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            Patients wait for hours while critical cases go unnoticed. First-come-first-served queues ignore medical urgency — a life-threatening patient can wait behind routine checkups.
          </p>
        </div>
        <div className="container grid grid-cols-3 gap-8" style={{ marginTop: '4rem' }}>
          {['No triage system → delayed emergency care', 'Manual queues → inefficient patient flow', 'No visibility → patients leave without care'].map((prob, i) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <p className="font-bold text-danger mb-2">Problem #{i + 1}</p>
              <p className="text-sm leading-relaxed">{prob}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Our Solution</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>How SmartHealth Works</h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="card stat-card">
                <div className="card-icon bg-blue mb-4" style={{ width: '52px', height: '52px', borderRadius: '14px' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', background: 'var(--primary)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Ready to Transform Your Hospital?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Join the mission to modernize healthcare in Ethiopia.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', padding: '0.9rem 2rem', borderRadius: '12px', fontWeight: 700 }}>
              Start as Patient
            </Link>
            <Link to="/admin/login" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', padding: '0.9rem 2rem', borderRadius: '12px' }}>
              Admin Portal →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
