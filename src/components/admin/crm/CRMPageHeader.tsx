import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CRMPageHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function CRMPageHeader({ isRefreshing, onRefresh }: CRMPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <Icon name="ChevronLeft" size={18} className="mr-1" />
              Назад
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="Users" size={22} className="text-primary" />
                CRM — Управление клиентами
              </h1>
              <p className="text-xs text-gray-500">Недвижимость · Все заявки и сделки</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRefreshing && (
              <Icon name="Loader2" size={16} className="animate-spin text-blue-500" />
            )}
            <Badge variant="outline" className="text-green-600 border-green-300">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse inline-block" />
              Live
            </Badge>
            <Button size="sm" onClick={onRefresh}>
              <Icon name="RefreshCw" size={14} className="mr-1" />
              Обновить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
