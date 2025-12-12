import React, { useState } from 'react';
import { PassportData, VisaRecord } from '../types';
import { Plus, Trash2, CheckCircle2, Globe, FileBadge, MapPin, PlaneTakeoff, X, ShieldCheck } from 'lucide-react';

interface PassportFormProps {
  onSubmit: (data: PassportData) => void;
}

export const PassportForm: React.FC<PassportFormProps> = ({ onSubmit }) => {
  const [passportNumber, setPassportNumber] = useState('A12345678');
  const [country, setCountry] = useState('Pakistan');
  
  const [visaRecords, setVisaRecords] = useState<VisaRecord[]>([
    { country: 'USA', visa_status: 'approved' },
    { country: 'UK', visa_status: 'approved' },
    { country: 'France', visa_status: 'pending' }
  ]);

  const [travelHistory, setTravelHistory] = useState<string[]>(['USA', 'UK']);
  const [newTrip, setNewTrip] = useState('');

  // Handlers for Visa Records
  const addVisaRecord = () => {
    setVisaRecords([...visaRecords, { country: '', visa_status: 'approved' }]);
  };

  const updateVisaRecord = (index: number, field: keyof VisaRecord, value: string) => {
    const newRecords = [...visaRecords];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setVisaRecords(newRecords);
  };

  const removeVisaRecord = (index: number) => {
    setVisaRecords(visaRecords.filter((_, i) => i !== index));
  };

  // Handlers for Travel History
  const addTrip = () => {
    if (newTrip.trim()) {
      setTravelHistory([...travelHistory, newTrip.trim()]);
      setNewTrip('');
    }
  };

  const removeTrip = (index: number) => {
    setTravelHistory(travelHistory.filter((_, i) => i !== index));
  };

  const handleKeyDownTrip = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTrip();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      passport_number: passportNumber,
      country,
      visa_records: visaRecords.filter(v => v.country.trim() !== ''),
      travel_history: travelHistory
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 text-slate-200">
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2 group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileBadge className="w-4 h-4 text-amber-400" />
            Passport Number
          </label>
          <input
            type="text"
            required
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono text-white placeholder-slate-600"
            placeholder="e.g., A1234567"
          />
        </div>
        <div className="flex-1 space-y-2 group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            Citizenship
          </label>
          <input
            type="text"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-white placeholder-slate-600"
            placeholder="e.g., Pakistan"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-slate-700 pb-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Active Visas
          </h3>
          <button
            type="button"
            onClick={addVisaRecord}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 uppercase tracking-wide border border-emerald-500/20"
          >
            <Plus className="w-3 h-3" /> Add Record
          </button>
        </div>
        
        <div className="space-y-3">
          {visaRecords.map((visa, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-800/40 p-2 rounded-lg border border-slate-700 shadow-sm hover:border-slate-600 transition-all">
              <div className="flex-1 relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Country Name"
                  value={visa.country}
                  onChange={(e) => updateVisaRecord(index, 'country', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/50 rounded-md border border-slate-700 focus:outline-none focus:border-emerald-500 text-sm font-medium text-slate-200 placeholder-slate-600"
                />
              </div>
              <div className="w-full sm:w-40">
                <select
                  value={visa.visa_status}
                  onChange={(e) => updateVisaRecord(index, 'visa_status', e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 appearance-none cursor-pointer
                    ${visa.visa_status === 'approved' ? 'bg-emerald-900/30 border-emerald-800 text-emerald-400 focus:ring-emerald-500' : 
                      visa.visa_status === 'pending' ? 'bg-amber-900/30 border-amber-800 text-amber-400 focus:ring-amber-500' : 
                      'bg-red-900/30 border-red-800 text-red-400 focus:ring-red-500'}`}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeVisaRecord(index)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors self-end sm:self-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {visaRecords.length === 0 && (
            <div className="text-center py-6 bg-slate-800/30 border border-dashed border-slate-700 rounded-lg">
              <p className="text-sm text-slate-500">No visa records added yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <PlaneTakeoff className="w-5 h-5 text-indigo-400" />
          Travel History
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newTrip}
            onChange={(e) => setNewTrip(e.target.value)}
            onKeyDown={handleKeyDownTrip}
            placeholder="Type country and press Enter..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
          />
          <button
            type="button"
            onClick={addTrip}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-semibold shadow-md shadow-indigo-900/50 transition-all border border-indigo-500"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {travelHistory.map((trip, index) => (
            <span key={index} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-indigo-900/30 text-indigo-300 border border-indigo-800 rounded-full text-sm font-medium shadow-sm group">
              {trip}
              <button
                type="button"
                onClick={() => removeTrip(index)}
                className="p-0.5 hover:bg-indigo-800/50 rounded-full transition-colors text-indigo-400 hover:text-indigo-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:ring-4 focus:ring-emerald-500/30 transition-all transform active:scale-[0.99] flex justify-center items-center gap-3 border border-emerald-500"
        >
          <ShieldCheck className="w-6 h-6" />
          Verify Identity & Analyze
        </button>
      </div>
    </form>
  );
};
