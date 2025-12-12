import React, { useEffect, useState } from 'react';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Sequence:
    // 0s: Fade In starts (via CSS animation)
    // 2.2s: Trigger Exit (Blast)
    // 3.0s: Unmount (After blast settles)
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 800); 
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.8,0,0.2,1)] ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Glow - Expands aggressively on exit */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] transition-transform duration-1000 ease-in ${exiting ? 'scale-[4] opacity-0' : 'scale-100 animate-pulse'}`} />

      {/* Decorative Particles */}
      <div className={`absolute inset-0 overflow-hidden opacity-30 transition-opacity duration-300 ${exiting ? 'opacity-0' : 'opacity-30'}`}>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
      </div>

      {/* Main Text Content - Zooms IN towards camera on exit */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-in ${exiting ? 'scale-[5] opacity-0 blur-sm' : 'scale-100 opacity-100'}`}>
        
        {/* Name: RAFAY */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 animate-[fadeInUp_1s_ease-out_forwards]">
          Rafay
        </h1>

        {/* Subtitle: PASSPORT & VISA ANALYTICS */}
        <div className="mt-6 relative overflow-hidden">
          {/* Top Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-500 to-transparent absolute top-0"></div>
          
          <p className="text-sm md:text-xl font-medium text-slate-300 tracking-[0.4em] uppercase py-4 animate-[fadeInUp_1.2s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.3s' }}>
            Passport & Visa Analytics
          </p>
          
          {/* Bottom Line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-500 to-transparent absolute bottom-0"></div>
        </div>

      </div>

      {/* Flash Overlay - Creates the 'Energy Blast' effect */}
      <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-500 ease-out ${exiting ? 'opacity-40' : 'opacity-0'}`}></div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};