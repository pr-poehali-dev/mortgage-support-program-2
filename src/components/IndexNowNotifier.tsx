import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { notifySitemap, notifyCurrentPage, notifySitemapXml } from '@/services/indexnow';
import { toast } from 'sonner';

export default function IndexNowNotifier() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    const lastNotif = localStorage.getItem('indexnow_last_notification');
    if (lastNotif) {
      setLastNotification(lastNotif);
    }
  }, []);

  const handleNotifyCurrentPage = async () => {
    setIsLoading(true);
    try {
      const result = await notifyCurrentPage();
      const successCount = result.results.filter(r => r.status === 'success').length;
      
      if (successCount > 0) {
        toast.success(`Страница отправлена в ${successCount} поисковых систем`);
        const now = new Date().toISOString();
        localStorage.setItem('indexnow_last_notification', now);
        setLastNotification(now);
      } else {
        toast.error('Не удалось отправить уведомления');
      }
    } catch (error) {
      toast.error('Ошибка при отправке уведомления');
      console.error('IndexNow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotifyAllPages = async () => {
    setIsLoading(true);
    try {
      const [sitemapResult, pagesResult] = await Promise.all([
        notifySitemapXml(),
        notifySitemap()
      ]);
      
      const successCount = pagesResult.results.filter(r => r.status === 'success').length;
      
      if (successCount > 0) {
        toast.success(`${pagesResult.urls_submitted} страниц + sitemap.xml отправлено в ${successCount} поисковых систем`);
        const now = new Date().toISOString();
        localStorage.setItem('indexnow_last_notification', now);
        setLastNotification(now);
      } else {
        toast.error('Не удалось отправить уведомления');
      }
    } catch (error) {
      toast.error('Ошибка при отправке уведомлений');
      console.error('IndexNow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <Icon name="Zap" size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Быстрая индексация</h3>
          <p className="text-sm text-gray-600 mb-4">
            Отправьте уведомление в поисковые системы (Яндекс, Bing) для моментальной индексации страниц
          </p>
          
          {lastNotification && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-white px-3 py-2 rounded-lg border border-gray-200">
              <Icon name="Clock" size={14} />
              <span>Последнее уведомление: {formatDate(lastNotification)}</span>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              onClick={handleNotifyCurrentPage}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Эту страницу
                </>
              )}
            </Button>
            
            <Button
              onClick={handleNotifyAllPages}
              disabled={isLoading}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Globe" size={16} className="mr-2" />
                  Весь сайт
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}