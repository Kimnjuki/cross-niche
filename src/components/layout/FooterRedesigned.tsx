import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Youtube, Linkedin, Rss, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { cn } from '@/lib/utils';

// Static-shell routes (served by nginx, no SPA route) must use a full-page
// <a href>, not a client-side <Link>, or they 404 on the * catch-all.
const coverageLinks = [
  { label: 'Gaming Security', href: '/gaming', external: false },
  { label: 'Security Grades', href: '/games', external: true },
  { label: 'Is it safe?', href: '/safety', external: true },
  { label: 'Gamer Threat Report', href: '/threats', external: true },
  { label: 'Account Recovery', href: '/recover', external: true },
  { label: 'Platform Security', href: '/platforms', external: true },
];

const toolsLinks = [
  { label: 'Scam Checker', href: '/tools/scam-check', badge: null },
  { label: 'Security Checkup', href: '/tools/gaming-security-checkup', badge: null },
  { label: 'Steam Scanner', href: '/tools/steam-scanner', badge: null },
  { label: 'IOC Lookup', href: '/tools/ioc-lookup', badge: null },
];

const companyLinks = [
  { label: 'About', href: '/about', external: false },
  { label: 'Methodology', href: '/methodology', external: true },
  { label: 'Editorial policy', href: '/editorial', external: false },
  { label: 'Contact', href: '/contact', external: false },
  { label: 'Media & press kit', href: '/media', external: false },
];

const resourcesLinks = [
  { label: 'Newsletter', href: '/newsletter', external: false },
  { label: 'RSS feed', href: '/feed.xml', external: true },
  { label: 'Sitemap', href: '/sitemap', external: false },
  { label: 'Guides', href: '/guides', external: false },
];

const socialLinks = [
  { label: 'X (Twitter)', href: 'https://twitter.com/thegridnexus', icon: Twitter },
  { label: 'Facebook', href: 'https://facebook.com/thegridnexus', icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com/@thegridnexus', icon: Youtube },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/thegridnexus', icon: Linkedin },
  { label: 'RSS', href: '/feed.xml', icon: Rss },
];

const trustLabels = [
  'Editorially independent',
  'Sources disclosed',
  'Security-conscious design',
];

function FooterColumn({ title, links, className }: { title: string; links: Array<{ label: string; href: string; external?: boolean; badge?: string | null }>; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            {link.external ? (
              <a
                href={link.href}
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-cyan"
              >
                <span className="h-px w-0 bg-cyan transition-all duration-300 group-hover:w-3" />
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-cyan"
              >
                <span className="h-px w-0 bg-cyan transition-all duration-300 group-hover:w-3" />
                {link.label}
                {link.badge && (
                  <span className="text-[10px] font-medium uppercase tracking-wider text-cyan bg-cyan/10 px-1.5 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.dispatchEvent(new CustomEvent('newsletter:signup', { detail: { email } }));
    setEmail('');
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-gradient-to-b from-ink-950 to-black text-slate-300" role="contentinfo">
      {/* Futuristic top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-60" />

      {/* Pre-footer CTA banner */}
      <div className="bg-gradient-to-br from-ink-800 to-ink-900 border-b border-white/[0.06]">
        <div className="container-tokens py-12 md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
              Stay ahead of the next digital threat
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Get practical technology, security and gaming intelligence in your inbox. No noise—only useful updates and actions.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 bg-ink-950 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                aria-label="Email for newsletter"
              />
              <Button type="submit" size="lg" className="h-12 bg-cyan text-ink-950 hover:bg-cyan/90 font-semibold whitespace-nowrap">
                Subscribe to Nexus Brief
              </Button>
            </form>
            <p className="text-xs text-slate-500 mt-3">
              Unsubscribe anytime. Privacy-first. Weekly by default.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="container-tokens py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan via-violet to-amber flex items-center justify-center">
                <div className="w-7 h-7 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan to-violet animate-pulse" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                The Grid Nexus
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The trust layer for gamers — check what's safe, recover fast, and stay ahead of the next threat.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="text-slate-500 hover:text-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Coverage */}
          <FooterColumn title="Coverage" links={coverageLinks} />

          {/* Tools */}
          <div>
            <FooterColumn title="Free Tools" links={toolsLinks} />
          </div>

          {/* Company */}
          <FooterColumn title="The Nexus" links={companyLinks} />

          {/* Resources */}
          <FooterColumn title="Resources" links={resourcesLinks} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-tokens py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {year} The Grid Nexus. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Privacy policy
            </Link>
            <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Terms of service
            </Link>
            <Link to="/disclosure" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Disclosure policy
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {trustLabels.map((label) => (
              <span key={label} className="text-[11px] text-slate-600 hidden md:inline-flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
