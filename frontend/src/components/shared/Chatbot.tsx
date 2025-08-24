// src/components/shared/Chatbot.tsx
import { useState } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
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

  return (
    <div className={cn('bg-foreground border border-border rounded-xl shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Ask Questions</h3>
          <p className="text-text-secondary text-sm">Get clarification about your document</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-80 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-text-secondary" />
            </div>
            <div>
              <h4 className="text-text-primary font-medium mb-1">Start a conversation</h4>
              <p className="text-text-secondary text-sm">Ask me anything about your legal document</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="space-y-4">
            {/* User Message */}
            <div className="flex items-start justify-end gap-3">
              <div className="max-w-[80%] bg-accent text-white rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-sm">{message.user}</p>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-text-secondary" />
              </div>
              <div className="max-w-[80%] bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-text-primary leading-relaxed">{message.ai}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-text-secondary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your document..."
            className="flex-1 bg-transparent border-0 outline-none text-text-primary placeholder-text-secondary text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};