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
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        variant={catalogFilter === 'all' ? 'default' : 'outline'}
        onClick={() => setCatalogFilter('all')}
        className="gap-2"
      >
        <Icon name="LayoutGrid" size={16} />
        Все ({catalogCounts.all})
      </Button>
      {catalogCounts.apartment > 0 && (
        <Button 
          variant={catalogFilter === 'apartment' ? 'default' : 'outline'}
          onClick={() => setCatalogFilter('apartment')}
          className="gap-2"
        >
          <Icon name="Building2" size={16} />
          Квартиры ({catalogCounts.apartment})
        </Button>
      )}
      {catalogCounts.house > 0 && (
        <Button 
          variant={catalogFilter === 'house' ? 'default' : 'outline'}
          onClick={() => setCatalogFilter('house')}
          className="gap-2"
        >
          <Icon name="Home" size={16} />
          Дома ({catalogCounts.house})
        </Button>
      )}
      {catalogCounts.land > 0 && (
        <Button 
          variant={catalogFilter === 'land' ? 'default' : 'outline'}
          onClick={() => setCatalogFilter('land')}
          className="gap-2"
        >
          <Icon name="TreePine" size={16} />
          Участки ({catalogCounts.land})
        </Button>
      )}
      {catalogCounts.commercial > 0 && (
        <Button 
          variant={catalogFilter === 'commercial' ? 'default' : 'outline'}
          onClick={() => setCatalogFilter('commercial')}
          className="gap-2"
        >
          <Icon name="Building" size={16} />
          Коммерция ({catalogCounts.commercial})
        </Button>
      )}
    </div>
  );
}
