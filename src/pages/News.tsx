import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
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

const categories = [
  { value: '', label: 'Все' },
  { value: 'mortgage', label: 'Ипотека' },
  { value: 'law', label: 'Законодательство' },
  { value: 'market', label: 'Рынок' },
  { value: 'tips', label: 'Советы' },
  { value: 'general', label: 'Общие' },
];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const url = activeCategory
      ? `${funcUrls.news}?limit=100&category=${activeCategory}`
      : `${funcUrls.news}?limit=100`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.success) setNews(data.news);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO
        title="Новости недвижимости Севастополя"
        description="Актуальные новости рынка недвижимости Севастополя: ипотека, законодательство, советы по покупке и продаже."
      />

      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Icon name="Newspaper" size={22} className="text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Новости недвижимости Севастополя</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px] ${
                activeCategory === cat.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-56 shadow-sm" />
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Newspaper" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Новостей пока нет</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map(item => (
              <article
                key={item.id}
                className="group cursor-pointer bg-white hover:shadow-lg rounded-xl border border-gray-100 hover:border-primary/30 transition-all overflow-hidden"
                onClick={() => navigate(`/news/${item.slug}`)}
              >
                {item.photo_url && (
                  <div className="h-44 sm:h-48 overflow-hidden">
                    <img
                      src={item.photo_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {item.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded-full">
                        <Icon name="Pin" size={10} />
                        Важно
                      </span>
                    )}
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${getCategoryColor(item.category)}`}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h2>
                  {item.summary && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.summary}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={13} />
                      {formatDate(item.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Eye" size={13} />
                      {item.views_count}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
