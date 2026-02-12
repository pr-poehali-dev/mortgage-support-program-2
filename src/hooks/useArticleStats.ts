import { useEffect, useState } from 'react';

interface ArticleStats {
  article_id: number;
  views_count: number;
  shares: {
    telegram: number;
    whatsapp: number;
    vk: number;
    facebook: number;
    ok: number;
    total: number;
  };
}

const STATS_API_URL = 'https://functions.poehali.dev/962e8462-cab3-41e7-a03b-4b722a05f91b';

export function useArticleStats(articleId: number) {
  const [stats, setStats] = useState<ArticleStats>({
    article_id: articleId,
    views_count: 0,
    shares: {
      telegram: 0,
      whatsapp: 0,
      vk: 0,
      facebook: 0,
      ok: 0,
      total: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [articleId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${STATS_API_URL}?article_id=${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching article stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      const response = await fetch(STATS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          action: 'view'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          views_count: data.views_count
        }));
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const trackShare = async (platform: string) => {
    try {
      const response = await fetch(STATS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          action: 'share',
          platform
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          shares: {
            ...prev.shares,
            [platform]: (prev.shares[platform as keyof typeof prev.shares] as number) + 1,
            total: data.shares_total
          }
        }));
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  return { stats, loading, trackView, trackShare };
}
