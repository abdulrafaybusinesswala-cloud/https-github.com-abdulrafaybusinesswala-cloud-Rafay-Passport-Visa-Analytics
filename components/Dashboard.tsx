import React, { useState, useRef } from 'react';
import { PassportCheckResponse, PassportData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { analyzePassportProfile, generateAudioSummary } from '../services/gemini';
import { Sparkles, CheckCircle, Clock, XCircle, Map, Stamp, BrainCircuit, Loader2, Volume2, StopCircle, PlayCircle, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  data: PassportCheckResponse;
  originalData: PassportData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, originalData }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Prepare data for the chart
  const statusCounts = data.visa_details.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(statusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: statusCounts[status]
  }));

  const COLORS = {
    'Approved': '#10B981', // Emerald
    'Pending': '#F59E0B',  // Amber
    'Rejected': '#EF4444', // Red
    'Expired': '#64748B',  // Slate
  };

  const getColor = (status: string) => {
    const key = status.charAt(0).toUpperCase() + status.slice(1);
    return COLORS[key as keyof typeof COLORS] || '#6366F1';
  };

  const handleAIAnalysis = async () => {
    setLoadingAnalysis(true);
    const result = await analyzePassportProfile(originalData, data);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        setIsPlaying(false);
      }
      return;
    }

    if (!analysis) return;

    try {
      setLoadingAudio(true);
      
      // Initialize Audio Context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      // Resume context if suspended (browser policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Generate Audio via Gemini
      const audioBuffer = await generateAudioSummary(analysis);

      if (audioBuffer) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        
        sourceNodeRef.current = source;
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio Playback Error", err);
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between group hover:border-teal-500/30 transition-colors">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-400 transition-colors">Total Visas</p>
            <p className="text-4xl font-extrabold text-white mt-2">{data.total_visas}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl group-hover:bg-teal-500/10 transition-colors">
            <Stamp className="w-8 h-8 text-teal-500" />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-indigo-400 transition-colors">Countries Visited</p>
            <p className="text-4xl font-extrabold text-white mt-2">{data.visited_countries}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl group-hover:bg-indigo-500/10 transition-colors">
            <Map className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between group hover:border-amber-500/30 transition-colors">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-amber-400 transition-colors">Nationality</p>
            <p className="text-2xl font-bold text-white mt-2 truncate max-w-[150px]" title={originalData.country}>
              {originalData.country}
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl group-hover:bg-amber-500/10 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-amber-500 text-sm border-2 border-amber-500/50 rounded-md">
              {originalData.country.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visa Status Chart */}
        <div className="lg:col-span-1 bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4">Visa Portfolio</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Lists */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Immigration Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            
            {/* Visa List */}
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Visa Records</h4>
              <ul className="space-y-2">
                {data.visa_details.map((visa, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 shadow-sm">
                    <span className="font-semibold text-slate-300">{visa.country}</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 uppercase
                      ${visa.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        visa.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                        'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {visa.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {visa.status === 'pending' && <Clock className="w-3 h-3" />}
                      {visa.status !== 'approved' && visa.status !== 'pending' && <XCircle className="w-3 h-3" />}
                      {visa.status}
                    </span>
                  </li>
                ))}
                {data.visa_details.length === 0 && <p className="text-slate-600 text-sm italic">No records found.</p>}
              </ul>
            </div>

            {/* History List */}
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Travel History</h4>
              <div className="flex flex-wrap gap-2">
                {data.visited_details.map((country, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    {country}
                  </span>
                ))}
                {data.visited_details.length === 0 && <p className="text-slate-600 text-sm italic">No travel history found.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BrainCircuit className="w-64 h-64 text-emerald-400" />
        </div>
        
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                AI Strategy Report
              </h3>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Gemini 2.5 Intelligence Verified
              </p>
            </div>
            
            <div className="flex gap-3">
              {analysis && (
                <button
                  onClick={handlePlayAudio}
                  disabled={loadingAudio}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-lg
                    ${isPlaying 
                      ? 'bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'}`}
                >
                  {loadingAudio ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <StopCircle className="w-4 h-4" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                  {loadingAudio ? 'Synthesizing...' : isPlaying ? 'Stop Briefing' : 'Listen to Briefing'}
                </button>
              )}

              {!analysis && (
                <button
                  onClick={handleAIAnalysis}
                  disabled={loadingAnalysis}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 border border-emerald-500"
                >
                  {loadingAnalysis ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                  Generate Analysis
                </button>
              )}
            </div>
          </div>

          {!analysis && !loadingAnalysis && (
            <div className="bg-slate-950/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800 text-center">
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Initiate the AI analysis to receive a comprehensive breakdown of your global mobility score, visa-free access opportunities, and strategic travel recommendations.
              </p>
            </div>
          )}

          {loadingAnalysis && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-slate-950/30 rounded-lg border border-slate-800">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-900 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-emerald-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
              </div>
              <p className="text-emerald-400 font-bold tracking-widest animate-pulse">GENERATING STRATEGY...</p>
            </div>
          )}

          {analysis && (
            <div className="prose prose-invert max-w-none bg-slate-950/60 p-8 rounded-xl border border-slate-800 backdrop-blur-md shadow-2xl">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-emerald-400 border-b border-emerald-500/30 pb-2 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-emerald-400 mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2 flex items-center gap-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="space-y-2 text-slate-300 my-4" {...props} />,
                  li: ({node, ...props}) => <li className="flex gap-2" {...props}><span className="text-emerald-500 mt-1.5">•</span><span>{props.children}</span></li>,
                  p: ({node, ...props}) => <p className="text-slate-300 mb-4 leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <span className="font-bold text-white" {...props} />
                }}
              >
                {analysis}
              </ReactMarkdown>
              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Official Document • Confidential
                </span>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="text-xs text-slate-400 hover:text-white font-medium transition-colors"
                >
                  Clear Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};