import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CanonicalLinkProps {
  customUrl?: string;
}

export const CanonicalLink = ({ customUrl }: CanonicalLinkProps) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://thegridnexus.com';
    const rawPath = customUrl
      ? (customUrl.startsWith('/') ? customUrl : `/${customUrl}`)
      : location.pathname;
    const pathWithoutQuery = rawPath.split('?')[0].split('#')[0];
    const normalizedPath =
      pathWithoutQuery === '/' ? '/' : pathWithoutQuery.replace(/\/+$/, '');
    const canonicalUrl = `${baseUrl}${normalizedPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = canonicalUrl;
  }, [location.pathname, customUrl]);

  return null;
};
