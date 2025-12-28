import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface DistrictsGridProps {
  onCityClick: (cityName: string) => void;
  filteredCitiesCount: number;
}

export default function DistrictsGrid({ onCityClick, filteredCitiesCount }: DistrictsGridProps) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Севастополь (Ленинский)')}>
          <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Ленинский</p>
          <p className="text-xs text-gray-500 mt-1">Севастополь</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Севастополь (Гагаринский)')}>
          <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Гагаринский</p>
          <p className="text-xs text-gray-500 mt-1">Севастополь</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Севастополь (Нахимовский)')}>
          <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Нахимовский</p>
          <p className="text-xs text-gray-500 mt-1">Севастополь</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Севастополь (Балаклавский)')}>
          <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Балаклавский</p>
          <p className="text-xs text-gray-500 mt-1">Севастополь</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Симферополь')}>
          <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Симферополь</p>
          <p className="text-xs text-gray-500 mt-1">Крым</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Ялта')}>
          <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Ялта</p>
          <p className="text-xs text-gray-500 mt-1">Крым</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Феодосия')}>
          <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Феодосия</p>
          <p className="text-xs text-gray-500 mt-1">Крым</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => onCityClick('Евпатория')}>
          <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900">Евпатория</p>
          <p className="text-xs text-gray-500 mt-1">Крым</p>
        </Card>
      </div>
      <div className="text-center mt-6">
        <p className="text-gray-600 mb-2">
          💡 Нажмите на город на карте или используйте поиск выше
        </p>
        <p className="text-sm text-gray-500">
          Показано населённых пунктов: <span className="font-semibold text-blue-600">{filteredCitiesCount}</span>
        </p>
      </div>
    </>
  );
}
