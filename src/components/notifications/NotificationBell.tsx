import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  alerts: Alert[];
  unreadCount: number;
  onAlertClick?: (alert: Alert) => void;
  onMarkAllRead?: () => void;
  onDismissAlert?: (id: string) => void;
  className?: string;
}

const priorityColors = {
  low: 'var(--accent-cyan)',
  medium: 'var(--accent-amber)',
  high: 'var(--accent-red)',
  critical: 'var(--accent-red)'
};

export function NotificationBell({
  alerts,
  unreadCount,
  onAlertClick,
  onMarkAllRead,
  onDismissAlert,
  className
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (unreadCount > 0) {
      setHasNew(true);
      const timer = setTimeout(() => setHasNew(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-180ms"
        aria-label="Notifications"
        title="Signals"
      >
        <Bell className="h-[18px] w-[18px]" />

        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--accent-red)] text-white text-[10px] font-bold flex items-center justify-center',
              hasNew && 'animate-bell-pulse'
            )}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[520px] bg-[var(--bg-elevated)] border border-[var(--border-default)] border-t-2 border-t-[var(--accent-cyan)] rounded-[var(--radius-md)] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-y-auto z-[200] animate-dropdown-enter">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
            <h4 className="font-[var(--font-heading)] text-sm text-[var(--text-primary)]">
              Signals
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-[var(--accent-cyan)] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="h-8 w-8 text-[var(--text-tertiary)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">No new signals</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => onAlertClick?.(alert)}
                  className={cn(
                    'w-full text-left p-4 transition-all duration-[180ms] ease-out hover:bg-[rgba(255,255,255,0.03)]',
                    !alert.read && 'bg-[rgba(255,255,255,0.015)]'
                  )}
                  style={!alert.read ? { borderLeft: `2px solid ${priorityColors[alert.priority]}` } : {}}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-[var(--text-primary)]">
                        {alert.title}
                      </h5>
                      {alert.description && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {alert.description}
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {alert.createdAt}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismissAlert?.(alert.id);
                      }}
                      className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}