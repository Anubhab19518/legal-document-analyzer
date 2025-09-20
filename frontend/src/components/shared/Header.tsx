// src/components/shared/Header.tsx
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-gradient-start to-gradient-end rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end rounded-xl blur opacity-50 animate-pulse-slow"></div>
          </div>
          <Link to="/" className="text-3xl font-bold font-display gradient-text focus:outline-none">
            LawSimplify
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
            Features
          </Link>
          <Link to="/pricing" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
            Pricing
          </Link>
          <Link to="/about" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};