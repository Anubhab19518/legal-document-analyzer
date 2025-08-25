// src/components/shared/AnalysisDisplay.tsx
import { Flag, FileText, AlertTriangle, CheckCircle, Shield, Eye, TrendingUp } from 'lucide-react';
import type { AnalysisResult } from '../../types';
import { cn } from '../../lib/utils';

interface AnalysisDisplayProps {
  analysisResult: AnalysisResult;
}

export const AnalysisDisplay = ({ analysisResult }: AnalysisDisplayProps) => {
  const { summary, keyClauses, redFlags } = analysisResult;

  return (
    <div className="space-y-16">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6 text-center group hover:glow-effect transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold font-mono text-text-primary mb-1">1</h3>
          <p className="text-text-secondary text-sm font-medium">Document Analyzed</p>
        </div>
        
        <div className="glass-effect rounded-xl p-6 text-center group hover:glow-effect transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold font-mono text-text-primary mb-1">{keyClauses.length}</h3>
          <p className="text-text-secondary text-sm font-medium">Key Clauses Found</p>
        </div>
        
        <div className="glass-effect rounded-xl p-6 text-center group hover:glow-effect transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-destructive to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold font-mono text-destructive mb-1">{redFlags.length}</h3>
          <p className="text-text-secondary text-sm font-medium">Red Flags Detected</p>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid gap-8 xl:grid-cols-3">
        {/* Summary - Takes full width on larger screens */}
        <div className="xl:col-span-3">
          <div className="glass-effect rounded-2xl p-8 glow-effect">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-gradient-start to-gradient-end rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-text-primary">Document Summary</h2>
                <p className="text-text-secondary">AI-generated overview of your legal document</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
              <p className="text-text-primary text-lg leading-relaxed font-medium">{summary}</p>
            </div>
          </div>
        </div>

        {/* Key Clauses */}
        <div className="xl:col-span-2">
          <div className="glass-effect rounded-2xl p-8 h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-text-primary">Key Clauses</h2>
                <p className="text-text-secondary">Important terms and conditions identified</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {keyClauses.map((clause, index) => (
                <div key={index} className="group">
                  <div className="bg-card/50 border border-border/50 rounded-xl p-6 transition-all duration-300 hover:border-accent/50 hover:bg-card/80">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-gradient-start/20 to-gradient-end/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:from-gradient-start/30 group-hover:to-gradient-end/30 transition-all">
                        <span className="text-accent font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-text-primary text-lg mb-3 font-display">
                          {clause.title}
                        </h4>
                        <p className="text-text-secondary leading-relaxed">
                          {clause.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Red Flags - Emphasized Section */}
        <div className="xl:col-span-1">
          <div className={cn(
            "glass-effect rounded-2xl p-8 h-full border-2 transition-all duration-300",
            redFlags.length > 0 
              ? "border-destructive/30 bg-destructive/5 glow-effect" 
              : "border-green-500/30 bg-green-500/5"
          )}>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                redFlags.length > 0
                  ? "bg-gradient-to-r from-destructive to-red-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              )}>
                {redFlags.length > 0 ? (
                  <Flag className="w-6 h-6 text-white" />
                ) : (
                  <Shield className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                  Red Flags
                  {redFlags.length > 0 && (
                    <span className="bg-destructive text-white text-sm px-2 py-1 rounded-full font-mono">
                      {redFlags.length}
                    </span>
                  )}
                </h2>
                <p className="text-text-secondary">
                  {redFlags.length > 0 ? "Potential risks detected" : "No risks found"}
                </p>
              </div>
            </div>
            
            {redFlags.length > 0 ? (
              <div className="space-y-4">
                {redFlags.map((flag, index) => (
                  <div key={index} className="group">
                    <div className="bg-destructive/10 border-2 border-destructive/20 rounded-xl p-6 transition-all duration-300 hover:border-destructive/40 hover:bg-destructive/15">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-destructive/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-destructive/30 transition-all">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-destructive text-lg mb-3 font-display">
                            {flag.title}
                          </h4>
                          <p className="text-text-secondary leading-relaxed text-sm">
                            {flag.detail}
                          </p>
                        </div>
                      </div>
                      
                      {/* Severity indicator */}
                      <div className="mt-4 pt-4 border-t border-destructive/10">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-destructive bg-destructive/10 px-2 py-1 rounded">
                            HIGH RISK
                          </span>
                          <span className="text-xs text-text-secondary">
                            Requires immediate attention
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-bold text-green-500 text-lg mb-2 font-display">All Clear!</h4>
                <p className="text-text-secondary text-sm">
                  No significant red flags detected in this document. The terms appear to be standard and reasonable.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};