import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  daily_views: Array<{ date: string; views: number }>;
  daily_applications: Array<{ date: string; applications: number }>;
  traffic_sources: Array<{ source: string; count: number }>;
  popular_programs: Array<{ program: string; count: number }>;
  totals: {
    total_views: number;
    total_applications: number;
  };
  period_days: number;
}

const PROGRAM_NAMES: Record<string, string> = {
  family: 'Семейная ипотека',
  it: 'IT ипотека',
  military: 'Военная ипотека',
  rural: 'Сельская ипотека',
  basic: 'Базовая ипотека',
  unknown: 'Помочь подобрать'
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState(30);

  const fetchAnalytics = async (adminPassword: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://functions.poehali.dev/66427508-92e1-41bc-837c-dfc3f217d6c3?days=${period}`, {
        method: 'GET',
        headers: {
          'X-Admin-Password': adminPassword
        }
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setError('Неверный пароль');
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }

      const data = await response.json();
      setAnalytics(data);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Не удалось загрузить аналитику');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(password);
  };

  useEffect(() => {
    if (isAuthenticated && password) {
      fetchAnalytics(password);
    }
  }, [period]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" className="text-white" size={32} />
            </div>
            <CardTitle className="text-2xl">Админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа к аналитике</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
                  <Icon name="AlertCircle" size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600"
                disabled={loading || !password}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" className="mr-2" size={18} />
                    Войти
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const dailyViewsData = {
    labels: analytics.daily_views.map(d => new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })).reverse(),
    datasets: [{
      label: 'Просмотры',
      data: analytics.daily_views.map(d => d.views).reverse(),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const dailyApplicationsData = {
    labels: analytics.daily_applications.map(d => new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })).reverse(),
    datasets: [{
      label: 'Заявки',
      data: analytics.daily_applications.map(d => d.applications).reverse(),
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderRadius: 8
    }]
  };

  const trafficSourcesData = {
    labels: analytics.traffic_sources.map(s => s.source),
    datasets: [{
      data: analytics.traffic_sources.map(s => s.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(132, 204, 22, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ]
    }]
  };

  const conversionRate = analytics.totals.total_views > 0 
    ? ((analytics.totals.total_applications / analytics.totals.total_views) * 100).toFixed(2)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Аналитика сайта
            </h1>
            <p className="text-gray-600 mt-1">Детальная статистика за последние {period} дней</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="h-10 px-4 border rounded-lg bg-white hover:border-primary transition-colors"
            >
              <option value={7}>7 дней</option>
              <option value={30}>30 дней</option>
              <option value={90}>90 дней</option>
              <option value={365}>1 год</option>
            </select>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="h-10"
            >
              <Icon name="Home" className="mr-2" size={18} />
              На главную
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Всего просмотров</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="Eye" className="text-blue-500" size={28} />
                {analytics.totals.total_views.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Всего заявок</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="FileEdit" className="text-purple-500" size={28} />
                {analytics.totals.total_applications.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Конверсия</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="TrendingUp" className="text-green-500" size={28} />
                {conversionRate}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="LineChart" className="text-blue-500" size={24} />
                Динамика просмотров
              </CardTitle>
              <CardDescription>Ежедневная статистика посещаемости</CardDescription>
            </CardHeader>
            <CardContent>
              <Line 
                data={dailyViewsData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart3" className="text-purple-500" size={24} />
                Динамика заявок
              </CardTitle>
              <CardDescription>Количество заявок по дням</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar 
                data={dailyApplicationsData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Globe" className="text-green-500" size={24} />
                Источники трафика
              </CardTitle>
              <CardDescription>Откуда приходят пользователи</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <Doughnut 
                    data={trafficSourcesData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Award" className="text-orange-500" size={24} />
                Популярные программы
              </CardTitle>
              <CardDescription>Самые запрашиваемые ипотечные программы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popular_programs.length > 0 ? (
                  analytics.popular_programs.map((prog, idx) => {
                    const total = analytics.popular_programs.reduce((sum, p) => sum + p.count, 0);
                    const percentage = ((prog.count / total) * 100).toFixed(1);
                    
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{PROGRAM_NAMES[prog.program] || prog.program}</span>
                          <span className="text-gray-600">{prog.count} заявок ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary to-purple-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">Нет данных о заявках</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
