import React, { useState } from 'react';
import { PassportForm } from './components/PassportForm';
import { Dashboard } from './components/Dashboard';
import { FaceScanner } from './components/FaceScanner';
import { IntroAnimation } from './components/IntroAnimation';
import { AuthScreen } from './components/AuthScreen';
import { PassportData, PassportCheckResponse } from './types';
import { ShieldCheck, Globe2, ScanFace, Lock, Activity, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [response, setResponse] = useState<PassportCheckResponse | null>(null);
  const [currentData, setCurrentData] = useState<PassportData | null>(null);
  const [viewState, setViewState] = useState<'INPUT' | 'SCANNING' | 'PROCESSING' | 'RESULTS'>('INPUT');

  const initiateCheck = (data: PassportData) => {
    setCurrentData(data);
    setViewState('SCANNING');
  };

  const handleScanComplete = () => {
    setViewState('PROCESSING');
    
    // Simulate API processing delay
    setTimeout(() => {
      if (currentData) {
        const mockResponse: PassportCheckResponse = {
          total_visas: currentData.visa_records.length,
          visited_countries: currentData.travel_history.length,
          visa_details: currentData.visa_records.map(v => ({
            country: v.country,
            status: v.visa_status
          })),
          visited_details: [...currentData.travel_history]
        };
        setResponse(mockResponse);
        setViewState('RESULTS');
      }
    }, 1500);
  };

  const handleScanCancel = () => {
    setViewState('INPUT');
  };

  const handleReset = () => {
    setResponse(null);
    setCurrentData(null);
    setViewState('INPUT');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleReset();
  };

  // 1. Show Intro Animation First
  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  // 2. Show Auth Screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // 3. Show Main Dashboard if logged in
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Face Scanner Overlay */}
      {viewState === 'SCANNING' && (
        <FaceScanner onScanComplete={handleScanComplete} onCancel={handleScanCancel} />
      )}

      {/* Header */}
      <header className="bg-slate-900 sticky top-0 z-40 shadow-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={handleReset}>
            <div className="bg-emerald-600/10 p-2 rounded-lg border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
              RAFAY<span className="text-emerald-500">PASS</span>
              <span className="text-[10px] font-bold text-slate-400 ml-2 border border-slate-700 px-1.5 py-0.5 rounded bg-slate-800 uppercase tracking-wider">Gov.Beta</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6 text-sm font-medium text-slate-400">
             <span className="hidden md:flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
               <Globe2 className="w-4 h-4" />
               Global Mobility
             </span>
             <div className="flex items-center gap-3">
               <span className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                 <span className="text-xs font-bold tracking-wide text-slate-300">SECURE</span>
               </span>
               <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                title="Log Out"
               >
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {viewState === 'RESULTS' && response && currentData ? (
          <div className="animate-fade-in-up space-y-6">
            <button 
              onClick={handleReset}
              className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> NEW ASSESSMENT
            </button>
            <Dashboard data={response} originalData={currentData} />
          </div>
        ) : (
          <div className={`flex flex-col lg:flex-row gap-12 items-start transition-opacity duration-1000 ${viewState === 'SCANNING' ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Left Column: Hero Content */}
            <div className="lg:w-5/12 space-y-10 pt-4">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase">
                  <Activity className="w-3 h-3" />
                  AI Powered Analytics
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  Global Access <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Redefined.</span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                  Advanced biometric and passport analytics utilizing the Gemini Neural Engine. Assess risk, predict visa success, and optimize global mobility.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <ScanFace className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="font-bold text-white">Biometric Scan</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Real-time facial verification via secure channel.</p>
                </div>
                <div className="p-5 bg-slate-900 rounded-xl shadow-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
                  <Globe2 className="w-8 h-8 text-cyan-500 mb-4" />
                  <h3 className="font-bold text-white">Freedom Score</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">AI-calculated global mobility index.</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex items-center gap-4">
                <div className="bg-slate-800 p-2 rounded-full">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Encrypted Processing</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Data is processed locally and anonymized for AI analysis.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:w-7/12 w-full">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"></div>
                
                {viewState === 'PROCESSING' && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-slate-800 rounded-full"></div>
                      <div className="w-20 h-20 border-4 border-emerald-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <p className="mt-6 font-bold text-emerald-400 tracking-widest text-sm animate-pulse">ANALYZING BIOMETRICS...</p>
                  </div>
                )}

                <PassportForm onSubmit={initiateCheck} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;