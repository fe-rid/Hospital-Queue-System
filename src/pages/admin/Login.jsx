import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-page flex items-center justify-center min-vh-100 bg-main" style={{minHeight: '100vh'}}>
      <div className="card" style={{width: '100%', maxWidth: '400px'}}>
        <div className="text-center mb-8">
          <div className="logo-icon m-auto mb-4" style={{width: '48px', height: '48px', fontSize: '1.5rem'}}>H</div>
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-muted text-sm">Sign in to manage hospital operations.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="form-group">
            <label>Email Address</label>
            <div style={{position: 'relative'}}>
              <Mail className="text-muted" size={18} style={{position: 'absolute', left: '12px', top: '14px'}} />
              <input 
                type="email" 
                placeholder="doctor@smarthealth.et" 
                style={{paddingLeft: '2.5rem', width: '100%'}}
                defaultValue="admin@hospital.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{position: 'relative'}}>
              <Lock className="text-muted" size={18} style={{position: 'absolute', left: '12px', top: '14px'}} />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{paddingLeft: '2.5rem', width: '100%'}}
                defaultValue="password123"
              />
            </div>
          </div>

          <div className="flex justify-between items-center" style={{fontSize: '0.75rem'}}>
            <label className="flex items-center gap-2 font-normal cursor-pointer">
              <input type="checkbox" style={{width: '14px', height: '14px', margin: 0}} /> Remember me
            </label>
            <a href="#" className="text-primary font-bold hover:underline">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary w-full py-4">
            Sign In <ChevronRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center" style={{borderTop: '1px solid var(--border)', paddingTop: '1.5rem'}}>
          <p className="text-xs text-muted">
            Authorized Personnel Only. <br/>
            All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
