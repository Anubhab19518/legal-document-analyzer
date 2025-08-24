// src/components/shared/FileUploader.tsx
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { cn, formatFileSize, isValidPDF } from '../../lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  error?: string | null;
}

export const FileUploader = ({ onFileUpload, isLoading, error }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (!file) return;
    
    if (!isValidPDF(file)) {
      return;
    }
    
    onFileUpload(file);
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!isValidPDF(file)) {
      return;
    }
    
    onFileUpload(file);
  }, [onFileUpload]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size={48} text="Analyzing your document..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer hover:border-accent/50',
          isDragOver ? 'border-accent bg-accent/5' : 'border-border',
          'bg-muted/30'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          title="Select a PDF file to upload"
          placeholder="Choose a PDF file"
        />
        
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            {isDragOver ? (
              <FileText className="w-8 h-8 text-accent" />
            ) : (
              <Upload className="w-8 h-8 text-accent" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text-primary">
              {isDragOver ? 'Drop your document here' : 'Upload Legal Document'}
            </h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Drag and drop your PDF document here, or click to select a file from your computer
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="min-w-[140px]">
              Select File
            </Button>
            <p className="text-sm text-text-secondary">
              PDF files only • Max 10MB
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};