import React from 'react';
import { BloodGroupAnalysis, PatientDetails } from '../types';
import { Droplet, QrCode, ShieldCheck, Activity, Fingerprint } from 'lucide-react';

interface ResultCardProps {
  data: BloodGroupAnalysis;
  patient: PatientDetails;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, patient }) => {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const reportId = `DGP-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  return (
    <div className="w-full animate-fade-in pb-10">
      
      {/* Report Container */}
      <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Header Strip */}
        <div className="bg-primary-600 h-2 w-full"></div>
        
        {/* Report Header */}
        <div className="p-6 border-b-2 border-slate-100 flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 p-2 rounded-lg">
                <Fingerprint className="w-8 h-8 text-primary-500" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">DGP</h1>
               <p className="text-[10px] font-bold text-primary-600 tracking-widest uppercase">Biometric Pathology Lab</p>
             </div>
          </div>
          <div className="text-right">
             <div className="bg-slate-100 p-1.5 rounded-md inline-block">
                <QrCode className="w-12 h-12 text-slate-900" />
             </div>
          </div>
        </div>

        {/* Report Meta */}
        <div className="bg-slate-50 px-6 py-3 flex justify-between items-center text-xs border-b border-slate-100">
           <div>
             <span className="text-slate-500 font-semibold">REPORT ID:</span>
             <span className="ml-2 font-mono font-bold text-slate-900">{reportId}</span>
           </div>
           <div>
             <span className="text-slate-500 font-semibold">DATE:</span>
             <span className="ml-2 font-bold text-slate-900">{reportDate}</span>
           </div>
        </div>

        {/* Patient Details */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Patient Information</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Patient Name</p>
              <p className="text-sm font-bold text-slate-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Father's Name</p>
              <p className="text-sm font-bold text-slate-900">{patient.fatherName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Age / Gender</p>
              <p className="text-sm font-bold text-slate-900">{patient.age} Yrs</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Contact No</p>
              <p className="text-sm font-bold text-slate-900 font-mono">{patient.contact}</p>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mx-4 mb-4 bg-slate-50 rounded-xl p-6 border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Droplet className="w-32 h-32" />
           </div>
           
           <h3 className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-4">Diagnostic Result</h3>
           
           <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Blood Group</p>
                <div className="text-6xl font-black text-slate-900 tracking-tighter">
                  {data.bloodGroup}
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex flex-col items-end">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded mb-1">CONFIRMED</span>
                  <span className="text-3xl font-bold text-primary-600">{data.confidence}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">Probability Index</span>
                </div>
              </div>
           </div>
           
           <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Pattern Type</p>
                 <p className="text-sm font-bold text-slate-800">{data.patternType}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Rarity Score</p>
                 <p className="text-sm font-bold text-slate-800">{data.rarity}</p>
              </div>
           </div>
        </div>

        {/* Clinical Notes */}
        <div className="px-6 pb-6">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical Reasoning</h3>
           <p className="text-xs text-slate-600 leading-relaxed text-justify">
             {data.reasoning}
           </p>

           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">Genetic Traits</h3>
           <div className="flex flex-wrap gap-2">
             {data.personalityTraits.map((trait, i) => (
               <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">
                 {trait}
               </span>
             ))}
           </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-white p-4 text-[10px] flex justify-between items-center">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
              <span>Verified by AI Forensic Unit</span>
           </div>
           <div className="opacity-50">
             DGP-SYS-V.2.0
           </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
         <p className="text-[10px] text-slate-500 text-center max-w-xs">
           * This report is generated based on dermatoglyphic ridge analysis. It is a predictive model and should be verified with serological testing for medical procedures.
         </p>
      </div>

    </div>
  );
};

export default ResultCard;