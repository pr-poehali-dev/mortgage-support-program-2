import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsInfo() {
  const analytics = useAnalytics();

  const openGoogleAnalytics = () => {
    window.open('https://analytics.google.com/', '_blank');
  };

  const openYandexMetrika = () => {
    if (analytics.yandex_metrika_id) {
      window.open(`https://metrika.yandex.ru/dashboard?id=${analytics.yandex_metrika_id}`, '_blank');
    } else {
      window.open('https://metrika.yandex.ru/', '_blank');
    }
  };

  const setupGA = () => {
    window.open('https://analytics.google.com/analytics/web/#/provision', '_blank');
  };

  const setupYM = () => {
    window.open('https://metrika.yandex.ru/list', '_blank');
  };

  return (
    <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-600 rounded-lg">
          <Icon name="BarChart3" size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Веб-аналитика</h3>
          <p className="text-sm text-gray-600 mb-4">
            Отслеживание посещаемости и поведения пользователей на сайте
          </p>
          
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={18} className="text-blue-600" />
                  <span className="font-semibold text-sm">Google Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  {analytics.google_analytics_id ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      ✓ Подключено
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                      Не настроено
                    </span>
                  )}
                </div>
              </div>
              
              {analytics.google_analytics_id ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                    ID: {analytics.google_analytics_id}
                  </p>
                  <Button
                    size="sm"
                    onClick={openGoogleAnalytics}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon name="ExternalLink" size={14} className="mr-2" />
                    Открыть панель Google Analytics
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    Создайте аккаунт GA и добавьте ID через секреты проекта
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={setupGA}
                    className="w-full"
                  >
                    <Icon name="Plus" size={14} className="mr-2" />
                    Настроить Google Analytics
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Activity" size={18} className="text-red-600" />
                  <span className="font-semibold text-sm">Яндекс.Метрика</span>
                </div>
                <div className="flex items-center gap-2">
                  {analytics.yandex_metrika_id ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      ✓ Подключено
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                      Не настроено
                    </span>
                  )}
                </div>
              </div>
              
              {analytics.yandex_metrika_id ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                    ID: {analytics.yandex_metrika_id}
                  </p>
                  <Button
                    size="sm"
                    onClick={openYandexMetrika}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Icon name="ExternalLink" size={14} className="mr-2" />
                    Открыть панель Яндекс.Метрики
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    Создайте счетчик и добавьте ID через секреты проекта
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={setupYM}
                    className="w-full"
                  >
                    <Icon name="Plus" size={14} className="mr-2" />
                    Настроить Яндекс.Метрику
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex gap-2">
              <Icon name="Info" size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-700">
                <p className="font-semibold mb-1">Возможности аналитики:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Отслеживание посещаемости в реальном времени</li>
                  <li>Карта кликов и вебвизор (Метрика)</li>
                  <li>Источники трафика и конверсии</li>
                  <li>Поведение пользователей на сайте</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
