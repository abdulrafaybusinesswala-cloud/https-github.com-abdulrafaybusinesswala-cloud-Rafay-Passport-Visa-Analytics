import React, { useEffect, useRef, useState } from 'react';
import { ScanFace, CheckCircle2, AlertCircle } from 'lucide-react';

interface FaceScannerProps {
  onScanComplete: () => void;
  onCancel: () => void;
}

export const FaceScanner: React.FC<FaceScannerProps> = ({ onScanComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'initializing' | 'scanning' | 'verified' | 'error'>('initializing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus('scanning');
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setStatus('error');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('verified');
            setTimeout(() => {
              onScanComplete();
            }, 1000);
            return 100;
          }
          return prev + 2; // Complete in ~2.5 seconds (50 ticks * 50ms)
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status, onScanComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-slate-200">Biometric Verification</h3>
          </div>
          <button onClick={onCancel} className="text-xs text-slate-400 hover:text-white">CANCEL</button>
        </div>

        {/* Video Area */}
        <div className="relative aspect-[4/5] bg-black">
          {status === 'error' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p>Camera access required for identity verification.</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'verified' ? 'opacity-50' : 'opacity-100'}`} 
              />
              
              {/* Scanning Overlay */}
              {status === 'scanning' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 w-full h-1 bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  <div className="absolute inset-x-12 inset-y-20 border-2 border-emerald-500/30 rounded-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                  </div>
                  <div className="absolute bottom-8 w-full text-center">
                    <p className="text-emerald-400 font-mono text-sm tracking-widest animate-pulse">SCANNING...</p>
                  </div>
                </div>
              )}

              {/* Success Overlay */}
              {status === 'verified' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/40 backdrop-blur-sm">
                  <div className="bg-emerald-500 rounded-full p-4 shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-white tracking-wide">IDENTITY VERIFIED</h2>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer / Progress */}
        <div className="bg-slate-800 p-4 border-t border-slate-700">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>System Status</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

      </div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
