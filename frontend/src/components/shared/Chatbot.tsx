// src/components/shared/Chatbot.tsx
import { useState } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { askQuestion } from '../../lib/api';
import type { ChatMessage } from '../../types';
import { cn } from '../../lib/utils';

interface ChatbotProps {
  className?: string;
}

export const Chatbot = ({ className }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askQuestion(userMessage);
      const newMessage: ChatMessage = {
        user: userMessage,
        ai: response.answer,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        user: userMessage,
        ai: 'I apologize, but I encountered an error while processing your question. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are the key payment terms?",
    "Are there any termination clauses?",
    "What are my obligations under this contract?",
    "Are there any penalties mentioned?",
  ];

  return (
    <div className={cn('glass-effect rounded-2xl overflow-hidden glow-effect', className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gradient-start/10 to-gradient-end/10 p-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-gradient-start to-gradient-end rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-text-primary flex items-center gap-2">
              AI Legal Assistant
              <Sparkles className="w-4 h-4 text-gradient-start" />
            </h3>
            <p className="text-text-secondary text-sm">Ask me anything about your document</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-gradient-start/20 to-gradient-end/20 rounded-2xl flex items-center justify-center">
                <Bot className="w-10 h-10 text-accent" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gradient-start/10 to-gradient-end/10 rounded-2xl blur-xl animate-pulse-slow"></div>
            </div>
            <div className="space-y-3">
              <h4 className="text-text-primary font-bold text-lg font-display">Ready to Help</h4>
              <p className="text-text-secondary max-w-sm">
                I've analyzed your document. Ask me specific questions to get detailed explanations.
              </p>
            </div>
            
            {/* Suggested Questions */}
            <div className="w-full max-w-md space-y-3">
              <p className="text-text-secondary text-sm font-medium">Try asking:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="text-left p-3 bg-muted/30 hover:bg-accent/10 rounded-xl text-sm text-text-secondary hover:text-accent transition-all duration-200 border border-border/30 hover:border-accent/30"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="space-y-4">
            {/* User Message */}
            <div className="flex items-start justify-end gap-3">
              <div className="max-w-[85%] bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg">
                <p className="text-sm leading-relaxed">{message.user}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-gradient-start to-gradient-end rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-card border-2 border-border rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div className="max-w-[85%] bg-card/50 border border-border/50 rounded-2xl rounded-tl-md px-4 py-4 shadow-lg">
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{message.ai}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                  <Zap className="w-3 h-3 text-accent" />
                  <span className="text-xs text-text-secondary font-mono">AI Response</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-card border-2 border-border rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div className="bg-card/50 border border-border/50 rounded-2xl rounded-tl-md px-4 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Loader size={16} />
                <span className="text-text-secondary text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about clauses, terms, obligations..."
              className="w-full bg-card/50 border border-border/50 rounded-xl px-4 py-3 pr-12 outline-none text-text-primary placeholder-text-secondary text-sm focus:border-accent/50 focus:bg-card/80 transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-12 w-12 p-0 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end hover:from-gradient-start/90 hover:to-gradient-end/90 shadow-lg glow-effect"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Press Enter to send • AI responses are generated based on your document
        </p>
      </div>
    </div>
  );
};
