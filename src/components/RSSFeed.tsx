import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  image?: string;
}

const STORAGE_KEY = 'rss-feed-selected-sources';
const SORT_KEY = 'rss-feed-sort-order';

type SortOrder = 'newest' | 'oldest' | 'source';

export default function RSSFeed() {
  const [articles, setArticles] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const saved = localStorage.getItem(SORT_KEY);
    return (saved as SortOrder) || 'newest';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRSSFeed();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSources));
  }, [selectedSources]);

  useEffect(() => {
    localStorage.setItem(SORT_KEY, sortOrder);
  }, [sortOrder]);

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
        
        const sources = Array.from(new Set(data.articles.map((a: RSSItem) => a.source)));
        setAvailableSources(sources);
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

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const clearFilters = () => {
    setSelectedSources([]);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSource = selectedSources.length === 0 || selectedSources.includes(article.source);
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    }
    if (sortOrder === 'oldest') {
      return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
    }
    if (sortOrder === 'source') {
      return a.source.localeCompare(b.source);
    }
    return 0;
  });

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

      <div className="relative">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по новостям..."
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {availableSources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Icon name="Filter" size={16} />
              Источники:
            </span>
          <button
            onClick={clearFilters}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              selectedSources.length === 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Все ({articles.length})
          </button>
          {availableSources.map(source => (
            <button
              key={source}
              onClick={() => toggleSource(source)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                selectedSources.includes(source)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {source} ({articles.filter(a => a.source === source).length})
            </button>
          ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            <Icon name="ArrowUpDown" size={16} />
            Сортировка:
          </span>
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              sortOrder === 'newest'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Новые первые
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              sortOrder === 'oldest'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Старые первые
          </button>
          <button
            onClick={() => setSortOrder('source')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              sortOrder === 'source'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            По источнику
          </button>
        </div>
      </div>

      {sortedArticles.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon name="Search" size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {searchQuery ? 'Ничего не найдено по вашему запросу' : 'Нет новостей от выбранных источников'}
          </p>
          {searchQuery && (
            <p className="text-sm text-gray-500 mb-4">Попробуйте изменить поисковый запрос</p>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Очистить поиск
              </button>
            )}
            {selectedSources.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedArticles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-200">
              {article.image && (
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    {article.source}
                  </span>
                  <span className="absolute top-3 right-3 text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    {formatDate(article.pubDate)}
                  </span>
                </div>
              )}
              
              <div className="p-6">
                {!article.image && (
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {article.source}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(article.pubDate)}</span>
                  </div>
                )}
                
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
              </div>
            </Card>
          </a>
          ))}
        </div>
      )}

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