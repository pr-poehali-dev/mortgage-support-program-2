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

    const storedOverrides = localStorage.getItem('article_publish_overrides');
    const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};
    const storedContent = localStorage.getItem('article_content_overrides');
    const contentOverrides = storedContent ? JSON.parse(storedContent) : {};

    const articlesWithOverrides = blogArticles.map(article => ({
      ...article,
      publishDate: overrides[article.id]?.publishDate || article.publishDate,
      published: overrides[article.id]?.published !== undefined 
        ? overrides[article.id].published 
        : article.published,
      title: contentOverrides[article.id]?.title || article.title,
      excerpt: contentOverrides[article.id]?.excerpt || article.excerpt,
      content: contentOverrides[article.id]?.content || article.content,
      category: contentOverrides[article.id]?.category || article.category,
      readTime: contentOverrides[article.id]?.readTime || article.readTime
    }));

    const availableArticles = articlesWithOverrides.filter(article => {
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