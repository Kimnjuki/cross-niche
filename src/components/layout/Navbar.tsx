import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bookmark, LogOut, Search, ChevronRight, Home } from 'lucide-react';
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

const navLinks = [
  { href: '/tech', label: 'Innovate', color: 'text-tech' },
  { href: '/security', label: 'Secured', color: 'text-security' },
  { href: '/gaming', label: 'Play', color: 'text-gaming' },
  { href: '/explore', label: 'Explore', color: 'text-foreground' },
  { href: '/topics', label: 'Topics', color: 'text-foreground' },
  { href: '/guides', label: 'Guides', color: 'text-foreground' },
  { href: '/roadmap', label: 'Roadmap', color: 'text-foreground' },
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero" />
              <span className="font-display font-bold text-xl">NexusMedia</span>
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

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="px-2 pb-4 border-b border-border/50 mb-4">
                <div className="flex gap-2">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                    aria-label="Search"
                  />
                  <Button type="submit" size="sm">Search</Button>
                </div>
              </form>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'font-medium py-2',
                      location.pathname === link.href ? link.color : 'text-muted-foreground'
                    )}
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

