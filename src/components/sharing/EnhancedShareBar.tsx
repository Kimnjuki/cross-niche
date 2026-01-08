import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Copy,
  QrCode,
  MessageCircle,
  Send,
  Share2,
  TrendingUp,
  Eye,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface EnhancedShareBarProps {
  article: Article;
  className?: string;
  variant?: 'inline' | 'floating' | 'sticky';
}

export function EnhancedShareBar({ article, className, variant = 'inline' }: EnhancedShareBarProps) {
  const [isVisible, setIsVisible] = useState(variant !== 'floating');
  const [shareCount, setShareCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock social proof data
  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 10000) + 1000);
    setShareCount(Math.floor(Math.random() * 500) + 50);
  }, [article.id]);

  // Floating share bar logic
  useEffect(() => {
    if (variant === 'floating') {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        const articleStart = 300; // Show after scrolling past hero
        const articleEnd = document.documentElement.scrollHeight - window.innerHeight - 500;

        setIsVisible(scrollTop > articleStart && scrollTop < articleEnd);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  const articleUrl = window.location.href;
  const articleTitle = article.title;
  const articleExcerpt = article.excerpt.substring(0, 150) + '...';

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(articleUrl)}&via=TheGridNexus`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(articleTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent(articleExcerpt)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(articleUrl)}&t=${encodeURIComponent(articleTitle)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${articleTitle} ${articleUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
    email: `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(`${articleExcerpt}\n\nRead more: ${articleUrl}`)}`,
  };

  const handleShare = (platform: string) => {
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setShareCount(prev => prev + 1);

      toast({
        title: `Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
        description: 'Thanks for sharing!',
      });
    }
  };

  const copyToClipboard = async (text?: string) => {
    const textToCopy = text || articleUrl;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedText(textToCopy);
      toast({
        title: 'Copied to clipboard!',
        description: text ? 'Selected text copied' : 'Article link copied',
      });
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const generateQRCode = () => {
    // Mock QR code generation - in real implementation, use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(articleUrl)}`;
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 10) {
      const selectedText = selection.toString();
      toast({
        title: 'Text selected',
        description: 'Click to tweet this selection',
        action: (
          <Button
            size="sm"
            onClick={() => {
              const tweetText = `"${selectedText}" - ${articleTitle}`;
              const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(articleUrl)}&via=TheGridNexus`;
              window.open(tweetUrl, '_blank', 'width=600,height=400');
            }}
          >
            Tweet Selection
          </Button>
        ),
      });
    }
  };

  // Text selection listener
  useEffect(() => {
    document.addEventListener('selectionchange', handleTextSelection);
    return () => document.removeEventListener('selectionchange', handleTextSelection);
  }, []);

  if (variant === 'floating' && !isVisible) return null;

  const shareButtons = [
    { key: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:text-blue-500', isEmoji: false },
    { key: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600', isEmoji: false },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700', isEmoji: false },
    { key: 'reddit', icon: '🔴', label: 'Reddit', color: 'hover:text-orange-500', isEmoji: true },
    { key: 'hackernews', icon: '🟠', label: 'HN', color: 'hover:text-orange-600', isEmoji: true },
    { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'hover:text-green-500', isEmoji: false },
    { key: 'telegram', icon: Send, label: 'Telegram', color: 'hover:text-blue-400', isEmoji: false },
  ];

  return (
    <div className={cn(
      'border border-border rounded-lg p-4 bg-card',
      variant === 'floating' && 'fixed right-6 top-1/2 -translate-y-1/2 z-50 shadow-lg',
      variant === 'sticky' && 'sticky top-4',
      className
    )}>
      {/* Social Proof */}
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{viewCount.toLocaleString()} views</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>{shareCount} shares</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{article.readTime} min read</span>
        </div>
        {article.isFeatured && (
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>

      {/* Share Title */}
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="h-4 w-4" />
        <span className="text-sm font-medium">Share this article</span>
      </div>

      {/* Primary Share Buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {shareButtons.slice(0, 4).map(({ key, icon: Icon, label, color, isEmoji }) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            onClick={() => handleShare(key)}
            className={cn('gap-1', color)}
          >
            {isEmoji ? (
              <span className="text-lg">{Icon}</span>
            ) : (
              <Icon className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard()}
          className="gap-1"
        >
          <Copy className={cn('h-4 w-4', copiedText === articleUrl && 'text-green-600')} />
          Copy Link
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('email')}
          className="gap-1"
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share via QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <img
                src={generateQRCode()}
                alt="QR Code for sharing"
                className="w-48 h-48 border rounded"
              />
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code to access the article on mobile devices
              </p>
              <Button onClick={() => copyToClipboard()} className="w-full">
                Copy Link Instead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* More Options */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full gap-1">
            <Share2 className="h-4 w-4" />
            More sharing options
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>All Sharing Options</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {shareButtons.map(({ key, icon: Icon, label, color, isEmoji }) => (
              <Button
                key={key}
                variant="outline"
                onClick={() => handleShare(key)}
                className={cn('justify-start gap-2 h-auto p-3', color)}
              >
                {isEmoji ? (
                  <span className="text-lg">{Icon}</span>
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                {label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tip */}
      <p className="text-xs text-muted-foreground mt-3">
        💡 Tip: Select any text in the article to share quotes on Twitter
      </p>
    </div>
  );
}