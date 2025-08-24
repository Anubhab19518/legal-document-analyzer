// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 disabled:bg-accent/50',
    secondary: 'bg-muted text-text-primary border border-border hover:bg-muted/80 disabled:bg-muted/50',
    ghost: 'text-text-primary hover:bg-muted disabled:text-text-secondary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};