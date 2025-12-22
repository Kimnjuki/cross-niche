import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Menu, X, User, Bookmark, LogOut, Search, Folder, Sparkles, Rss } from 'lucide-react';
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

const navLinks = [
  { href: '/tech', label: 'Innovate', color: 'text-tech' },
  { href: '/security', label: 'Secured', color: 'text-security' },
  { href: '/gaming', label: 'Play', color: 'text-gaming' },
  { href: '/reviews', label: 'Reviews', color: 'text-foreground' },
  { href: '/buying-guides', label: 'Buying Guides', color: 'text-foreground' },
  { href: '/tools', label: 'Tools', color: 'text-foreground' },
  { href: '/guides', label: 'Guides', color: 'text-foreground' },
  { href: '/tutorials', label: 'Tutorials', color: 'text-foreground' },
  { href: '/downloads', label: 'Downloads', color: 'text-foreground' },
];

const roleFilters = [
  { value: 'streamer', label: 'Streamer' },
  { value: 'sysadmin', label: 'SysAdmin' },
  { value: 'gamer', label: 'Gamer' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeRole = searchParams.get('role') || 'all';

  const handleRoleFilter = (role: string) => {
    if (role === 'all') {
      searchParams.delete('role');
    } else {
      searchParams.set('role', role);
    }
    setSearchParams(searchParams);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero" />
            <span className="font-display font-bold text-xl">The Grid Nexus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors hover:opacity-80 ${
                  location.pathname === link.href ? link.color : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Role Filter Tabs - Sub-bar */}
          {(location.pathname === '/tech' || location.pathname === '/security' || location.pathname === '/gaming' || location.pathname === '/guides') && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">Filter:</span>
              <button
                onClick={() => handleRoleFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                  activeRole === 'all' || !searchParams.get('role')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                All
              </button>
              {roleFilters.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleFilter(role.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                    activeRole === role.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
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
                  <DropdownMenuItem asChild>
                    <Link to="/collections" className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Collections
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/rss-feeds" className="flex items-center gap-2">
                      <Rss className="h-4 w-4" />
                      RSS Feeds
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/editor" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Editor
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
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium py-2 ${
                    location.pathname === link.href ? link.color : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="py-2">
                    Profile
                  </Link>
                  <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="py-2">
                    Bookmarks
                  </Link>
                  <Link to="/collections" onClick={() => setIsOpen(false)} className="py-2">
                    Collections
                  </Link>
                  <Link to="/rss-feeds" onClick={() => setIsOpen(false)} className="py-2">
                    RSS Feeds
                  </Link>
                  <Link to="/editor" onClick={() => setIsOpen(false)} className="py-2">
                    AI Editor
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="py-2 text-left text-destructive">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
