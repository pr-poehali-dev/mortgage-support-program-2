import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { crimeaCities } from '@/data/crimea-cities';
import { trackFilterChanged, trackSearchUsed } from '@/services/metrika-goals';

interface CityFilterAndSearchProps {
  filterType: 'all' | 'city' | 'town';
  setFilterType: (type: 'all' | 'city' | 'town') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCities: typeof crimeaCities;
  onCityClick: (cityName: string) => void;
}

export default function CityFilterAndSearch({
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery,
  filteredCities,
  onCityClick,
}: CityFilterAndSearchProps) {
  const handleFilterChange = (type: 'all' | 'city' | 'town') => {
    setFilterType(type);
    const count = type === 'all' 
      ? crimeaCities.length 
      : crimeaCities.filter(c => c.type === type).length;
    trackFilterChanged(type, count);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      trackSearchUsed(value);
    }
  };

  return (
    <div className="mb-6 max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('all')}
          className="min-w-[100px]"
        >
          <Icon name="Map" size={16} className="mr-2" />
          Все ({crimeaCities.length})
        </Button>
        <Button
          variant={filterType === 'city' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('city')}
          className="min-w-[100px]"
        >
          <Icon name="Building2" size={16} className="mr-2" />
          Города ({crimeaCities.filter(c => c.type === 'city').length})
        </Button>
        <Button
          variant={filterType === 'town' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('town')}
          className="min-w-[100px]"
        >
          <Icon name="Home" size={16} className="mr-2" />
          ПГТ ({crimeaCities.filter(c => c.type === 'town').length})
        </Button>
      </div>
      
      <div className="relative">
        <Icon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Найти населённый пункт..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 pr-4 py-3 text-base"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      {searchQuery && filteredCities.length > 0 && (
        <Card className="mt-2 p-2 max-h-60 overflow-y-auto">
          {filteredCities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                onCityClick(city.name);
                setSearchQuery('');
              }}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon name="MapPin" size={16} className="text-blue-600" />
              <span className="font-medium">{city.name}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {city.type === 'city' ? 'Город' : 'ПГТ'}
              </span>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}