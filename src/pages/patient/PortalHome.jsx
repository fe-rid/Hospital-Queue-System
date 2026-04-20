import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ClipboardList, History as HistoryIcon, ShieldCheck } from 'lucide-react';

const PortalHome = () => {
  const actions = [
    {
      title: 'Register as Patient',
      desc: 'Fill in your symptoms to receive an AI-triage ticket.',
      icon: <ClipboardList size={28} className="text-primary" />,
      link: '/patient/register',
      btnText: 'Start Registration'
    },
    {
      title: 'Track My Queue',
      desc: 'Already registered? Check your live position and wait time.',
      icon: <Search size={28} className="text-primary" />,
      link: '/patient/track',
      btnText: 'Track Status'
    },
    {
      title: 'View History',
      desc: 'Access records of your previous hospital visits.',
      icon: <HistoryIcon size={28} className="text-primary" />,
      link: '/patient/history/ME',
      btnText: 'Open History'
    }
  ];

  return (
    <div className="portal-home">
      {/* Hero Section */}
      <section className="hero" style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px' }}>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6">
              <ShieldCheck size={16} /> 🏥 SmartHealth Patient Portal
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Track your queue <br /> 
              <span className="text-primary">& status online.</span>
            </h1>
            <p className="text-muted leading-relaxed" style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              No more blind waiting. Register online, get prioritized by medical urgency using AI triage, 
              and track your status in real-time from your phone.
            </p>
            <div className="flex gap-4">
              <Link to="/patient/register" className="btn-primary py-4 px-8" style={{ borderRadius: '14px', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' }}>
                Register Now <ArrowRight size={18} />
              </Link>
              <Link to="/patient/track" className="btn-outline py-4 px-8" style={{ borderRadius: '14px' }}>
                Track Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Actions */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            {actions.map((act, i) => (
              <div key={i} className="card p-8 flex flex-col items-center text-center transition hover:shadow-lg">
                <div className="p-4 bg-blue rounded-2xl mb-6">
                  {act.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{act.title}</h3>
                <p className="text-sm text-muted mb-8 leading-relaxed">{act.desc}</p>
                <Link to={act.link} className="btn-outline w-full py-3 text-xs font-bold uppercase tracking-wider">
                  {act.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom info */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="p-10 rounded-[30px] flex items-center justify-between text-white" style={{ background: 'var(--primary)', backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
            <div style={{ maxWidth: '400px' }}>
              <h2 className="text-2xl font-bold mb-2">Need Urgent Help?</h2>
              <p className="opacity-80 text-sm">If you are experiencing a life-threatening emergency, please call 912 immediately or proceed to the nearest ER.</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-sm">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-60">Ambulance Service</p>
                <p className="text-2xl font-bold">912</p>
              </div>
              <div className="w-[1px] h-10 bg-white/20"></div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-60">General inquiries</p>
                <p className="text-2xl font-bold">8080</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalHome;
