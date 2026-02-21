import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CanonicalLinkProps {
  customUrl?: string;
}

export const CanonicalLink = ({ customUrl }: CanonicalLinkProps) => {
  const location = useLocation();

  useEffect(() => {
    // Build canonical URL
    const baseUrl = 'https://thegridnexus.com';
    const canonicalUrl = customUrl 
      ? `${baseUrl}${customUrl.startsWith('/') ? customUrl : `/${customUrl}`}`
      : `${baseUrl}${location.pathname}`;

    // Remove or add trailing slash for consistency
    const normalizedUrl = canonicalUrl.replace(/\/+$/, '') + '/';

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.href = normalizedUrl;

    // Cleanup on unmount
    return () => {
      if (canonicalLink && canonicalLink.parentNode) {
        canonicalLink.parentNode.removeChild(canonicalLink);
      }
    };
  }, [location.pathname, customUrl]);

  return null;
};
