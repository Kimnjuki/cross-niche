import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bookmark, LogOut, Search, ChevronRight, Home, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

/** Primary navigation — user intent, gaming-security first. */
const navLinks = [
  { href: '/gaming/security', label: 'Gaming Security', color: 'text-security' },
  { href: '/gaming', label: 'Account Protection', color: 'text-gaming' },
  { href: '/tech', label: 'Scams & Threats', color: 'text-tech' },
  { href: '/tools', label: 'Security Suite', color: 'text-security' },
  { href: '/tools/steam-scanner', label: 'Steam Scanner', color: 'text-[#00F0FF]' },
  { href: '/tools/gaming-security-checkup', label: 'Security Checkup', color: 'text-[#FF007A]' },
  { href: '/guides', label: 'Guides', color: 'text-foreground' },
  { href: '/topics', label: 'Latest', color: 'text-foreground' },
  { href: '/videos', label: 'Videos', color: 'text-foreground' },
];

/** Primary CTAs for mobile: Security-first to reinforce gaming security positioning. */
const mobilePrimaryLinks = [
  { href: '/gaming/security', label: 'Gaming Security', color: 'text-security' },
  { href: '/tools/steam-scanner', label: 'Steam Scanner', color: 'text-[#00F0FF]' },
  { href: '/tools/gaming-security-checkup', label: 'Security Checkup', color: 'text-[#FF007A]' },
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
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return skeleton navbar during SSR to prevent hydration mismatch
    return (
      <nav className="sticky top-0 z-50 bg-background/90 text-foreground backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
            <div className="hidden md:flex items-center gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/topics?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
    setIsOpen(false);
  };
  
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const showBreadcrumbs = location.pathname !== '/';

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // In production, this would filter content by role
    // For now, just update the state
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 text-foreground backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tech via-security to-gaming flex items-center justify-center">
                <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-tech to-security animate-pulse" />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-foreground">The Grid Nexus</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'font-medium transition-colors hover:opacity-80',
                    location.pathname === link.href ? link.color : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions: prominent search (Verge / Ars style) */}
            <div className="hidden md:flex items-center gap-4">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-fade-in">
                  <input
                    type="search"
                    id="navbar-search-desktop"
                    name="navbar-search-desktop"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    autoFocus
                    aria-label="Search"
                  />
                  <Button type="submit" size="sm">Search</Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search">
                  <Search className="h-5 w-5" />
                </Button>
              )}
              <ThemeToggle />
              {user ? (
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
              ) : (
                <Button asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              )}
              <NotificationsDropdown />
            </div>

            {/* Mobile Menu Button – 44px min tap target (GA mobile UX) */}
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

          {/* TechCrunch-style Live Ticker – homepage sub-navigation */}
          {location.pathname === '/' && (
            <div className="border-t border-border/60">
              <LiveTicker />
            </div>
          )}

          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <div className="hidden md:flex items-center gap-2 py-2 border-t border-border/50">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index === 0 ? (
                    <Link
                      to={crumb.href}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Home className="h-3.5 w-3.5" />
                      {crumb.label}
                    </Link>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-sm font-medium text-foreground">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          to={crumb.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Role-Based Filter Tabs */}
          {location.pathname !== '/' && (
            <div className="hidden md:block py-3 border-t border-border/50">
              <Tabs value={selectedRole} onValueChange={handleRoleChange}>
                <TabsList className="h-9">
                  {roleFilters.map((role) => (
                    <TabsTrigger
                      key={role.id}
                      value={role.id}
                      className="text-xs px-3"
                    >
                      {role.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Mobile Navigation – simplified, 44px tap targets, primary CTAs first (GA mobile) */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Explore</p>
              <div className="flex flex-col gap-1 mb-4">
                {mobilePrimaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'min-h-[44px] flex items-center font-semibold text-base px-3 rounded-md active:bg-muted',
                      location.pathname === link.href ? link.color : 'text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <form onSubmit={handleSearchSubmit} className="px-2 pb-4 border-b border-border/50 mb-4">
                <label htmlFor="navbar-search-mobile" className="sr-only">Search topics</label>
                <div className="flex gap-2">
                  <input
                    type="search"
                    id="navbar-search-mobile"
                    name="navbar-search-mobile"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="flex-1 min-h-[44px] text-base rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Mobile search"
                    autoComplete="off"
                  />
                  <Button type="submit" size="sm" className="min-h-[44px] shrink-0">Search</Button>
                </div>
              </form>
              <div className="flex flex-col gap-1">
                {navLinks.filter((l) => !mobilePrimaryLinks.some((p) => p.href === l.href)).map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'min-h-[44px] flex items-center font-medium text-base px-3 rounded-md active:bg-muted',
                      location.pathname === link.href ? link.color : 'text-muted-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center px-3 rounded-md active:bg-muted text-base">Profile</Link>
                    <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center px-3 rounded-md active:bg-muted text-base">Bookmarks</Link>
                    <button type="button" onClick={() => { logout(); setIsOpen(false); }} className="min-h-[44px] flex items-center px-3 rounded-md text-left text-destructive text-base">Logout</button>
                  </>
                ) : (
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="min-h-[44px] flex items-center mt-2">
                    <Button className="w-full min-h-[44px] text-base">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Reading Progress Bar - Sticky at top of article pages */}
      {location.pathname.startsWith('/article/') && (
        <div className="sticky top-16 z-40 h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-tech via-security to-gaming transition-all duration-150"
            style={{
              width: '0%', // This would be calculated from scroll position
            }}
          />
        </div>
      )}
    </>
  );
}

