import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Remplace par l'URL de ton site
  const baseUrl = 'https://www.khedmapro.com';

  // Liste les pages publiques de ton site
  const staticPages = [
    '',
    '/demander',
    '/demandes',
    '/comment-ca-marche',
    '/contact',
    '/mentions-legales',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Ajouter dynamiquement les demandes ouvertes (SEO pour les catégories)
  // Pour l'instant, on garde le sitemap simple. On pourra l'enrichir plus tard.

  return staticPages;
}