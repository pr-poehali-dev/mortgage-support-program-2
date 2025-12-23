import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StatisticsCounterProps {
  inline?: boolean;
}

export default function StatisticsCounter({ inline = false }: StatisticsCounterProps) {
  const [stats, setStats] = useState({
    page_views: 0,
    applications_sent: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track page view with referrer source
    const trackPageView = async () => {
      try {
        const source = document.referrer 
          ? new URL(document.referrer).hostname 
          : 'direct';
        
        await fetch('https://functions.poehali.dev/66427508-92e1-41bc-837c-dfc3f217d6c3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            event_type: 'page_view',
            source: source 
          })
        });

        // Also update old counter for backward compatibility
        await fetch('https://functions.poehali.dev/9c63ab81-cbed-4119-87cf-8ad688fe4856', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metric: 'page_views' })
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    // Get current statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/9c63ab81-cbed-4119-87cf-8ad688fe4856');
        if (response.ok) {
          const data = await response.json();
          setStats({
            page_views: data.page_views || 0,
            applications_sent: Math.max(data.applications_sent || 0, 3)
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    trackPageView();
    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return null;
  }

  if (inline) {
    return (
      <div className="flex items-center gap-4 text-gray-300">
        <div className="flex items-center gap-2">
          <Icon name="Eye" size={16} />
          <span className="text-sm">Просмотров: <span className="font-semibold">{stats.page_views.toLocaleString('ru-RU')}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="FileCheck" size={16} />
          <span className="text-sm">Заявок: <span className="font-semibold">{stats.applications_sent.toLocaleString('ru-RU')}</span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Eye" className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-600">Просмотров</p>
              <p className="text-xl font-bold text-primary">{stats.page_views.toLocaleString('ru-RU')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="FileCheck" className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-600">Заявок получено</p>
              <p className="text-xl font-bold text-green-600">{stats.applications_sent.toLocaleString('ru-RU')}</p>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Icon name="TrendingUp" size={12} />
              Обновляется в реальном времени
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}