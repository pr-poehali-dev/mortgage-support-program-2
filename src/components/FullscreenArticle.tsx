import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ArticleComments from '@/components/ArticleComments';
import { useArticleStats } from '@/hooks/useArticleStats';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  icon: string;
  color: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

interface FullscreenArticleProps {
  article: Article;
  onClose: () => void;
}

export default function FullscreenArticle({ article, onClose }: FullscreenArticleProps) {
  const { stats, trackView, trackShare } = useArticleStats(article.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    trackView();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const siteUrl = 'https://ипотекакрым.рф';
  const articleUrl = `${siteUrl}/#article-${article.id}`;
  const shareText = `${article.title} - ${article.excerpt}`;

  const shareLinks = {
    vk: `https://vk.com/share.php?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.excerpt)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + articleUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`,
    odnoklassniki: `https://connect.ok.ru/offer?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}`
  };

  const handleShare = (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks];
    window.open(url, '_blank', 'width=600,height=400');
    trackShare(platform);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    alert('Ссылка скопирована в буфер обмена!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <Icon name="X" size={20} />
              <span className="hidden sm:inline">Закрыть</span>
            </Button>
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Icon name="Eye" size={16} />
                <span>{stats.views_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Share2" size={16} />
                <span>{stats.shares.total}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:inline">Поделиться:</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('telegram')}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              title="Telegram"
            >
              <Icon name="Send" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
              title="WhatsApp"
            >
              <Icon name="MessageCircle" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('vk')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="ВКонтакте"
            >
              <Icon name="Share2" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              title="Facebook"
            >
              <Icon name="Facebook" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('odnoklassniki')}
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              title="Одноклассники"
            >
              <Icon name="Users" size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
              title="Копировать ссылку"
            >
              <Icon name="Link" size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${article.color} rounded-2xl mb-4`}>
              <Icon name={article.icon} className="text-white" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={16} />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl mb-8 border-2 border-blue-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <article
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            color: '#374151',
            lineHeight: '1.8'
          }}
        />

        <div className="border-t pt-8 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Share2" className="text-purple-600" size={24} />
              Поделиться статьёй
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('telegram')}
              >
                <Icon name="Send" className="mr-2 text-blue-500" size={18} />
                Telegram
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('whatsapp')}
              >
                <Icon name="MessageCircle" className="mr-2 text-green-500" size={18} />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('vk')}
              >
                <Icon name="Share2" className="mr-2 text-blue-600" size={18} />
                VK
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('facebook')}
              >
                <Icon name="Facebook" className="mr-2 text-blue-700" size={18} />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleShare('odnoklassniki')}
              >
                <Icon name="Users" className="mr-2 text-orange-500" size={18} />
                OK
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCopyLink}
              >
                <Icon name="Link" className="mr-2 text-gray-600" size={18} />
                Ссылка
              </Button>
            </div>
          </div>
        </div>

        <ArticleComments articleId={article.id} />

        <div className="border-t pt-8 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Icon name="Phone" className="text-primary" size={20} />
              Нужна консультация?
            </h4>
            <p className="text-gray-700 mb-4">Свяжитесь с нашим экспертом для получения персональной консультации</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a href="tel:+79781281850">
                  <Icon name="Phone" className="mr-2" size={16} />
                  Позвонить
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:ipoteka_krym@mail.ru">
                  <Icon name="Mail" className="mr-2" size={16} />
                  Написать
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile" target="_blank" rel="noopener noreferrer">
                  <Icon name="ExternalLink" className="mr-2" size={16} />
                  Домклик
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl"
        onClick={onClose}
        title="Закрыть"
      >
        <Icon name="X" size={24} />
      </Button>
    </div>
  );
}