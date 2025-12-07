import React, { useState } from 'react';
import Uploader from './components/Uploader';
import ResultCard from './components/ResultCard';
import PatientForm from './components/PatientForm';
import { analyzeFingerprint } from './services/geminiService';
import { BloodGroupAnalysis, PatientDetails } from './types';
import { Fingerprint, Menu } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  const [result, setResult] = useState<BloodGroupAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (file: File) => {
    setSelectedImage(file);
    // Reset subsequent states if a new image is selected
    setPatientDetails(null);
    setResult(null);
    setError(null);
  };

  const handlePatientDetailsSubmit = (details: PatientDetails) => {
    setPatientDetails(details);
    // Automatically trigger analysis after details are submitted
    handleAnalyze(details);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPatientDetails(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (details: PatientDetails) => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysisData = await analyzeFingerprint(selectedImage);
      setResult(analysisData);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
      // If analysis fails, we might want to let them try again without re-entering details,
      // but keeping details is fine.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-10">
      
      {/* Mobile App Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-1.5 rounded-lg shadow-lg shadow-primary-900/50">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            DGP <span className="text-primary-500 text-xs font-normal opacity-80">LABS</span>
          </h1>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full">
           <Menu className="w-5 h-5 text-slate-400" />
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="container max-w-lg mx-auto px-4 mt-6">
        
        {/* Intro / Status - Only show if we haven't started the process */}
        {!selectedImage && (
          <div className="mb-8 text-center animate-fade-in">
             <h2 className="text-2xl font-bold text-white mb-2">Biometric Analysis</h2>
             <p className="text-slate-400 text-sm">
               Secure forensic-grade dermatoglyphic scanner.
             </p>
          </div>
        )}

        {/* Workflow Manager */}
        <div className="flex flex-col gap-6">
          
          {/* Step 1: Upload (Hidden if result is showing to focus on report) */}
          {!result && (
            <Uploader 
              onImageSelected={handleImageSelected} 
              selectedImage={selectedImage}
              onClear={handleClear}
              isAnalyzing={isLoading}
            />
          )}

          {/* Step 2: Patient Form (Shown after image selected, hidden if analyzing or result shown) */}
          {selectedImage && !patientDetails && !isLoading && !result && (
             <PatientForm 
                onSubmit={handlePatientDetailsSubmit} 
                onCancel={handleClear} 
             />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center mt-4">
               <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-6 h-6 text-primary-500/50 animate-pulse" />
                  </div>
               </div>
              <p className="text-primary-500 text-sm font-mono mt-4 animate-pulse">
                GENERATING MEDICAL REPORT...
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Analyzing Ridge Patterns & Minutiae
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
              {error}
              <button onClick={() => setError(null)} className="block w-full mt-2 text-xs font-bold underline">Try Again</button>
            </div>
          )}
        </div>

        {/* Step 3: Report Result */}
        {result && patientDetails && (
          <div className="mt-2">
            <ResultCard data={result} patient={patientDetails} />
            
            <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleClear}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
                >
                  New Scan
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/30"
                >
                  Print Report
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;