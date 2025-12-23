import { writeFileSync } from 'fs';
import { join } from 'path';

interface Article {
  id: number;
  title: string;
  publishDate?: string;
  published?: boolean;
  [key: string]: any;
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

async function loadBlogArticles(): Promise<Article[]> {
  try {
    const mortgageDataPath = join(process.cwd(), 'src/data/mortgageData.ts');
    const mortgageData = await import(mortgageDataPath);
    return mortgageData.blogArticles || [];
  } catch (error) {
    console.warn('Не удалось загрузить статьи блога:', error);
    return [];
  }
}

function generateSitemap(articles: Article[]): string {
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

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const publishedArticles = articles.filter(article => {
    if (article.published) {
      return true;
    }

    if (article.publishDate) {
      const publishDate = new Date(article.publishDate);
      publishDate.setHours(0, 0, 0, 0);
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

async function main() {
  console.log('🗺️  Генерация sitemap.xml...');
  
  const articles = await loadBlogArticles();
  console.log(`📝 Найдено статей: ${articles.length}`);
  
  const publishedCount = articles.filter(a => 
    a.published || (a.publishDate && new Date(a.publishDate) <= new Date())
  ).length;
  console.log(`✅ Опубликованных статей: ${publishedCount}`);
  
  const sitemap = generateSitemap(articles);
  
  const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
  writeFileSync(sitemapPath, sitemap, 'utf-8');
  
  const totalUrls = 3 + publishedCount;
  console.log(`✨ Sitemap создан: ${totalUrls} URL (3 страницы + ${publishedCount} статей)`);
  console.log(`📍 Файл: ${sitemapPath}`);
}

main().catch(error => {
  console.error('❌ Ошибка генерации sitemap:', error);
  process.exit(1);
});
