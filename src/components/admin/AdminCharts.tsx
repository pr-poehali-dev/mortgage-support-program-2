import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const PROGRAM_NAMES: Record<string, string> = {
  family: 'Семейная ипотека',
  it: 'IT ипотека',
  military: 'Военная ипотека',
  rural: 'Сельская ипотека',
  basic: 'Базовая ипотека',
  unknown: 'Помочь подобрать'
};

interface AnalyticsData {
  daily_views: Array<{ date: string; views: number }>;
  daily_applications: Array<{ date: string; applications: number }>;
  traffic_sources: Array<{ source: string; count: number }>;
  popular_programs: Array<{ program: string; count: number }>;
}

interface AdminChartsProps {
  analytics: AnalyticsData;
}

export default function AdminCharts({ analytics }: AdminChartsProps) {
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

  return (
    <>
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
    </>
  );
}
