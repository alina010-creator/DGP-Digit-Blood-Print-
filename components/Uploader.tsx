import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Scan } from 'lucide-react';

interface UploaderProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onImageSelected, selectedImage, onClear, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div
          className={`relative border border-dashed rounded-3xl h-64 flex flex-col items-center justify-center transition-all duration-300
            ${isDragging 
              ? 'border-primary-500 bg-primary-900/10' 
              : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
            }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleInputChange}
          />
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 shadow-lg border border-slate-700">
             <Upload className="w-6 h-6 text-primary-500" />
          </div>
          <p className="text-base font-medium text-slate-200">Tap to Upload Fingerprint</p>
          <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-black shadow-2xl h-[400px]">
           {/* Scan Overlay */}
           {isAnalyzing && (
              <div className="absolute inset-0 z-20">
                <div className="w-full h-1 bg-primary-500/80 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-scan"></div>
                <div className="absolute inset-0 bg-primary-900/10 animate-pulse"></div>
              </div>
           )}
             
            <img 
              src={previewUrl || ''} 
              alt="Scan Target" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${isAnalyzing ? 'opacity-40 grayscale' : 'opacity-100'}`}
            />
            
            {!isAnalyzing && (
               <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                 <Scan className="w-16 h-16 text-primary-500 animate-pulse-slow opacity-80" />
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Uploader;