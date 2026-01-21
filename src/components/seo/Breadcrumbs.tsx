import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from path if not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      // Convert path to readable label
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      crumbs.push({ label, href: currentPath });
    });
    
    return crumbs;
  })();

  // Generate Schema.org BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${window.location.origin}${crumb.href}`,
    })),
  };

  return (
    <>
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center gap-2 text-sm text-muted-foreground mb-6', className)}
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  to={crumb.href}
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-foreground font-medium" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}


