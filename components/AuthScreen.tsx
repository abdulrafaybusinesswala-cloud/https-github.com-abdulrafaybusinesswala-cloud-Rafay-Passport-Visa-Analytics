import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for authentication
    setTimeout(() => {
      setLoading(false);
      onAuthenticated();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 shadow-[0_0_30px_rgba(16,185,129,0.1)] mb-4 group">
            <ShieldCheck className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            RAFAY<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">PASS</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase font-medium">Gov.Beta • Secure Access</p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Top Loading Line */}
          {loading && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-[shimmer_1s_infinite]"></div>}
          
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {isLogin ? 'Identity Verification' : 'New User Registration'}
              {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin ml-auto" />}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Secure ID / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@agency.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Access Key / Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 group"
              >
                {loading ? 'Authenticating...' : (isLogin ? 'Access Secure Terminal' : 'Initialize Account')}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

            </form>
          </div>

          {/* Footer Toggle */}
          <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Restricted Access." : "Already have security clearance?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all"
              >
                {isLogin ? "Request Clearance (Sign Up)" : "Log In"}
              </button>
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex justify-center gap-6 mt-8 opacity-50">
           <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             SSL ENCRYPTED
           </div>
           <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             2FA COMPATIBLE
           </div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};