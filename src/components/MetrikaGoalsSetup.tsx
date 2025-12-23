import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Goal {
  name: string;
  id?: number;
  status?: string;
}

export default function MetrikaGoalsSetup() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [existingGoals, setExistingGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const goalDescriptions: Record<string, string> = {
    application_sent: 'Отправка заявки',
    phone_click: 'Клик по телефону',
    telegram_click: 'Переход в Telegram',
    calculator_used: 'Использование калькулятора',
    quiz_completed: 'Завершение квиза',
    tab_changed: 'Переключение разделов',
    excel_download: 'Скачивание Excel',
    email_report: 'Отправка отчета на Email'
  };

  useEffect(() => {
    checkGoals();
  }, []);

  const checkGoals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/5ee362e0-261a-45f7-8c6d-6bbcd110368a');
      const data = await response.json();
      
      setIsConfigured(data.configured || false);
      setExistingGoals(data.goals || []);
    } catch (error) {
      console.error('Failed to check goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createGoals = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('https://functions.poehali.dev/5ee362e0-261a-45f7-8c6d-6bbcd110368a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Создано ${data.created.length} целей в Яндекс.Метрике`);
        await checkGoals();
      } else {
        toast.error('Не удалось создать цели. Проверьте токен.');
      }
    } catch (error) {
      toast.error('Ошибка при создании целей');
      console.error('Failed to create goals:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const openMetrikaGoals = () => {
    window.open('https://metrika.yandex.ru/settings/goals?id=105974763', '_blank');
  };

  const openOAuthSetup = () => {
    window.open('https://oauth.yandex.ru/authorize?response_type=token&client_id=c9fa59bc1b9048c8ae52d4f0e15e5d86', '_blank');
  };

  if (isLoading) {
    return (
      <Card className="p-6 border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader2" size={32} className="animate-spin text-orange-600" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-600 rounded-lg">
          <Icon name="Target" size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Цели Яндекс.Метрики</h3>
          <p className="text-sm text-gray-600 mb-4">
            Автоматическая настройка целей для отслеживания конверсий
          </p>

          {!isConfigured ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Icon name="AlertTriangle" size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-2">Требуется OAuth токен</p>
                    <ol className="space-y-1 list-decimal list-inside text-xs">
                      <li>Получите токен через форму выше ⬆️</li>
                      <li>Или создайте на oauth.yandex.ru</li>
                      <li>Добавьте в секреты проекта: YANDEX_METRIKA_TOKEN</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Button
                onClick={openOAuthSetup}
                variant="outline"
                className="w-full"
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Открыть OAuth Яндекса
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">Настроенные цели</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    {existingGoals.length} целей
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(goalDescriptions).map(([key, description]) => {
                    const exists = existingGoals.some(g => g.name === key);
                    return (
                      <div key={key} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <Icon 
                            name={exists ? "CheckCircle2" : "Circle"} 
                            size={14} 
                            className={exists ? "text-green-600" : "text-gray-300"} 
                          />
                          <span className="font-mono text-gray-600">{key}</span>
                        </div>
                        <span className="text-gray-500">{description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={createGoals}
                  disabled={isCreating}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {isCreating ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать цели
                    </>
                  )}
                </Button>

                <Button
                  onClick={openMetrikaGoals}
                  variant="outline"
                  className="flex-1"
                >
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  Открыть в Метрике
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex gap-2">
              <Icon name="Info" size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-700">
                <p className="font-semibold mb-1">8 целей для отслеживания:</p>
                <p>Заявки, звонки, Telegram, калькулятор, квиз, разделы, экспорт, email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
