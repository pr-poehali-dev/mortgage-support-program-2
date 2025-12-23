import { useEffect, useState } from 'react';
import { blogArticles } from '@/data/mortgageData';

interface Article {
  id: number;
  publishDate?: string;
  published?: boolean;
  [key: string]: any;
}

export function useDailyBlogPost() {
  const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableArticles = blogArticles.filter(article => {
      if (article.published) {
        return true;
      }

      if (article.publishDate) {
        const publishDate = new Date(article.publishDate);
        publishDate.setHours(0, 0, 0, 0);
        return publishDate <= today;
      }

      return false;
    });

    availableArticles.sort((a, b) => {
      const dateA = a.publishDate ? new Date(a.publishDate) : new Date(0);
      const dateB = b.publishDate ? new Date(b.publishDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    setVisibleArticles(availableArticles);
  }, []);

  return visibleArticles;
}