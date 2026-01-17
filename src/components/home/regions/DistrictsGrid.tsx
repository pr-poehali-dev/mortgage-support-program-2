import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface DistrictsGridProps {
  onCityClick: (cityName: string) => void;
  filteredCitiesCount: number;
}

const districts = [
  { name: 'Ленинский', region: 'Севастополь', image: 'https://images.unsplash.com/photo-1606916009611-b5754e0eb929?w=400&q=80', color: 'blue' },
  { name: 'Гагаринский', region: 'Севастополь', image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&q=80', color: 'blue' },
  { name: 'Нахимовский', region: 'Севастополь', image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263b6?w=400&q=80', color: 'blue' },
  { name: 'Балаклавский', region: 'Севастополь', image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&q=80', color: 'blue' },
  { name: 'Симферополь', region: 'Крым', image: 'https://images.unsplash.com/photo-1554844453-7ea2a562a6c8?w=400&q=80', color: 'purple' },
  { name: 'Ялта', region: 'Крым', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', color: 'purple' },
  { name: 'Феодосия', region: 'Крым', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', color: 'purple' },
  { name: 'Евпатория', region: 'Крым', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', color: 'purple' },
];

export default function DistrictsGrid({ onCityClick, filteredCitiesCount }: DistrictsGridProps) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {districts.map((district) => (
          <Card 
            key={district.name} 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white cursor-pointer group hover:-translate-y-1" 
            onClick={() => onCityClick(district.region === 'Севастополь' ? `Севастополь (${district.name})` : district.name)}
          >
            <div className="relative h-32 sm:h-40 overflow-hidden">
              <img
                src={district.image}
                alt={district.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="font-bold text-white text-sm sm:text-base">{district.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="MapPin" size={12} className={`text-${district.color}-400 sm:w-3.5 sm:h-3.5`} />
                  <p className="text-[10px] sm:text-xs text-white/90">{district.region}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
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