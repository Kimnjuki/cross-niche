import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bookmark, LogOut, Search, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LiveTicker } from '@/components/layout/LiveTicker';
import { useNotifications } from '@/hooks/useNotifications';

function NotificationsDropdown() {
  const { notifications, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.slice(0, 20).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-1 whitespace-normal"
                onSelect={() => {
                  setOpen(false);
                  if (n.category === 'breaking') navigate('/security');
                  if (n.category === 'feed') navigate('/explore');
                }}
              >
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-2">{n.message}</span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Primary navigation — reconciles live IA with spec's pillar model. */
const navLinks = [
  { href: '/tech', label: 'Tech', color: 'text-cyan' },
  { href: '/security', label: 'Security', color: 'text-violet' },
  { href: '/gaming', label: 'Gaming', color: 'text-amber' },
  { href: '/ai-pulse', label: 'AI Pulse', color: 'text-primary' },
  { href: '/tools', label: 'Tools', color: 'text-primary' },
  { href: '/guides', label: 'Guides', color: 'text-primary' },
  { href: '/explore', label: 'Explore', color: 'text-primary' },
];

/** Primary CTAs for mobile: Tech, Security, Gaming, AI Pulse, Tools per spec. */
const mobilePrimaryLinks = [
  { href: '/tech', label: 'Tech', color: 'text-cyan' },
  { href: '/security', label: 'Security', color: 'text-violet' },
  { href: '/gaming', label: 'Gaming', color: 'text-amber' },
  { href: '/ai-pulse', label: 'AI Pulse', color: 'text-primary' },
  { href: '/tools', label: 'Tools', color: 'text-primary' },
];

const roleFilters = [
  { id: 'all', label: 'All Roles' },
  { id: 'streamer', label: 'Streamer' },
  { id: 'sysadmin', label: 'SysAdmin' },
  { id: 'gamer', label: 'Gamer' },
];

// Generate breadcrumbs from current path
const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/' }];
  
  let currentPath = '';
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({ label, href: currentPath });
  });
  
  return breadcrumbs;
};

export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <nav className="sticky top-0 z-50 bg-background/90 text-foreground backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
            <div className="hidden md:flex items-center gap-8">
              {['Tech','Security','Gaming','AI Pulse','Tools','Guides','Explore'].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/explore?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 text-foreground backdrop-blur-lg border-b border-border" aria-label="Primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" aria-label="The Grid Nexus home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan via-violet to-amber flex items-center justify-center">
                <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan to-violet animate-pulse" />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-foreground">The Grid Nexus</span>
            </Link>

            {/* Desktop Navigation per spec: Tech, Security, Gaming, AI Pulse, Tools, Guides, Explore */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={location.pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'font-medium transition-colors hover:text-foreground relative py-1',
                    location.pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan" aria-hidden="true" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions: search + subscribe */}
            <div className="hidden md:flex items-center gap-3">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-fade-in">
                  <input
                    type="search"
                    id="navbar-search-desktop"
                    name="navbar-search-desktop"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="h-9 w-56 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    autoFocus
                    aria-label="Search"
                  />
                  <Button type="submit" size="sm">Search</Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search (/)" title="Search (/)">
                  <Search className="h-5 w-5" />
                </Button>
              )}
              <Button asChild size="sm" className="bg-cyan text-ink-950 hover:bg-cyan/90 font-semibold">
                <Link to="/newsletter">Subscribe</Link>
              </Button>
              <ThemeToggle />
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookmarks" className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <NotificationsDropdown />
            </div>

            {/* Mobile Menu Button – 44px min tap target */}
            <button
              type="button"
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md -mr-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'min-h-[44px] flex items-center font-medium text-base px-3 rounded-md active:bg-muted',
                      location.pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                    )}
                    aria-current={location.pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/newsletter" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center mt-2 px-3">
                  <Button className="w-full min-h-[44px] text-base bg-cyan text-ink-950 hover:bg-cyan/90 font-semibold">Subscribe to Nexus Brief</Button>
                </Link>
                <form onSubmit={handleSearchSubmit} className="px-2 pb-4">
                  <label htmlFor="navbar-search-mobile" className="sr-only">Search</label>
                  <div className="flex gap-2">
                    <input
                      type="search"
                      id="navbar-search-mobile"
                      name="navbar-search-mobile"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 min-h-[44px] text-base rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="Mobile search"
                      autoComplete="off"
                    />
                    <Button type="submit" size="sm" className="min-h-[44px] shrink-0">Search</Button>
                  </div>
                </form>
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center px-3 rounded-md active:bg-muted text-base">Profile</Link>
                    <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center px-3 rounded-md active:bg-muted text-base">Bookmarks</Link>
                    <button type="button" onClick={() => { logout(); setIsOpen(false); }} className="min-h-[44px] flex items-center px-3 rounded-md text-left text-destructive text-base">Logout</button>
                  </>
                ) : (
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center mt-2 px-3">
                    <Button variant="outline" className="w-full min-h-[44px] text-base">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

