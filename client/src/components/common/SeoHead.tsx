import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = 'https://borno.edu/og-image.jpg',
  noIndex = false,
  structuredData,
}) => {
  const location = useLocation();
  const siteUrl = 'https://borno.edu'; // Canonical domain
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${siteUrl}${currentPath === '/' ? '' : currentPath}`;
  const fullTitle = title.includes('Borno Higher Study')
    ? title
    : `${title} | Borno Higher Study`;

  useEffect(() => {
    // 1. Set Title
    document.title = fullTitle;

    // Helper to update or create a meta tag
    const setMetaTag = (attribute: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create a link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setLinkTag('canonical', canonicalUrl);

    // 3. Open Graph
    setMetaTag('property', 'og:site_name', 'Borno Higher Study');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Structured Data (JSON-LD)
    const scriptId = 'schema-org-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount
    };
  }, [fullTitle, description, canonicalUrl, ogType, ogImage, noIndex, structuredData]);

  return null;
};
