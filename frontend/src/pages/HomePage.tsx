// src/pages/HomePage.tsx
import { useState } from 'react';
import { Header } from '../components/shared/Header';
import { FileUploader } from '../components/shared/FileUploader';
import { AnalysisDisplay } from '../components/shared/AnalysisDisplay';
import { Chatbot } from '../components/shared/Chatbot';
import { Loader } from '../components/ui/Loader';
import { analyzeDocument } from '../lib/api';
import type { AnalysisResult } from '../types';
import { Button } from '../components/ui/Button';
import { RotateCcw } from 'lucide-react';

export const HomePage = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeDocument(file);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze document. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader size={64} text="Analyzing your legal document..." />
          </div>
        )}

        {/* Initial Upload State */}
        {!isLoading && !analysisResult && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
                Simplify Your Legal Documents
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Upload your legal document and get an AI-powered analysis with key clauses, 
                potential red flags, and easy-to-understand summaries.
              </p>
            </div>
            
            <FileUploader
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              error={error}
            />
          </div>
        )}

        {/* Analysis Results State */}
        {!isLoading && analysisResult && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-text-primary">Document Analysis</h1>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze Another Document
              </Button>
            </div>
            
            <AnalysisDisplay analysisResult={analysisResult} />
            
            <div className="max-w-4xl mx-auto">
              <Chatbot />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};