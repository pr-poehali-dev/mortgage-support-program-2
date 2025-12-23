import { useEffect, useState } from 'react';
import { blogArticles } from '@/data/mortgageData';

export function useDailyBlogPost() {
  const [visibleArticles, setVisibleArticles] = useState(blogArticles.filter(a => a.published));

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    const unpublishedArticles = blogArticles.filter(a => !a.published);
    
    if (unpublishedArticles.length === 0) {
      setVisibleArticles(blogArticles);
      return;
    }
    
    const articlesToPublish = Math.min(
      Math.floor(dayOfYear / 1) + 6,
      blogArticles.length
    );
    
    const articlesForToday = blogArticles.slice(0, articlesToPublish);
    setVisibleArticles(articlesForToday);
  }, []);

  return visibleArticles;
}
