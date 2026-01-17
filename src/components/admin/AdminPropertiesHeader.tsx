import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminPropertiesHeaderProps {
  onCreateClick: () => void;
}

export default function AdminPropertiesHeader({ onCreateClick }: AdminPropertiesHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Управление объектами</h1>
          </div>
          <Button onClick={onCreateClick} className="gap-2">
            <Icon name="Plus" size={20} />
            Добавить объект
          </Button>
        </div>
      </div>
    </div>
  );
}
