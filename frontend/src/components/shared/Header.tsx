// src/components/shared/Header.tsx
import { Sun, Moon, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

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
          <h1 className="text-3xl font-bold font-display gradient-text">
            LawSimplify
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
            Features
          </a>
          <a href="#" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
            Pricing
          </a>
          <a href="#" className="text-text-secondary hover:text-text-primary transition-colors font-medium">
            About
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 p-0 rounded-full"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button size="sm" className="hidden sm:inline-flex">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};