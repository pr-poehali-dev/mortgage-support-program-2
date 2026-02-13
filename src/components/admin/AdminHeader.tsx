import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  period: number;
  setPeriod: (period: number) => void;
  onExportExcel: () => void;
  onOpenEmailModal: () => void;
  onOpenPropertyDialog: () => void;
}

export default function AdminHeader({
  period,
  setPeriod,
  onExportExcel,
  onOpenEmailModal,
  onOpenPropertyDialog
}: AdminHeaderProps) {
  return (
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
          onClick={onExportExcel}
          className="h-10 bg-green-600 hover:bg-green-700"
        >
          <Icon name="Download" className="mr-2" size={18} />
          Скачать Excel
        </Button>
        <Button
          onClick={onOpenEmailModal}
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
          onClick={onOpenPropertyDialog}
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
          onClick={() => window.location.href = '/admin/news'}
          className="h-10 bg-teal-600 hover:bg-teal-700"
        >
          <Icon name="Newspaper" className="mr-2" size={18} />
          Новости
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
  );
}