import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';

const SITEMAP_URL = 'https://functions.poehali.dev/25d4d46e-7eec-4571-8414-d03b84dce2bd';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export default function Sitemap() {
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await fetch(SITEMAP_URL);
        const xmlText = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const urlElements = xmlDoc.getElementsByTagName('url');
        
        const parsedUrls: SitemapUrl[] = [];
        for (let i = 0; i < urlElements.length; i++) {
          const url = urlElements[i];
          parsedUrls.push({
            loc: url.getElementsByTagName('loc')[0]?.textContent || '',
            lastmod: url.getElementsByTagName('lastmod')[0]?.textContent || '',
            changefreq: url.getElementsByTagName('changefreq')[0]?.textContent || '',
            priority: url.getElementsByTagName('priority')[0]?.textContent || ''
          });
        }
        
        setUrls(parsedUrls);
      } catch (error) {
        console.error('Error fetching sitemap:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  const staticPages = [
    { path: '/', title: 'Главная', icon: 'Home' },
    { path: '/catalog', title: 'Каталог недвижимости', icon: 'Building2' },
    { path: '/calculator', title: 'Ипотечный калькулятор', icon: 'Calculator' },
    { path: '/programs', title: 'Ипотечные программы', icon: 'FileText' },
    { path: '/online-services', title: 'Онлайн-услуги', icon: 'Monitor' },
    { path: '/register', title: 'Заявка на ипотеку', icon: 'FileSignature' },
    { path: '/add-property', title: 'Добавить объект', icon: 'PlusCircle' },
    { path: '/contact', title: 'Контакты', icon: 'MapPin' },
    { path: '/faq', title: 'Часто задаваемые вопросы', icon: 'HelpCircle' },
    { path: '/blog', title: 'Блог', icon: 'BookOpen' },
    { path: '/services', title: 'Услуги', icon: 'Briefcase' },
    { path: '/rent-help', title: 'Помощь сдать', icon: 'Key' },
    { path: '/sell-help', title: 'Помощь продать', icon: 'Home' },
    { path: '/privacy-policy', title: 'Политика конфиденциальности', icon: 'Shield' },
    { path: '/terms-of-service', title: 'Условия использования', icon: 'FileText' }
  ];

  const propertyUrls = urls.filter(url => url.loc.includes('/property/'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <SEO 
        title="Карта сайта | Арендодатель - Агентство недвижимости"
        description="Полная карта сайта агентства недвижимости Арендодатель: все страницы, объекты недвижимости и разделы сайта"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <Icon name="ArrowLeft" size={20} />
            Вернуться на главную
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Карта сайта</h1>
          <p className="text-gray-600">Все разделы и объекты недвижимости на сайте</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Основные разделы */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Layout" size={24} className="text-primary" />
                  Основные разделы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {staticPages.map(page => (
                    <li key={page.path}>
                      <Link 
                        to={page.path}
                        className="flex items-center gap-3 text-gray-700 hover:text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors"
                      >
                        <Icon name={page.icon as any} size={20} className="text-primary flex-shrink-0" />
                        <span>{page.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Объекты недвижимости */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Building" size={24} className="text-primary" />
                  Объекты недвижимости ({propertyUrls.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto">
                  <ul className="space-y-2">
                    {propertyUrls.map((url, index) => {
                      const path = url.loc.replace('https://ипотекакрым.рф', '');
                      const id = path.split('/').pop();
                      return (
                        <li key={index}>
                          <Link 
                            to={path}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 p-2 rounded transition-colors"
                          >
                            <Icon name="Home" size={16} className="text-primary flex-shrink-0" />
                            <span>Объект #{id}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* XML Sitemap Link */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">XML Sitemap для поисковых систем</h3>
                <p className="text-sm text-gray-600">Автоматически обновляемая карта сайта в формате XML</p>
              </div>
              <a 
                href={SITEMAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Download" size={20} />
                Открыть XML
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
