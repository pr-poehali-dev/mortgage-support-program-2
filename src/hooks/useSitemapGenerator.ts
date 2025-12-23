import { useEffect } from 'react';
import { blogArticles } from '@/data/mortgageData';

interface Article {
  id: number;
  title: string;
  publishDate?: string;
  published?: boolean;
  [key: string]: any;
}

function shouldRegenerateSitemap(): boolean {
  const lastGenerated = localStorage.getItem('sitemap_last_generated');
  if (!lastGenerated) return true;
  
  const lastDate = new Date(lastGenerated);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff > 24;
}

export function useSitemapGenerator() {
  useEffect(() => {
    if (!shouldRegenerateSitemap()) {
      return;
    }

    const generateAndLogSitemap = async () => {
      try {
        const baseUrl = 'https://ипотекакрым.рф';
        const today = new Date().toISOString().split('T')[0];

        const storedOverrides = localStorage.getItem('article_publish_overrides');
        const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};

        const publishedArticles = blogArticles.filter((article: Article) => {
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

        console.log(`🗺️  Актуальных URL в sitemap: ${3 + publishedArticles.length} (3 страницы + ${publishedArticles.length} статей)`);
        console.log(`💡 Для обновления статического sitemap.xml скачайте актуальную версию из админки`);
        
        localStorage.setItem('sitemap_last_generated', new Date().toISOString());
      } catch (error) {
        console.error('Ошибка проверки sitemap:', error);
      }
    };

    const timer = setTimeout(generateAndLogSitemap, 3000);
    
    return () => clearTimeout(timer);
  }, []);
}
