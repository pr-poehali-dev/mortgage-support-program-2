import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PropertyFiltersProps {
  catalogFilter: string;
  setCatalogFilter: (filter: string) => void;
  catalogCounts: {
    all: number;
    apartment: number;
    house: number;
    land: number;
    commercial: number;
  };
}

export default function PropertyFilters({ catalogFilter, setCatalogFilter, catalogCounts }: PropertyFiltersProps) {
  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0 mb-4">
      <div className="flex gap-2 px-3 sm:px-0 min-w-max sm:min-w-0 sm:flex-wrap">
        <Button 
          variant={catalogFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setCatalogFilter('all')}
          className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0"
        >
          <Icon name="LayoutGrid" size={14} className="sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Все ({catalogCounts.all})</span>
        </Button>
        {catalogCounts.apartment > 0 && (
          <Button 
            variant={catalogFilter === 'apartment' ? 'default' : 'outline'}
            onClick={() => setCatalogFilter('apartment')}
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0"
          >
            <Icon name="Building2" size={14} className="sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Квартиры ({catalogCounts.apartment})</span>
          </Button>
        )}
        {catalogCounts.house > 0 && (
          <Button 
            variant={catalogFilter === 'house' ? 'default' : 'outline'}
            onClick={() => setCatalogFilter('house')}
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0"
          >
            <Icon name="Home" size={14} className="sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Дома ({catalogCounts.house})</span>
          </Button>
        )}
        {catalogCounts.land > 0 && (
          <Button 
            variant={catalogFilter === 'land' ? 'default' : 'outline'}
            onClick={() => setCatalogFilter('land')}
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0"
          >
            <Icon name="TreePine" size={14} className="sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Участки ({catalogCounts.land})</span>
          </Button>
        )}
        {catalogCounts.commercial > 0 && (
          <Button 
            variant={catalogFilter === 'commercial' ? 'default' : 'outline'}
            onClick={() => setCatalogFilter('commercial')}
            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-0"
          >
            <Icon name="Building" size={14} className="sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">Коммерция ({catalogCounts.commercial})</span>
          </Button>
        )}
      </div>
    </div>
  );
}