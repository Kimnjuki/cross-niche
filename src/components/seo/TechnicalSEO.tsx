/**
 * TheGridNexus Technical SEO Enhancement Component
 * Global SEO optimizations for Core Web Vitals and performance
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface TechnicalSEOProps {
  pageType?: 'article' | 'homepage' | 'listing' | 'guide';
  customMeta?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  structuredData?: any;
}

export function TechnicalSEO({ pageType = 'article', customMeta, structuredData }: TechnicalSEOProps) {
  const [coreWebVitals, setCoreWebVitals] = useState({
    lcp: 0,
    fid: 0,
    cls: 0
  });

  useEffect(() => {
    // Core Web Vitals monitoring
    const measureWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setCoreWebVitals(prev => ({
            ...prev,
            lcp: Math.round(lastEntry.startTime)
          }));
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            setCoreWebVitals(prev => ({
              ...prev,
              fid: Math.round(entry.processingStart - entry.startTime)
            }));
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setCoreWebVitals(prev => ({
              ...prev,
              cls: Math.round(clsValue * 1000) / 1000
            }));
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    };

    measureWebVitals();

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
        { href: '/css/critical.css', as: 'style' }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
        document.head.appendChild(link);
      });
    };

    // DNS prefetch for external domains
    const prefetchDNS = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://images.unsplash.com',
        'https://intent-akita-728.convex.cloud'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Preconnect to critical origins
    const preconnectOrigins = () => {
      const origins = [
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com'
      ];

      origins.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Initialize performance optimizations
    if (typeof window !== 'undefined') {
      preloadCriticalResources();
      prefetchDNS();
      preconnectOrigins();
    }
  }, []);

  // Generate structured data for page type
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': pageType === 'homepage' ? 'WebSite' : 'WebPage',
      name: customMeta?.title || 'The Grid Nexus',
      description: customMeta?.description || 'Technology, Gaming, and Security Convergence Platform',
      url: customMeta?.url || 'https://thegridnexus.com',
      image: customMeta?.image || 'https://thegridnexus.com/og-default.jpg',
      publisher: {
        '@type': 'Organization',
        name: 'The Grid Nexus',
        url: 'https://thegridnexus.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://thegridnexus.com/logo.png',
          width: 512,
          height: 512
        }
      },
      mainEntityOfPage: {
        '@type': 'Article',
        author: {
          '@type': 'Organization',
          name: 'The Grid Nexus Editorial Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Grid Nexus'
        }
      }
    };

    if (structuredData) {
      return { ...baseData, ...structuredData };
    }

    return baseData;
  };

  // Generate meta tags
  const generateMetaTags = () => {
    const tags = [
      // Basic meta
      { name: 'description', content: customMeta?.description || 'The Grid Nexus - Technology, Gaming, and Security Convergence Platform' },
      { name: 'keywords', content: 'technology, gaming, cybersecurity, AI, machine learning, tech news, security trends, gaming industry' },
      { name: 'author', content: 'The Grid Nexus Editorial Team' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      
      // Open Graph
      { property: 'og:title', content: customMeta?.title || 'The Grid Nexus' },
      { property: 'og:description', content: customMeta?.description || 'Technology, Gaming, and Security Convergence Platform' },
      { property: 'og:image', content: customMeta?.image || 'https://thegridnexus.com/og-default.jpg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: pageType === 'homepage' ? 'website' : 'article' },
      { property: 'og:url', content: customMeta?.url || 'https://thegridnexus.com' },
      { property: 'og:site_name', content: 'The Grid Nexus' },
      { property: 'og:locale', content: 'en_US' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: customMeta?.title || 'The Grid Nexus' },
      { name: 'twitter:description', content: customMeta?.description || 'Technology, Gaming, and Security Convergence Platform' },
      { name: 'twitter:image', content: customMeta?.image || 'https://thegridnexus.com/og-default.jpg' },
      { name: 'twitter:site', content: '@thegridnexus' },
      { name: 'twitter:creator', content: '@thegridnexus' },
      
      // Technical SEO
      { name: 'theme-color', content: '#0066FF' },
      { name: 'msapplication-TileColor', content: '#0066FF' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      
      // Security headers
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://intent-akita-728.convex.cloud https://www.google-analytics.com;" }
    ];

    return tags;
  };

  return (
    <Helmet>
      {/* Meta Tags */}
      {generateMetaTags().map((tag, index) => {
        if (tag.property) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        }
        if (tag['http-equiv']) {
          return <meta key={index} httpEquiv={tag['http-equiv']} content={tag.content} />;
        }
        return <meta key={index} name={tag.name} content={tag.content} />;
      })}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Preconnect and Prefetch */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//intent-akita-728.convex.cloud" />

      {/* Font Preload */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      {/* Canonical URL */}
      <link rel="canonical" href={customMeta?.url || 'https://thegridnexus.com'} />

      {/* Alternate Language */}
      <link rel="alternate" hrefLang="en" href={customMeta?.url || 'https://thegridnexus.com'} />
      <link rel="alternate" hrefLang="x-default" href={customMeta?.url || 'https://thegridnexus.com'} />

      {/* Sitemap */}
      <link rel="sitemap" type="application/xml" href="https://thegridnexus.com/sitemap.xml" />

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Core Web Vitals Monitoring (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <script>
          {`
            // Core Web Vitals Monitoring
            window.addEventListener('load', function() {
              setTimeout(function() {
                const vitals = ${JSON.stringify(coreWebVitals)};
                console.log('Core Web Vitals:', vitals);
                console.log('LCP:', vitals.lcp + 'ms (Target: <2500ms)');
                console.log('FID:', vitals.fid + 'ms (Target: <100ms)');
                console.log('CLS:', vitals.cls + ' (Target: <0.1)');
              }, 1000);
            });
          `}
        </script>
      )}

      {/* Performance Optimization Script */}
      <script>
        {`
          // Critical Resource Loading
          (function() {
            // Lazy load images
            if ('IntersectionObserver' in window) {
              const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      observer.unobserve(img);
                    }
                  }
                });
              });

              document.addEventListener('DOMContentLoaded', function() {
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
              });
            }

            // Font loading optimization
            if ('fonts' in document) {
              Promise.all([
                document.fonts.load('400 1em Inter'),
                document.fonts.load('600 1em Inter'),
                document.fonts.load('700 1em Inter')
              ]).then(function() {
                document.documentElement.classList.add('fonts-loaded');
              });
            }
          })();
        `}
      </script>

      {/* Service Worker Registration */}
      <script>
        {`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                  console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
            });
          }
        `}
      </script>
    </Helmet>
  );
}

export default TechnicalSEO;
