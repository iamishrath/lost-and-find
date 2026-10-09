import React, { useState } from 'react';
import { UserProfile, ChennaiArea } from '../types';
import { DEMO_USERS, getSupabaseClient, setCurrentUser } from '../lib/supabase';
import { CHENNAI_AREAS } from '../data/chennaiLocations';
import { 
  User, 
  Lock, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Key, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AuthViewProps {
  currentUser: UserProfile;
  onUserAuth: (user: UserProfile) => void;
  onNavigate: (page: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onUserAuth,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState<ChennaiArea>('Velachery');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setLoading(true);

    try {
      const client = getSupabaseClient();

      if (mode === 'signup') {
        if (!name.trim()) {
          setAuthError('Please enter your full name');
          setLoading(false);
          return;
        }

        if (client) {
          const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                area,
              },
            },
          });
          if (error) throw error;
        }

        // Create active user
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
          phoneMasked: '+91 98XXX XXXX',
          area,
          joinedDate: new Date().toISOString().split('T')[0],
          verified: true,
        };

        setCurrentUser(newUser);
        onUserAuth(newUser);
        setAuthSuccess('Sign up successful! Welcome to Lost & Found Chennai.');
        setTimeout(() => onNavigate('dashboard'), 1000);
      } else if (mode === 'login') {
        if (client) {
          const { error } = await client.auth.signInWithPassword({ email, password });
          if (error) throw error;
        }

        // Check if matches demo users or create session
        const foundDemo = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const userToLogin: UserProfile = foundDemo || {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email: email.trim(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          area: 'Chennai Central',
          joinedDate: new Date().toISOString().split('T')[0],
          verified: true,
        };

        setCurrentUser(userToLogin);
        onUserAuth(userToLogin);
        setAuthSuccess('Welcome back! Logging into your dashboard...');
        setTimeout(() => onNavigate('dashboard'), 1000);
      } else if (mode === 'reset') {
        if (client) {
          const { error } = await client.auth.resetPasswordForEmail(email);
          if (error) throw error;
        }
        setAuthSuccess('Password reset link sent to your email address!');
      }
    } catch (err: any) {
      console.warn('Auth issue:', err);
      // If error from remote supabase, show it, but allow local demo fallback if credentials not yet provisioned
      setAuthError(err.message || 'Authentication error. You can also use quick demo login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demo: UserProfile) => {
    setCurrentUser(demo);
    onUserAuth(demo);
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Auth Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {mode === 'login'
              ? 'Sign in to Account'
              : mode === 'signup'
              ? 'Create Chennai Account'
              : 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500">
            Secure Supabase Authentication & Private Profile
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 rounded-xl bg-slate-100 flex text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : ''
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : ''
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('reset');
              setAuthError('');
              setAuthSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              mode === 'reset' ? 'bg-white text-slate-900 shadow-sm' : ''
            }`}
          >
            Reset
          </button>
        </div>

        {/* Status Alerts */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Raja"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. karthik.it@chennai.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">Chennai Area / Hub *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as ChennaiArea)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  {CHENNAI_AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Account'
                : mode === 'signup'
                ? 'Create Verified Account'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Account Switcher for College Project Testing */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Or 1-Click Demo Login (College Testing):
          </div>

          <div className="space-y-1.5">
            {DEMO_USERS.map((usr) => (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleQuickLogin(usr)}
                className={`w-full p-2 rounded-xl text-left text-xs border flex items-center justify-between transition-colors ${
                  usr.id === currentUser.id
                    ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <img src={usr.avatar} alt="" className="w-6 h-6 rounded-lg object-cover" />
                  <span className="truncate">{usr.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">📍 {usr.area}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
