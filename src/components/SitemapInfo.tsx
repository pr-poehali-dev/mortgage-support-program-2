import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function SitemapInfo() {
  const sitemapUrl = `${window.location.origin}/sitemap.xml`;
  const robotsUrl = `${window.location.origin}/robots.txt`;
  const indexnowKeyUrl = `${window.location.origin}/8f3e9d2a1c5b4e6f7a8d9c1b2e3f4a5b.txt`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован`);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="p-6 border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-600 rounded-lg">
          <Icon name="FileText" size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Карта сайта и SEO файлы</h3>
          <p className="text-sm text-gray-600 mb-4">
            Все необходимые файлы для индексации поисковыми системами
          </p>
          
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Map" size={18} className="text-green-600" />
                  <span className="font-semibold text-sm">sitemap.xml</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInNewTab(sitemapUrl)}
                    className="h-8 text-xs"
                  >
                    <Icon name="ExternalLink" size={14} className="mr-1" />
                    Открыть
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(sitemapUrl, 'URL sitemap')}
                    className="h-8 text-xs"
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Копировать
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                {sitemapUrl}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Bot" size={18} className="text-blue-600" />
                  <span className="font-semibold text-sm">robots.txt</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInNewTab(robotsUrl)}
                    className="h-8 text-xs"
                  >
                    <Icon name="ExternalLink" size={14} className="mr-1" />
                    Открыть
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(robotsUrl, 'URL robots.txt')}
                    className="h-8 text-xs"
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Копировать
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                {robotsUrl}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Key" size={18} className="text-purple-600" />
                  <span className="font-semibold text-sm">IndexNow Key</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInNewTab(indexnowKeyUrl)}
                    className="h-8 text-xs"
                  >
                    <Icon name="ExternalLink" size={14} className="mr-1" />
                    Открыть
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard('8f3e9d2a1c5b4e6f7a8d9c1b2e3f4a5b', 'Ключ IndexNow')}
                    className="h-8 text-xs"
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Копировать
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                {indexnowKeyUrl}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-2">
              <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-700">
                <p className="font-semibold mb-1">Как использовать:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Отправьте sitemap.xml в Яндекс.Вебмастер и Google Search Console</li>
                  <li>robots.txt автоматически читается поисковыми роботами</li>
                  <li>IndexNow ключ используется для мгновенной индексации</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
