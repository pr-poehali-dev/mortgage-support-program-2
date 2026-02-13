import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import funcUrls from '../../backend/func2url.json';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  photo_url: string | null;
  category: string;
  is_pinned: boolean;
  views_count: number;
  created_at: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${funcUrls.news}?limit=6`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setNews(data.news);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      'mortgage': 'Ипотека',
      'law': 'Законодательство',
      'market': 'Рынок',
      'general': 'Новости',
      'tips': 'Советы',
    };
    return map[cat] || 'Новости';
  };

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      'mortgage': 'bg-blue-100 text-blue-700',
      'law': 'bg-purple-100 text-purple-700',
      'market': 'bg-green-100 text-green-700',
      'general': 'bg-gray-100 text-gray-700',
      'tips': 'bg-amber-100 text-amber-700',
    };
    return map[cat] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <section className="mb-8 sm:mb-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Newspaper" size={22} className="text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Новости недвижимости Севастополя</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-48" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  const pinnedNews = news.find(n => n.is_pinned);
  const restNews = news.filter(n => n !== pinnedNews);

  return (
    <section className="mb-8 sm:mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Newspaper" size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Новости недвижимости</h2>
              <p className="text-sm text-gray-500 hidden sm:block">Актуальные новости рынка Севастополя</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/news')}
            className="flex items-center gap-1.5"
          >
            Все новости
            <Icon name="ArrowRight" size={16} />
          </Button>
        </div>

        {pinnedNews && (
          <div
            className="mb-6 cursor-pointer group"
            onClick={() => navigate(`/news/${pinnedNews.slug}`)}
          >
            <div className="relative bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-5 sm:p-6 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
              <div className="flex items-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  <Icon name="Pin" size={12} />
                  Важно
                </span>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getCategoryColor(pinnedNews.category)}`}>
                  {getCategoryLabel(pinnedNews.category)}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                {pinnedNews.title}
              </h3>
              {pinnedNews.summary && (
                <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3">
                  {pinnedNews.summary}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={14} />
                  {formatDate(pinnedNews.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  {pinnedNews.views_count}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restNews.slice(0, pinnedNews ? 3 : 6).map(item => (
            <article
              key={item.id}
              className="group cursor-pointer bg-gray-50 hover:bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
              onClick={() => navigate(`/news/${item.slug}`)}
            >
              {item.photo_url && (
                <div className="h-36 sm:h-40 overflow-hidden">
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${getCategoryColor(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base mb-2">
                  {item.title}
                </h3>
                {item.summary && (
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{item.summary}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {formatDate(item.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    {item.views_count}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
