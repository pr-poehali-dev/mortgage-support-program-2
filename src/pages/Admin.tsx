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
import CRMPanel from '@/components/admin/CRMPanel';
import IndexNowNotifier from '@/components/IndexNowNotifier';
import SitemapInfo from '@/components/SitemapInfo';
import AnalyticsInfo from '@/components/AnalyticsInfo';
import MetrikaGoalsSetup from '@/components/MetrikaGoalsSetup';
import MetrikaGoalsDashboard from '@/components/MetrikaGoalsDashboard';
import MetrikaTrendsChart from '@/components/MetrikaTrendsChart';
import AdminClock from '@/components/AdminClock';
import AdminCalendar from '@/components/AdminCalendar';
import { trackExcelDownload, trackEmailReport } from '@/services/analytics';
import PropertyFormDialog from '@/components/catalog/PropertyFormDialog';

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

const PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';

interface Property {
  id: number;
  title: string;
  type: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  photo_url?: string;
  photos?: string[];
}

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: '', type: 'apartment', property_category: 'apartment',
    operation: 'sale', price: '', location: '', area: '', rooms: '',
    floor: '', total_floors: '', land_area: '', photo_url: '',
    photos: [] as string[], description: '', property_link: '',
    phone: '', building_type: '', renovation: '', bathroom: '',
    balcony: '', furniture: false, pets_allowed: false,
    children_allowed: true, utilities_included: false,
    wall_material: '', contact_method: 'phone'
  });


  const fetchAnalytics = async (adminPassword: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://functions.poehali.dev/66427508-92e1-41bc-837c-dfc3f217d6c3?days=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        setIsAuthenticated(true);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Неверный пароль');
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      setIsAuthenticated(false);
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
      fetchProperties();
    }
  }, [period, isAuthenticated]);

  const fetchProperties = async () => {
    try {
      setPropertiesLoading(true);
      const response = await fetch(PROPERTIES_URL);
      const data = await response.json();
      
      if (data.success && data.properties) {
        setProperties(data.properties.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const response = await fetch('https://functions.poehali.dev/f8e0cf3b-9d78-46e4-a8aa-6f6ff94f7c0b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo_data: base64 })
        });

        const data = await response.json();
        if (data.success && data.photo_url) {
          uploadedUrls.push(data.photo_url);
        }
      }

      const allPhotos = [...formData.photos, ...uploadedUrls];
      setFormData({
        ...formData,
        photos: allPhotos,
        photo_url: allPhotos[0] || ''
      });
    } catch (err) {
      console.error('Photo upload error:', err);
      alert('Ошибка загрузки фото');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload: any = {
        title: formData.title,
        type: formData.type,
        property_category: formData.property_category,
        operation: formData.operation,
        price: formData.price,
        location: formData.location,
        area: formData.area,
        rooms: formData.rooms,
        floor: formData.floor,
        total_floors: formData.total_floors,
        land_area: formData.land_area,
        photo_url: formData.photo_url,
        photos: formData.photos,
        description: formData.description,
        property_link: formData.property_link,
        phone: formData.phone,
        building_type: formData.building_type,
        renovation: formData.renovation,
        bathroom: formData.bathroom,
        balcony: formData.balcony,
        furniture: formData.furniture,
        pets_allowed: formData.pets_allowed,
        children_allowed: formData.children_allowed,
        utilities_included: formData.utilities_included,
        wall_material: formData.wall_material,
        contact_method: formData.contact_method
      };

      const method = editProperty ? 'PUT' : 'POST';
      if (editProperty) {
        payload.id = editProperty.id;
      }

      const response = await fetch(PROPERTIES_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editProperty ? 'Объект обновлен!' : 'Объект успешно добавлен!');
        setPropertyDialogOpen(false);
        setFormData({
          title: '', type: 'apartment', property_category: 'apartment',
          operation: 'sale', price: '', location: '', area: '', rooms: '',
          floor: '', total_floors: '', land_area: '', photo_url: '',
          photos: [], description: '', property_link: '',
          phone: '', building_type: '', renovation: '', bathroom: '',
          balcony: '', furniture: false, pets_allowed: false,
          children_allowed: true, utilities_included: false,
          wall_material: '', contact_method: 'phone'
        });
        setEditProperty(null);
        fetchProperties();
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Ошибка при сохранении объекта');
    }
  };

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
        <AdminClock />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Аналитика сайта
              </h1>
              <p className="text-gray-600 mt-1">Детальная статистика за последние {period} дней</p>
            </div>
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
          </div>
          
          <div className="flex flex-wrap gap-3">
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
              onClick={() => window.location.href = '/admin/articles'}
              className="h-10 bg-purple-600 hover:bg-purple-700"
            >
              <Icon name="BookOpen" className="mr-2" size={18} />
              Управление статьями
            </Button>
            <Button
              onClick={() => setPropertyDialogOpen(true)}
              className="h-10 bg-orange-600 hover:bg-orange-700"
            >
              <Icon name="Plus" className="mr-2" size={18} />
              Добавить объект
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/properties'}
              variant="outline"
              className="h-10"
            >
              <Icon name="Building2" className="mr-2" size={18} />
              Все объекты
            </Button>
            <Button
              onClick={() => window.open('https://metrika.yandex.ru/dashboard?id=105974763', '_blank')}
              className="h-10 bg-red-600 hover:bg-red-700"
            >
              <Icon name="BarChart3" className="mr-2" size={18} />
              Яндекс.Метрика
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

        <CRMPanel />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCalendar />
          <div className="space-y-6">
            <IndexNowNotifier />
            <SitemapInfo />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsInfo />
          <MetrikaGoalsSetup />
        </div>

        <MetrikaGoalsDashboard />

        <MetrikaTrendsChart />

        <AdminCharts analytics={analytics} />

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Последние объекты</h2>
              <p className="text-gray-600 text-sm mt-1">Недавно добавленные объявления</p>
            </div>
            <Button
              onClick={() => window.location.href = '/admin/properties'}
              className="gap-2"
            >
              <Icon name="Building2" size={16} />
              Все объекты
            </Button>
          </div>

          {propertiesLoading ? (
            <div className="text-center py-8">
              <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Building2" size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Нет добавленных объектов</p>
              <Button onClick={() => window.location.href = '/admin/properties'} className="gap-2">
                <Icon name="Plus" size={16} />
                Добавить первый объект
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = '/admin/properties'}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={property.photos?.[0] || property.photo_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                      <p className="font-bold text-primary text-sm">
                        {property.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{property.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Icon name="MapPin" size={12} />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    {property.area && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                        <Icon name="Maximize" size={12} />
                        <span>{property.area} м²</span>
                        {property.rooms && <span>• {property.rooms} комн.</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

      <PropertyFormDialog
        dialogOpen={propertyDialogOpen}
        setDialogOpen={setPropertyDialogOpen}
        editProperty={editProperty}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handlePropertySubmit}
        handlePhotoSelect={handlePhotoSelect}
        uploadingPhoto={uploadingPhoto}
        photoPreview={formData.photos[0] || ''}
      />
    </div>
  );
}