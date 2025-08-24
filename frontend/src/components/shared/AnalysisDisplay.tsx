// src/components/shared/AnalysisDisplay.tsx
import { Flag, FileText, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import type { AnalysisResult } from '../../types';

interface AnalysisDisplayProps {
  analysisResult: AnalysisResult;
}

export const AnalysisDisplay = ({ analysisResult }: AnalysisDisplayProps) => {
  const { summary, keyClauses, redFlags } = analysisResult;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-text-primary">Analysis Complete</h2>
        <p className="text-text-secondary">Here's what we found in your document</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
        {/* Summary */}
        <Card title="Document Summary" className="xl:col-span-2">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-text-primary leading-relaxed">{summary}</p>
          </div>
        </Card>

        {/* Key Clauses */}
        <Card title="Key Clauses">
          <div className="space-y-4">
            {keyClauses.map((clause, index) => (
              <div key={index} className="border-l-4 border-accent pl-4 py-2">
                <h4 className="font-semibold text-text-primary mb-2">
                  {clause.title}
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {clause.detail}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Red Flags */}
        <Card title="Red Flags" className={redFlags.length > 0 ? 'border-destructive/20' : ''}>
          {redFlags.length > 0 ? (
            <div className="space-y-4">
              {redFlags.map((flag, index) => (
                <div key={index} className="border-l-4 border-destructive pl-4 py-2 bg-destructive/5 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Flag className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-destructive mb-2">
                        {flag.title}
                      </h4>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {flag.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-medium">No red flags detected in this document.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};