import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SiteFooter() {
  return (
    <footer className="bg-[#020408] border-t border-[var(--border-default)] mt-auto">
      {/* Top accent gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-violet)] to-[var(--accent-amber)]" />

      <div className="container-tokens py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="max-w-[240px]">
            <Link
              to="/"
              className="flex items-center gap-2 font-[var(--font-display)] text-[0.875rem] tracking-[0.15em] text-[var(--text-primary)] mb-4"
            >
              <span className="text-[var(--accent-cyan)]">●</span>
              THE GRID NEXUS
            </Link>
            <p className="text-[var(--text-secondary)] mb-3">
              Exclusive tech, security & gaming intelligence.
            </p>
            <p className="text-[var(--text-tertiary)] text-sm">
              Curated signal over noise. For analysts, operators, and power users.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--text-primary)] text-xs mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {['Tech Intelligence', 'Security Intel', 'Gaming Hub', 'All Topics', 'Latest Signals', 'Breaking Alerts'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-[var(--text-secondary)] text-sm transition-colors duration-180ms hover:text-[var(--text-primary)]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--text-primary)] text-xs mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {['About', 'Contact', 'Editorial Policy', 'Terms of Service', 'Privacy Policy', 'Cookie Preferences'].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-[var(--text-secondary)] text-sm transition-colors duration-180ms hover:text-[var(--text-primary)]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--text-primary)] text-xs mb-4">
              Connect
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="text-[var(--text-tertiary)] transition-colors duration-180ms hover:text-[var(--text-primary)]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[var(--text-tertiary)] transition-colors duration-180ms hover:text-[var(--text-primary)]">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-[var(--text-tertiary)] transition-colors duration-180ms hover:text-[var(--text-primary)]">
                <Rss className="h-5 w-5" />
              </a>
            </div>

            <div>
              <label className="font-[var(--font-label)] text-xs tracking-[0.09em] uppercase text-[var(--text-secondary)] mb-2 block">
                Weekly Intel Brief
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="h-10"
                />
                <Button size="sm">Subscribe</Button>
              </div>
              <p className="text-[var(--text-tertiary)] text-xs mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-subtle)] py-4">
        <div className="container-tokens flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[var(--text-tertiary)] text-xs">
            © 2026 The Grid Nexus. All signals reserved.
          </p>
          <p className="text-[var(--text-tertiary)] text-xs">
            Built for analysts.
          </p>
        </div>
      </div>
    </footer>
  );
}