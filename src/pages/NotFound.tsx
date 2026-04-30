import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';
import { Home, ArrowLeft, TrendingUp, Shield, Gamepad2, Search, ExternalLink } from 'lucide-react';

const SUGGESTED_ARTICLES = [
  { title: 'Gmail Hack Attacks Surge — Every Gamer Needs 2FA Now', slug: 'gmail-hack-attacks-surge-gamers-2fa-2026', niche: 'security' },
  { title: 'Steam Account Takeover Protection Guide', slug: 'steam-account-takeover-protection-guide-2026', niche: 'security' },
  { title: 'Discord Malware Alert — How to Stay Safe', slug: 'discord-malware-gamers-how-to-stay-safe', niche: 'security' },
  { title: 'Nintendo Switch 2 Security Guide', slug: 'nintendo-switch-2-security-guide', niche: 'security' },
  { title: 'Windows 11 Anti-Cheat Fix Guide', slug: 'windows-11-anti-cheat-broken-fix-guide', niche: 'gaming' },
  { title: 'VPNs for Gaming — Do They Actually Protect You?', slug: 'vpn-gaming-security-latency-test-2026', niche: 'gaming' },
];

const NotFound = () => {
  const location = useLocation();
  const [suggestions, setSuggestions] = useState(SUGGESTED_ARTICLES);

  // Try to guess what article the user wanted based on the URL path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const matched = SUGGESTED_ARTICLES.filter(a =>
      a.slug.split('-').some(word => path.includes(word))
    );
    if (matched.length > 0) {
      setSuggestions(matched);
    }
  }, [location.pathname]);

  // Track 404 in GA4
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view_404', {
        page_path: location.pathname + location.search,
        page_title: '404: ' + location.pathname,
        engagement_time_msec: 1
      });
    }
  }, [location.pathname, location.search]);

  return (
    <Layout>
      <SEOHead
        title="Page Not Found | The Grid Nexus"
        description="The page you're looking for doesn't exist. Explore our tech news, cybersecurity insights, and gaming coverage."
        keywords={['404', 'page not found', 'tech news', 'cybersecurity', 'gaming']}
        url={window.location.href}
        type="website"
        noindex={true}
      />
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* Internal Links Section - SEO Best Practice */}
          {/* Show what URL caused the 404 */}
          <div className="mt-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <p className="text-xs text-zinc-500 font-mono">
              Page not found: <code className="text-zinc-400">{location.pathname}</code>
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Try searching or browsing one of the sections below.
            </p>
          </div>

          {/* Suggested articles - try to help the user find what they wanted */}
          {suggestions.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="text-lg font-semibold mb-2">You Might Be Looking For</h2>
              <p className="text-xs text-muted-foreground mb-4">Popular articles on The Grid Nexus:</p>
              <div className="flex flex-col gap-2">
                {suggestions.slice(0, 4).map((a) => (
                  <Link
                    key={a.slug}
                    to={`/${a.niche}/${a.slug}`}
                    className="group flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-left"
                  >
                    <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors line-clamp-1">
                      {a.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">Explore Our Content</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Discover the latest in technology, cybersecurity, and gaming:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/tech" 
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <TrendingUp className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Tech News</h3>
                <p className="text-sm text-muted-foreground">Latest technology trends and innovations</p>
              </Link>
              <Link 
                to="/security" 
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <Shield className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Cybersecurity</h3>
                <p className="text-sm text-muted-foreground">Security threats and protection strategies</p>
              </Link>
              <Link 
                to="/gaming" 
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <Gamepad2 className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Gaming</h3>
                <p className="text-sm text-muted-foreground">Gaming news, reviews, and guides</p>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/blog-series" className="text-primary hover:underline">All Articles</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/guides" className="text-primary hover:underline">Guides</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/topics" className="text-primary hover:underline">Topics</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/about" className="text-primary hover:underline">About</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
