import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import PropertyFilters from '@/components/catalog/PropertyFilters';

interface CatalogSortControlsProps {
  catalogFilter: string;
  setCatalogFilter: (filter: string) => void;
  catalogSort: 'default' | 'price-asc' | 'price-desc' | 'date-new' | 'date-old';
  setCatalogSort: (sort: 'default' | 'price-asc' | 'price-desc' | 'date-new' | 'date-old') => void;
  catalogCounts: {
    all: number;
    apartment: number;
    house: number;
    land: number;
    commercial: number;
  };
}

export default function CatalogSortControls({
  catalogFilter,
  setCatalogFilter,
  catalogSort,
  setCatalogSort,
  catalogCounts
}: CatalogSortControlsProps) {
  return (
    <>
      <PropertyFilters
        catalogFilter={catalogFilter}
        setCatalogFilter={setCatalogFilter}
        catalogCounts={catalogCounts}
      />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Сортировка:</span>
        <Button
          variant={catalogSort === 'default' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCatalogSort('default')}
        >
          По умолчанию
        </Button>
        <Button
          variant={catalogSort === 'price-asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCatalogSort('price-asc')}
          className="gap-1"
        >
          Цена <Icon name="ArrowUp" size={14} />
        </Button>
        <Button
          variant={catalogSort === 'price-desc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCatalogSort('price-desc')}
          className="gap-1"
        >
          Цена <Icon name="ArrowDown" size={14} />
        </Button>
        <Button
          variant={catalogSort === 'date-new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCatalogSort('date-new')}
        >
          Сначала новые
        </Button>
        <Button
          variant={catalogSort === 'date-old' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCatalogSort('date-old')}
        >
          Сначала старые
        </Button>
      </div>
    </>
  );
}
