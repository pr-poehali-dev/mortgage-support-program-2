import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
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
import AdminLogin from '@/components/admin/AdminLogin';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminCharts from '@/components/admin/AdminCharts';
import AdminEmailDialog from '@/components/admin/AdminEmailDialog';
import IndexNowNotifier from '@/components/IndexNowNotifier';
import SitemapInfo from '@/components/SitemapInfo';
import AnalyticsInfo from '@/components/AnalyticsInfo';
import MetrikaGoalsSetup from '@/components/MetrikaGoalsSetup';
import MetrikaGoalsDashboard from '@/components/MetrikaGoalsDashboard';
import { trackExcelDownload, trackEmailReport } from '@/services/metrika-goals';

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
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [reportEmail, setReportEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const exportToExcel = () => {
    if (!analytics) return;

    const wb = XLSX.utils.book_new();

    const summaryData = [
      ['Отчет по аналитике сайта'],
      ['Период', `${period} дней`],
      ['Дата создания', new Date().toLocaleString('ru-RU')],
      [],
      ['Метрика', 'Значение'],
      ['Всего просмотров', analytics.totals.total_views],
      ['Всего заявок', analytics.totals.total_applications],
      ['Конверсия', `${((analytics.totals.total_applications / analytics.totals.total_views) * 100).toFixed(2)}%`]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Сводка');

    const viewsData = [
      ['Дата', 'Просмотры'],
      ...analytics.daily_views.map(d => [
        new Date(d.date).toLocaleDateString('ru-RU'),
        d.views
      ])
    ];
    const wsViews = XLSX.utils.aoa_to_sheet(viewsData);
    XLSX.utils.book_append_sheet(wb, wsViews, 'Просмотры по дням');

    const appsData = [
      ['Дата', 'Заявки'],
      ...analytics.daily_applications.map(d => [
        new Date(d.date).toLocaleDateString('ru-RU'),
        d.applications
      ])
    ];
    const wsApps = XLSX.utils.aoa_to_sheet(appsData);
    XLSX.utils.book_append_sheet(wb, wsApps, 'Заявки по дням');

    const sourcesData = [
      ['Источник', 'Количество', 'Процент'],
      ...analytics.traffic_sources.map(s => {
        const total = analytics.traffic_sources.reduce((sum, src) => sum + src.count, 0);
        const percentage = ((s.count / total) * 100).toFixed(1);
        return [s.source, s.count, `${percentage}%`];
      })
    ];
    const wsSources = XLSX.utils.aoa_to_sheet(sourcesData);
    XLSX.utils.book_append_sheet(wb, wsSources, 'Источники трафика');

    const programsData = [
      ['Программа', 'Заявок', 'Процент'],
      ...analytics.popular_programs.map(p => {
        const total = analytics.popular_programs.reduce((sum, prog) => sum + prog.count, 0);
        const percentage = ((p.count / total) * 100).toFixed(1);
        return [
          PROGRAM_NAMES[p.program] || p.program,
          p.count,
          `${percentage}%`
        ];
      })
    ];
    const wsPrograms = XLSX.utils.aoa_to_sheet(programsData);
    XLSX.utils.book_append_sheet(wb, wsPrograms, 'Популярные программы');

    const filename = `Аналитика_${period}дней_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    trackExcelDownload('analytics_report');
  };

  const sendEmailReport = async () => {
    if (!reportEmail) {
      alert('Укажите email');
      return;
    }

    setSendingEmail(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/2e6103d5-386e-4440-bed1-61b66d7e25f9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password
        },
        body: JSON.stringify({
          email: reportEmail,
          days: period
        })
      });

      if (response.ok) {
        alert(`Отчет успешно отправлен на ${reportEmail}`);
        trackEmailReport(reportEmail);
        setEmailModalOpen(false);
        setReportEmail('');
      } else {
        const data = await response.json();
        alert(`Ошибка: ${data.error || 'Не удалось отправить отчет'}`);
      }
    } catch (err) {
      alert('Не удалось отправить отчет. Проверьте настройки SMTP.');
    } finally {
      setSendingEmail(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const conversionRate = analytics.totals.total_views > 0 
    ? ((analytics.totals.total_applications / analytics.totals.total_views) * 100).toFixed(2)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto p-6 space-y-6">
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
              onClick={exportToExcel}
              className="h-10 bg-green-600 hover:bg-green-700"
            >
              <Icon name="Download" className="mr-2" size={18} />
              Скачать Excel
            </Button>
            <Button
              onClick={() => setEmailModalOpen(true)}
              className="h-10 bg-blue-600 hover:bg-blue-700"
            >
              <Icon name="Mail" className="mr-2" size={18} />
              Отправить на Email
            </Button>
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

        <AdminStatsCards totals={analytics.totals} conversionRate={conversionRate} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IndexNowNotifier />
          <SitemapInfo />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsInfo />
          <MetrikaGoalsSetup />
        </div>

        <MetrikaGoalsDashboard />

        <AdminCharts analytics={analytics} />
      </div>

      <AdminEmailDialog
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        reportEmail={reportEmail}
        setReportEmail={setReportEmail}
        sendingEmail={sendingEmail}
        onSendEmail={sendEmailReport}
        period={period}
      />
    </div>
  );
}