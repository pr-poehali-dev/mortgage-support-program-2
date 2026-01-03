import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CatalogHeaderProps {
  loading: boolean;
  error: string | null;
  objectsCount: number;
  onImportClick: () => void;
}

export default function CatalogHeader({ loading, error, objectsCount, onImportClick }: CatalogHeaderProps) {
  return (
    <div className="mb-3 sm:mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Объекты</h2>
        {!loading && !error && (
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Найдено объектов: {objectsCount}
          </p>
        )}
      </div>
      <Button onClick={onImportClick} className="gap-2">
        <Icon name="Download" size={18} />
        Импорт с Avito
      </Button>
    </div>
  );
}
