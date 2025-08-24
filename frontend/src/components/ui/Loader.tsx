// src/components/ui/Loader.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

export const Loader = ({ size = 32, className, text }: LoaderProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className="animate-spin text-accent" size={size} />
      {text && (
        <p className="text-text-secondary text-sm font-medium">{text}</p>
      )}
    </div>
  );
};