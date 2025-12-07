import React, { useState } from 'react';
import { User, Phone, Calendar, FileText, ChevronRight } from 'lucide-react';
import { PatientDetails } from '../types';

interface PatientFormProps {
  onSubmit: (details: PatientDetails) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onCancel }) => {
  const [details, setDetails] = useState<PatientDetails>({
    name: '',
    fatherName: '',
    age: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.name && details.age) {
      onSubmit(details);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Patient Details</h3>
            <p className="text-xs text-slate-400">Required for official report generation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                placeholder="Enter patient name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Father's Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="fatherName"
                value={details.fatherName}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                placeholder="Enter father's name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  name="age"
                  value={details.age}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                  placeholder="Yrs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Contact No</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  name="contact"
                  value={details.contact}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-600"
                  placeholder="Mobile"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-900/30 hover:bg-primary-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Generate Report <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;