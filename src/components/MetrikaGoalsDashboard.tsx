import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Goal {
  goal: string;
  name: string;
  icon: string;
  count: number;
  configured: boolean;
  error?: string;
}

interface MetrikaStats {
  configured: boolean;
  period_days: number;
  date_from: string;
  date_to: string;
  goals: Goal[];
  total_goals: number;
  active_goals: number;
}

export default function MetrikaGoalsDashboard() {
  const [stats, setStats] = useState<MetrikaStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/b04ca2ea-c45c-4dc1-b73c-ba60c3641d0f?days=${period}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching goals stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // обновление каждые 30 секунд

    return () => clearInterval(interval);
  }, [autoRefresh, period]);

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Target" className="text-primary" />
            Достижение целей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats.configured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Target" className="text-primary" />
            Достижение целей
          </CardTitle>
          <CardDescription>
            Требуется токен YANDEX_METRIKA_TOKEN для получения статистики
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 p-6">
            <Icon name="AlertCircle" className="mx-auto mb-3" size={48} />
            <p>Настройте токен Яндекс.Метрики в разделе выше</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalReaches = stats.goals.reduce((sum, g) => sum + g.count, 0);
  const activeGoals = stats.goals.filter(g => g.configured && g.count > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Target" className="text-primary" />
              Достижение целей
              {loading && <Icon name="Loader2" className="animate-spin text-gray-400" size={16} />}
            </CardTitle>
            <CardDescription>
              За последние {period} дней • Обновлено: {new Date().toLocaleTimeString('ru-RU')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="h-9 px-3 border rounded-lg bg-white text-sm hover:border-primary transition-colors"
            >
              <option value="1">1 день</option>
              <option value="7">7 дней</option>
              <option value="14">14 дней</option>
              <option value="30">30 дней</option>
            </select>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-1"
            >
              <Icon name={autoRefresh ? "Pause" : "Play"} size={14} />
              {autoRefresh ? 'Авто' : 'Вручную'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
            >
              <Icon name="RefreshCw" size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Всего достижений</div>
            <div className="text-3xl font-bold text-blue-700">{totalReaches}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Активные цели</div>
            <div className="text-3xl font-bold text-green-700">{activeGoals.length}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-sm text-purple-600 mb-1">Настроено целей</div>
            <div className="text-3xl font-bold text-purple-700">{stats.active_goals}/{stats.total_goals}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.goals
            .sort((a, b) => b.count - a.count)
            .map((goal) => (
              <div
                key={goal.goal}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  goal.count > 0
                    ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      goal.count > 0
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Icon name={goal.icon as any} fallback="Target" size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{goal.name}</div>
                    {!goal.configured && (
                      <div className="text-xs text-orange-500 flex items-center gap-1">
                        <Icon name="AlertTriangle" size={10} />
                        Не настроена
                      </div>
                    )}
                    {goal.error && (
                      <div className="text-xs text-red-500 flex items-center gap-1">
                        <Icon name="XCircle" size={10} />
                        Ошибка
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      goal.count > 0 ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {goal.count}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {activeGoals.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <Icon name="TrendingUp" className="inline mr-1" size={14} />
              Самая активная цель: <span className="font-semibold text-primary">
                {activeGoals[0].name}
              </span> ({activeGoals[0].count} достижений)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}