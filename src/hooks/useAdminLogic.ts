import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { trackExcelDownload, trackEmailReport } from '@/services/analytics';
import { compressImage } from '@/utils/imageCompressor';

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
  contact_name?: string;
  rutube_link?: string;
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

export function useAdminLogic() {
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
    phone: '', contact_name: '', rutube_link: '', building_type: '', renovation: '', bathroom: '',
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

    const MAX_PHOTOS = 50;
    const currentPhotosCount = formData.photos.length;
    const remainingSlots = MAX_PHOTOS - currentPhotosCount;

    if (remainingSlots <= 0) {
      alert(`Максимум ${MAX_PHOTOS} фотографий. Удалите лишние фото перед добавлением новых.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`Можно добавить только ${remainingSlots} фото. Первые ${remainingSlots} будут загружены.`);
    }

    setUploadingPhoto(true);
    const uploadedUrls: string[] = [];
    let errors = 0;

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        
        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
          console.error(`Файл ${file.name} не является изображением`);
          errors++;
          continue;
        }

        // Сжимаем изображение до 9 МБ
        let compressedFile: File;
        try {
          compressedFile = await compressImage(file, 9);
        } catch (compressError) {
          console.error(`Ошибка сжатия ${file.name}:`, compressError);
          errors++;
          continue;
        }

        const reader = new FileReader();
        
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Ошибка чтения файла'));
          reader.readAsDataURL(compressedFile);
        });

        const response = await fetch('https://functions.poehali.dev/94c626eb-409a-4a18-836f-f3750239d1b4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo_data: base64 })
        });

        const data = await response.json();
        if (data.success && data.photo_url) {
          uploadedUrls.push(data.photo_url);
        } else {
          errors++;
        }
      }

      if (uploadedUrls.length > 0) {
        const allPhotos = [...formData.photos, ...uploadedUrls];
        setFormData({
          ...formData,
          photos: allPhotos,
          photo_url: allPhotos[0] || ''
        });
      }

      if (errors > 0) {
        alert(`Загружено ${uploadedUrls.length} фото. Ошибок: ${errors}`);
      } else if (uploadedUrls.length > 0) {
        alert(`Успешно загружено ${uploadedUrls.length} фото!`);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      alert('Ошибка загрузки фото: ' + (err as Error).message);
    } finally {
      setUploadingPhoto(false);
      // Сбрасываем input для возможности повторной загрузки тех же файлов
      e.target.value = '';
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
        contact_name: formData.contact_name,
        rutube_link: formData.rutube_link,
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
          phone: '', contact_name: '', rutube_link: '', building_type: '', renovation: '', bathroom: '',
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

  return {
    isAuthenticated,
    password,
    setPassword,
    analytics,
    loading,
    error,
    period,
    setPeriod,
    emailModalOpen,
    setEmailModalOpen,
    reportEmail,
    setReportEmail,
    sendingEmail,
    properties,
    propertiesLoading,
    propertyDialogOpen,
    setPropertyDialogOpen,
    uploadingPhoto,
    editProperty,
    formData,
    setFormData,
    handleLogin,
    handlePhotoSelect,
    handlePropertySubmit,
    exportToExcel,
    sendEmailReport
  };
}