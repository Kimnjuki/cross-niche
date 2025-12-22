import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreakingNews {
  id: string;
  title: string;
  url: string;
  severity: 'critical' | 'high' | 'medium';
  publishedAt: string;
}

interface BreakingNewsBannerProps {
  news?: BreakingNews[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

const mockBreakingNews: BreakingNews[] = [
  {
    id: '1',
    title: 'Critical UEFI flaw enables pre-boot attacks on motherboards from Gigabyte, MSI, ASUS, ASRock',
    url: '/article/uefi-flaw-2024',
    severity: 'critical',
    publishedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Microsoft 365 accounts targeted in wave of OAuth phishing attacks',
    url: '/article/microsoft-365-oauth-phishing',
    severity: 'high',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Over 25,000 FortiCloud SSO devices exposed to remote attacks',
    url: '/article/forticloud-sso-exposure',
    severity: 'high',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export function BreakingNewsBanner({ 
  news = mockBreakingNews, 
  autoRotate = true,
  rotationInterval = 5000 
}: BreakingNewsBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleNews = news.filter(n => !dismissedIds.has(n.id));

  useEffect(() => {
    if (!autoRotate || visibleNews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleNews.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, visibleNews.length]);

  if (!isVisible || visibleNews.length === 0) return null;

  const currentNews = visibleNews[currentIndex];
  if (!currentNews) return null;

  const severityStyles = {
    critical: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400',
    high: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400',
    medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    if (dismissedIds.size + 1 >= visibleNews.length) {
      setIsVisible(false);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className={cn(
      'sticky top-0 z-[60] border-b border-border/50 backdrop-blur-lg',
      severityStyles[currentNews.severity]
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider">Breaking</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              to={currentNews.url}
              className="hover:underline line-clamp-1 text-sm font-medium"
            >
              {currentNews.title}
            </Link>
          </div>

          {visibleNews.length > 1 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {visibleNews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all',
                    idx === currentIndex 
                      ? 'bg-current w-4' 
                      : 'bg-current/30 hover:bg-current/50'
                  )}
                  aria-label={`Go to news item ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={() => handleDismiss(currentNews.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

