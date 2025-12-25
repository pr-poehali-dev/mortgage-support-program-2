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
    // Отключено до открытия публичного доступа к функциям
    // Показываем минимальные значения
    setStats({
      page_views: 0,
      applications_sent: 3
    });
    setIsLoading(false);
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