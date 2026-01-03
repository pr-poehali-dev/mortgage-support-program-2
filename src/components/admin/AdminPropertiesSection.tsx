import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Property {
  id: number;
  title: string;
  type: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  photo_url?: string;
  photos?: string[];
}

interface AdminPropertiesSectionProps {
  properties: Property[];
  propertiesLoading: boolean;
}

export default function AdminPropertiesSection({
  properties,
  propertiesLoading
}: AdminPropertiesSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Последние объекты</h2>
          <p className="text-gray-600 text-sm mt-1">Недавно добавленные объявления</p>
        </div>
        <Button
          onClick={() => window.location.href = '/admin/properties'}
          className="gap-2"
        >
          <Icon name="Building2" size={16} />
          Все объекты
        </Button>
      </div>

      {propertiesLoading ? (
        <div className="text-center py-8">
          <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Building2" size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">Нет добавленных объектов</p>
          <Button onClick={() => window.location.href = '/admin/properties'} className="gap-2">
            <Icon name="Plus" size={16} />
            Добавить первый объект
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = '/admin/properties'}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={property.photos?.[0] || property.photo_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                  <p className="font-bold text-primary text-sm">
                    {property.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon name="MapPin" size={12} />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
                {property.area && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                    <Icon name="Maximize" size={12} />
                    <span>{property.area} м²</span>
                    {property.rooms && <span>• {property.rooms} комн.</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
