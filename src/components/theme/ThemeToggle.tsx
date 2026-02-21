/**
 * Theme Toggle Button Component - Enhanced with Glass Morphism
 */

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      setTheme('system');
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark', 'system');
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const getCurrentThemeIcon = () => {
    if (!mounted) return Monitor;
    
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    
    // System theme - check current system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return systemTheme === 'dark' ? Moon : Sun;
  };

  const getCurrentThemeLabel = () => {
    if (!mounted) return 'System';
    
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return systemTheme === 'dark' ? 'Dark' : 'Light';
  };

  const Icon = getCurrentThemeIcon();

  return (
    <div className="relative group">
      <GlassCard className="p-2 hover:scale-105 transition-all duration-300">
        <button
          onClick={() => {
            const themes: Theme[] = ['light', 'dark', 'system'];
            const currentIndex = themes.indexOf(theme);
            const nextIndex = (currentIndex + 1) % themes.length;
            handleThemeChange(themes[nextIndex]);
          }}
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-white transition-colors"
          title={`Current theme: ${getCurrentThemeLabel()}. Click to change.`}
        >
          {!mounted ? (
            <div className="w-4 h-4 bg-white/10 rounded animate-pulse"></div>
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </button>
      </GlassCard>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <GlassCard className="px-3 py-2 text-xs text-white whitespace-nowrap">
          Theme: {getCurrentThemeLabel()}
        </GlassCard>
      </div>
    </div>
  );
};

export default ThemeToggle;
