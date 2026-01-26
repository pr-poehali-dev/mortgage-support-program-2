import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { 
  notifyAllMainPages, 
  notifySitemap, 
  clearNotificationCache, 
  getNotificationStats 
} from '@/services/indexnow';
import { notifySitemapToSearchEngines } from '@/services/sitemap-notifier';

export default function IndexNowControl() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const stats = getNotificationStats();

  const handleNotifyAll = async () => {
    setLoading(true);
    setLastResult('Отправка уведомлений...');
    
    try {
      const result = await notifyAllMainPages(true);
      
      if (result.success) {
        setLastResult(`✅ Успешно! Отправлено ${result.urls_submitted} URL в ${result.results.length} поисковых системы`);
      } else {
        setLastResult('❌ Ошибка при отправке уведомлений');
      }
    } catch (error) {
      setLastResult(`❌ Ошибка: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifySitemap = async () => {
    setLoading(true);
    setLastResult('Отправка sitemap...');
    
    try {
      const [indexNowResult, searchEnginesResult] = await Promise.all([
        notifySitemap(true),
        notifySitemapToSearchEngines()
      ]);
      
      const searchEnginesSuccess = [
        searchEnginesResult.google.success,
        searchEnginesResult.yandex.success,
        searchEnginesResult.bing.success
      ].filter(Boolean).length;
      
      if (indexNowResult.success || searchEnginesSuccess > 0) {
        setLastResult(
          `✅ Sitemap отправлен через IndexNow и в ${searchEnginesSuccess}/3 поисковых систем (Google, Яндекс, Bing)`
        );
      } else {
        setLastResult('ℹ️ Sitemap уже был недавно отправлен');
      }
    } catch (error) {
      setLastResult(`❌ Ошибка: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    clearNotificationCache();
    setLastResult('🗑️ Кэш очищен. Теперь можно отправить все URL заново');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Zap" size={24} />
          IndexNow - Мгновенная индексация
        </CardTitle>
        <CardDescription>
          Уведомите поисковые системы (Яндекс, Google, Bing) об обновлениях сайта
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Всего уведомлений</div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">За последние 24 часа</div>
            <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleNotifyAll} 
            disabled={loading}
            className="w-full"
          >
            <Icon name="Send" size={18} className="mr-2" />
            Отправить все страницы
          </Button>
          
          <Button 
            onClick={handleNotifySitemap} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <Icon name="FileText" size={18} className="mr-2" />
            Отправить Sitemap.xml
          </Button>
          
          <Button 
            onClick={handleClearCache} 
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            <Icon name="Trash2" size={18} className="mr-2" />
            Очистить кэш уведомлений
          </Button>
        </div>

        {lastResult && (
          <div className="p-3 bg-gray-100 rounded-lg text-sm">
            <div className="font-medium mb-1">Результат:</div>
            <div className="text-gray-700">{lastResult}</div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <div>💡 <strong>Совет:</strong> Используйте после добавления нового контента</div>
          <div>⏱️ Автоматические уведомления отправляются раз в 24 часа для каждой страницы</div>
          <div>🔄 Поддерживаются: Яндекс, Google, Bing, Seznam.cz, Naver.com</div>
        </div>
      </CardContent>
    </Card>
  );
}