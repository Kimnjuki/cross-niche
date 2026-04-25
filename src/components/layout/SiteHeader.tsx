import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bookmark, LogOut, Search, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/tech', label: 'Tech', accent: 'cyan' },
  { href: '/security', label: 'Security', accent: 'violet' },
  { href: '/gaming', label: 'Gaming', accent: 'amber' },
  { href: '/topics', label: 'Topics', hasDropdown: true },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-[500] transition-all duration-[220ms] ease-out',
        scrolled
          ? 'bg-[rgba(3,5,10,0.92)] backdrop-blur-[16px] backdrop-saturate-[180%] border-b border-[rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      )}
      style={{
        height: scrolled ? '56px' : '72px',
      }}
    >
      <div className="container-tokens h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-[var(--font-display)] font-bold text-[0.875rem] tracking-[0.15em] text-[var(--text-primary)] transition-colors duration-180ms hover:text-[var(--accent-cyan)]"
          >
            <span className="text-[var(--accent-cyan)]">●</span>
            THE GRID NEXUS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-[0.8125rem] font-semibold tracking-[0.06em] uppercase transition-all duration-[180ms] ease-out relative group',
                  location.pathname === link.href
                    ? 'text-[var(--accent-cyan)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown className="inline-block ml-1 h-3 w-3" />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-[180ms] ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-scale-in">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the grid..."
                  className="w-64 bg-[var(--bg-elevated)] border border-[var(--border-cyan)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                  autoFocus
                  aria-label="Search the grid"
                />
                <Button type="submit" size="sm">Search</Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                title="Search the grid (Cmd+K)"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
            )}

            <Button variant="ghost" size="icon" aria-label="Notifications" title="Signals">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[var(--accent-red)] text-white text-[10px] font-bold flex items-center justify-center animate-bell-pulse">3</span>
            </Button>

            {user ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-1" />
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signin">Sign in</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link to="/join">Join the Grid</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6 text-[var(--text-primary)]" /> : <Menu className="h-6 w-6 text-[var(--text-primary)]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          'md:hidden fixed top-0 right-0 w-[85vw] max-w-[360px] h-full bg-[var(--bg-surface)] border-l border-[var(--border-cyan)] transform transition-transform duration-[280ms] cubic-bezier(0.32,0.72,0,1) z-[550]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <span className="font-[var(--font-display)] font-bold text-sm tracking-wider">THE GRID NEXUS</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'min-h-[48px] flex items-center px-3 rounded-md font-semibold transition-colors duration-180ms',
                  location.pathname === link.href
                    ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan-glow)]'
                    : 'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.03)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            {!user && (
              <>
                <Button variant="primary" size="md" className="w-full" asChild>
                  <Link to="/join" onClick={() => setIsOpen(false)}>Join the Grid</Link>
                </Button>
                <Button variant="ghost" size="md" className="w-full" asChild>
                  <Link to="/signin" onClick={() => setIsOpen(false)}>Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-[540]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}