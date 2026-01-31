import { Link } from 'react-router-dom';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-hero" />
              <span className="font-display font-bold text-xl">The Grid Nexus</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted source for tech, security, and gaming news. Stay informed, stay secure, stay ahead.
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="font-display font-semibold mb-4">Content</h4>
            <div className="flex flex-col gap-2">
              <Link to="/tech" className="text-muted-foreground hover:text-tech transition-colors">
                Tech News
              </Link>
              <Link to="/security" className="text-muted-foreground hover:text-security transition-colors">
                Security
              </Link>
              <Link to="/gaming" className="text-muted-foreground hover:text-gaming transition-colors">
                Gaming
              </Link>
              <Link to="/guides" className="text-muted-foreground hover:text-foreground transition-colors">
                Guides & Tools
              </Link>
              <Link to="/reviews" className="text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </Link>
              <Link to="/media" className="text-muted-foreground hover:text-foreground transition-colors">
                Video & Podcast
              </Link>
              <Link to="/tutorials" className="text-muted-foreground hover:text-foreground transition-colors">
                Tutorials
              </Link>
              <Link to="/ai-pulse" className="text-muted-foreground hover:text-foreground transition-colors">
                AI Pulse
              </Link>
              <Link to="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                Roadmap & Features
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link to="/topics" className="text-muted-foreground hover:text-foreground transition-colors">
                Topics & Keywords
              </Link>
              <Link to="/blog-series" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog Series
              </Link>
              <Link to="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                Roadmap
              </Link>
              <Link to="/security-score" className="text-muted-foreground hover:text-foreground transition-colors">
                Security Score
              </Link>
              <Link to="/breach-sim" className="text-muted-foreground hover:text-foreground transition-colors">
                Breach Simulation
              </Link>
              <Link to="/nexus-intersection" className="text-muted-foreground hover:text-foreground transition-colors">
                Nexus Intersection
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/disclosure" className="text-muted-foreground hover:text-foreground transition-colors">
                Affiliate Disclosure
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Daily Security & Gaming Roundup</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the free daily briefing on threats, tech, and gaming news.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} The Grid Nexus. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground text-sm">
              Tech • Security • Gaming Intelligence •{' '}
              <Link to="/disclosure" className="hover:text-foreground transition-colors">
                Affiliate Disclosure
              </Link>
            </p>
            <a 
              className="clickio-cmp-settings-text clickio-cmp-settings-display text-muted-foreground hover:text-foreground transition-colors text-sm" 
              style={{display: 'none'}} 
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
