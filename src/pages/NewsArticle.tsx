import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import funcUrls from '../../backend/func2url.json';

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  photo_url: string | null;
  photos: string[];
  source: string;
  source_url: string;
  category: string;
  is_pinned: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export default function NewsArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    fetch(`${funcUrls.news}?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setArticle(data.news);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/news')}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <span className="text-gray-400">Загрузка...</span>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center">
        <Icon name="FileX" size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Новость не найдена</h1>
        <Button onClick={() => navigate('/news')}>К списку новостей</Button>
      </div>
    );
  }

  const allPhotos = article.photos?.length > 0 ? article.photos : (article.photo_url ? [article.photo_url] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO
        title={`${article.title} — Новости недвижимости Севастополя`}
        description={article.summary || article.title}
      />

      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/news')}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <span className="text-sm text-gray-500 hidden sm:inline">Новости недвижимости</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Icon name="Share2" size={16} className="mr-1.5" />
            Поделиться
          </Button>
        </div>
      </header>

      <article className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          {article.is_pinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              <Icon name="Pin" size={12} />
              Важно
            </span>
          )}
          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span className="flex items-center gap-1.5">
            <Icon name="Calendar" size={15} />
            {formatDate(article.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="Eye" size={15} />
            {article.views_count} просмотров
          </span>
          {article.source && (
            <span className="flex items-center gap-1.5">
              <Icon name="Link" size={15} />
              {article.source}
            </span>
          )}
        </div>

        {allPhotos.length > 0 && (
          <div className="mb-8">
            <div className="rounded-xl overflow-hidden shadow-lg mb-2">
              <img
                src={allPhotos[activePhoto]}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
            {allPhotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activePhoto ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>

        {article.source_url && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Icon name="ExternalLink" size={14} />
              Источник:
              <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {article.source || article.source_url}
              </a>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate('/news')} variant="outline" className="flex-1">
            <Icon name="ArrowLeft" size={16} className="mr-1.5" />
            Все новости
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
            <Icon name="Home" size={16} className="mr-1.5" />
            На главную
          </Button>
          <Button onClick={() => navigate('/catalog')} className="flex-1">
            <Icon name="Search" size={16} className="mr-1.5" />
            Смотреть объекты
          </Button>
        </div>
      </article>
    </div>
  );
}
