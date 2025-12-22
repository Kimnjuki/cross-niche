import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ReadingProgressBarProps {
  className?: string;
}

export function ReadingProgressBar({ className }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const scrolled = scrollTop / scrollableHeight;
      setProgress(Math.min(Math.max(scrolled * 100, 0), 100));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 h-1 bg-muted z-[100] transition-opacity duration-300',
        progress > 0 ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}


