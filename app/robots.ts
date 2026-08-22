import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/call/'],
    },
    sitemap: 'https://vorvex.tech/sitemap.xml',
  };
}
