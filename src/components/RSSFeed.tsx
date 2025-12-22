import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

export default function RSSFeed() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRSSFeed();
  }, []);

  const fetchRSSFeed = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch('https://functions.poehali.dev/fa7fba79-8d4e-408d-9177-7d0078f39e64');
      
      if (!response.ok) {
        throw new Error('Failed to fetch RSS feed');
      }

      const data = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        throw new Error('Invalid response format');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching RSS:', err);
      setError(true);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'только что';
    if (diffHours < 24) return `${diffHours} ч. назад`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📰 Новости ипотеки</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <Icon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Не удалось загрузить новости</p>
        <button
          onClick={fetchRSSFeed}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Попробовать снова
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Icon name="Newspaper" size={32} className="text-blue-600" />
          Новости ипотеки
        </h2>
        <button
          onClick={fetchRSSFeed}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-semibold"
        >
          <Icon name="RefreshCw" size={16} />
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-200">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {article.source}
                </span>
                <span className="text-xs text-gray-500">{formatDate(article.pubDate)}</span>
              </div>
              
              <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {article.description}
              </p>
              
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <span>Читать далее</span>
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </a>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 text-center border-2 border-blue-100">
        <p className="text-gray-700">
          <Icon name="Info" size={16} className="inline mr-2" />
          <strong>Хотите быть в курсе всех изменений?</strong> Подпишитесь на мой Telegram-канал и получайте актуальные новости об ипотеке
        </p>
        <a
          href="https://t.me/ipoteka_krym_rf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 bg-[#0088cc] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#006ba1] transition-colors"
        >
          <Icon name="Send" size={20} />
          Подписаться на канал
        </a>
      </Card>
    </div>
  );
}