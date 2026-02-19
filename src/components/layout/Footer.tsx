import { Link } from 'react-router-dom';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + value prop */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg gradient-hero" />
              <span className="font-display text-xl font-bold tracking-tight">
                The Grid Nexus
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Daily intelligence across technology, cybersecurity, and gaming. Expert coverage designed
              for professionals who need to stay ahead.
            </p>
          </div>

          {/* Coverage */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Coverage
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/tech" className="text-muted-foreground hover:text-tech transition-colors">
                Tech News & Innovation
              </Link>
              <Link to="/security" className="text-muted-foreground hover:text-security transition-colors">
                Cybersecurity & Threats
              </Link>
              <Link to="/gaming" className="text-muted-foreground hover:text-gaming transition-colors">
                Gaming & Esports
              </Link>
              <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                Breaking News
              </Link>
              <Link to="/reviews" className="text-muted-foreground hover:text-foreground transition-colors">
                Hardware & Game Reviews
              </Link>
              <Link to="/tutorials" className="text-muted-foreground hover:text-foreground transition-colors">
                Tutorials
              </Link>
              <Link to="/guides" className="text-muted-foreground hover:text-foreground transition-colors">
                Guides & Playbooks
              </Link>
              <Link to="/blog-series" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog Series
              </Link>
              <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                Explore all coverage
              </Link>
            </div>
          </div>

          {/* Tools & resources */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tools & Resources
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/security-score" className="text-muted-foreground hover:text-foreground transition-colors">
                Security Score
              </Link>
              <Link to="/breach-sim" className="text-muted-foreground hover:text-foreground transition-colors">
                Breach Sim
              </Link>
              <Link to="/nexus-intersection" className="text-muted-foreground hover:text-foreground transition-colors">
                Nexus Intersection
              </Link>
              <Link to="/ai-pulse" className="text-muted-foreground hover:text-foreground transition-colors">
                AI Pulse
              </Link>
              <Link to="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                Roadmap
              </Link>
              <Link to="/topics" className="text-muted-foreground hover:text-foreground transition-colors">
                Topics & Tags
              </Link>
              <Link to="/media" className="text-muted-foreground hover:text-foreground transition-colors">
                Media & Podcast
              </Link>
              <Link to="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                HTML Sitemap
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Intel Briefing
            </h4>
            <p className="text-sm text-muted-foreground">
              Get a concise briefing on the most important stories in tech, security, and gaming — straight
              to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Grid Nexus. All rights reserved.
          </p>
          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link to="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/editorial" className="hover:text-foreground transition-colors">
                Editorial Policy
              </Link>
              <Link to="/disclosure" className="hover:text-foreground transition-colors">
                Affiliate Disclosure
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <a
              className="clickio-cmp-settings-text clickio-cmp-settings-display text-muted-foreground hover:text-foreground transition-colors text-sm"
              style={{ display: 'none' }}
              href="#"
            >
              Your Privacy Choices
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
