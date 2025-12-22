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

      const mockArticles: RSSItem[] = [
        {
          title: 'ЦБ РФ снизил ключевую ставку: что это значит для ипотечных заёмщиков',
          link: 'https://www.cbr.ru/',
          description: 'Центральный банк России принял решение о снижении ключевой ставки. Эксперты прогнозируют снижение ставок по ипотеке на 0.5-1% в ближайшие месяцы.',
          pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'ЦБ РФ'
        },
        {
          title: 'Семейная ипотека: изменения с 2025 года',
          link: 'https://дом.рф/',
          description: 'С 1 января 2025 года вступили в силу новые условия программы семейной ипотеки. Максимальная сумма кредита увеличена до 12 млн рублей.',
          pubDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          source: 'ДОМ.РФ'
        },
        {
          title: 'IT-ипотека: кто может получить льготный кредит',
          link: 'https://дом.рф/',
          description: 'Программа IT-ипотеки стала доступна большему числу специалистов. Расширен список компаний-работодателей, участвующих в программе.',
          pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: 'Минцифры РФ'
        },
        {
          title: 'Сельская ипотека 2025: новые возможности для жителей регионов',
          link: 'https://минсельхоз.рф/',
          description: 'Минсельхоз расширил географию программы сельской ипотеки. Теперь под программу попадают новые населённые пункты Крыма.',
          pubDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          source: 'Минсельхоз РФ'
        },
        {
          title: 'Военная ипотека: увеличен размер накоплений',
          link: 'https://rosvoenipoteka.ru/',
          description: 'С 2025 года размер ежегодных накоплений по программе военной ипотеки увеличен на 15%. Это позволит военнослужащим приобретать более дорогое жильё.',
          pubDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          source: 'Росвоенипотека'
        },
        {
          title: 'Банки снижают ставки по базовой ипотеке',
          link: 'https://www.banki.ru/',
          description: 'Крупнейшие банки России начали снижать ставки по базовой ипотеке. Средняя ставка на рынке сейчас составляет 16.5% годовых.',
          pubDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          source: 'Banki.ru'
        }
      ];

      setArticles(mockArticles);
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
