import { useEffect, useRef } from 'react';
import { sendNewsletter } from '@/utils/sendNewsletter';
import { notifyCurrentPage, notifySitemapXml } from '@/services/indexnow';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  published?: boolean;
}

const PUBLISHED_ARTICLES_KEY = 'published_articles_ids';

export function useArticlePublisher(articles: Article[]) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkAndPublishNewArticles = async () => {
      try {
        const storedIdsStr = localStorage.getItem(PUBLISHED_ARTICLES_KEY);
        const publishedIds: number[] = storedIdsStr ? JSON.parse(storedIdsStr) : [];

        const currentArticleIds = articles.map(a => a.id);
        
        const newArticles = articles.filter(
          article => !publishedIds.includes(article.id)
        );

        if (newArticles.length === 0) {
          return;
        }

        console.log(`Найдено ${newArticles.length} новых статей для рассылки`);

        for (const article of newArticles) {
          try {
            const result = await sendNewsletter({
              articleId: article.id,
              articleTitle: article.title,
              articleExcerpt: article.excerpt
            });

            if (result.success) {
              console.log(`Рассылка отправлена для статьи "${article.title}": ${result.sent_count} подписчиков`);
              
              publishedIds.push(article.id);
              localStorage.setItem(PUBLISHED_ARTICLES_KEY, JSON.stringify(publishedIds));

              try {
                await notifyCurrentPage();
                console.log(`IndexNow: Статья "${article.title}" отправлена в поисковые системы`);
                
                await notifySitemapXml();
                console.log(`IndexNow: Обновленный sitemap.xml отправлен в поисковые системы`);
              } catch (indexError) {
                console.error(`Ошибка отправки в IndexNow для статьи "${article.title}":`, indexError);
              }
            } else {
              console.error(`Ошибка отправки рассылки для статьи "${article.title}":`, result.error);
            }
          } catch (error) {
            console.error(`Критическая ошибка при отправке рассылки для статьи "${article.title}":`, error);
          }
        }
      } catch (error) {
        console.error('Ошибка проверки новых статей:', error);
      }
    };

    checkAndPublishNewArticles();
  }, [articles]);
}