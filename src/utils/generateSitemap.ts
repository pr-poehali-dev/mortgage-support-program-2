import { blogArticles } from '@/data/mortgageData';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(): string {
  const baseUrl = 'https://ипотекакрым.рф';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/register`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  const storedOverrides = localStorage.getItem('article_publish_overrides');
  const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};

  const publishedArticles = blogArticles.filter(article => {
    if (overrides[article.id]?.published !== undefined) {
      return overrides[article.id].published;
    }
    
    if (article.published) {
      return true;
    }

    if (article.publishDate) {
      const publishDate = new Date(article.publishDate);
      publishDate.setHours(0, 0, 0, 0);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      return publishDate <= todayDate;
    }

    return false;
  });

  const articleUrls: SitemapUrl[] = publishedArticles.map(article => {
    const articleDate = article.publishDate || today;
    const slug = article.title
      .toLowerCase()
      .replace(/[^а-яёa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    return {
      loc: `${baseUrl}/#blog-${article.id}-${slug}`,
      lastmod: articleDate,
      changefreq: 'weekly',
      priority: 0.7
    };
  });

  const allUrls = [...staticUrls, ...articleUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export async function saveSitemap(): Promise<boolean> {
  try {
    const sitemapContent = generateSitemap();
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Ошибка сохранения sitemap:', error);
    return false;
  }
}

export function getSitemapStats() {
  const storedOverrides = localStorage.getItem('article_publish_overrides');
  const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};

  const publishedArticles = blogArticles.filter(article => {
    if (overrides[article.id]?.published !== undefined) {
      return overrides[article.id].published;
    }
    return article.published || (article.publishDate && new Date(article.publishDate) <= new Date());
  });

  return {
    totalUrls: 3 + publishedArticles.length,
    staticPages: 3,
    blogArticles: publishedArticles.length,
    lastGenerated: new Date().toISOString()
  };
}
