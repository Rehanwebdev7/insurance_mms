import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BRANDING_CONFIG } from '../../config/branding.config';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Shield, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storage/storage.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('admin@insureflow.demo');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    { name: 'Super Admin', email: 'admin@insureflow.demo', role: 'SUPER_ADMIN', desc: 'Unrestricted full system access' },
    { name: 'Branch Manager', email: 'manager@insureflow.demo', role: 'MANAGER', desc: 'Customer, Policy & Discount approvals' },
    { name: 'Accountant', email: 'accountant@insureflow.demo', role: 'ACCOUNTANT', desc: 'Customer payments & Company remittances' },
    { name: 'Agent', email: 'agent@insureflow.demo', role: 'AGENT', desc: 'Lead customer creation & policy issuance' },
    { name: 'Auditor', email: 'viewer@insureflow.demo', role: 'VIEWER', desc: 'Read-only compliance mode' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const users = storageService.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user) {
        loginUser(user);
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Please select one of the demo accounts below.');
      }
    }, 400);
  };

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    const users = storageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (user) {
      loginUser(user);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{BRANDING_CONFIG.appName}</h1>
        <p className="text-xs text-slate-400 mt-1.5">{BRANDING_CONFIG.tagline}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Demo User Email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In to SaaS Platform
            </Button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick One-Click Demo Logins
            </p>
            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => selectDemoAccount(acc.email)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-left group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400">{acc.name}</span>
                    <span className="text-[10px] text-slate-400 block">{acc.desc}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
