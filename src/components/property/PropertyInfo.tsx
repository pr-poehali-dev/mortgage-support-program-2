import Icon from '@/components/ui/icon';
import YandexMap from '@/components/YandexMap';

interface Property {
  id: number;
  slug?: string;
  title: string;
  type: string;
  property_category: string;
  operation: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  land_area?: number;
  photo_url?: string;
  photos?: string[];
  description?: string;
  phone?: string;
  contact_name?: string;
  rutube_link?: string;
  building_type?: string;
  renovation?: string;
  bathroom?: string;
  balcony?: string;
  furniture?: boolean;
  pets_allowed?: boolean;
  children_allowed?: boolean;
  latitude?: number;
  longitude?: number;
}

interface PropertyInfoProps {
  property: Property;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <>
      {/* Характеристики */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-3 sm:py-4 border-y">
        {property.area && (
          <div className="flex items-center gap-2">
            <Icon name="Home" size={20} className="text-primary" />
            <div>
              <div className="text-sm text-gray-600">Площадь</div>
              <div className="font-semibold">{property.area} м²</div>
            </div>
          </div>
        )}
        {property.rooms && (
          <div className="flex items-center gap-2">
            <Icon name="DoorOpen" size={20} className="text-primary" />
            <div>
              <div className="text-sm text-gray-600">Комнат</div>
              <div className="font-semibold">{property.rooms}</div>
            </div>
          </div>
        )}
        {property.floor && (
          <div className="flex items-center gap-2">
            <Icon name="Building" size={20} className="text-primary" />
            <div>
              <div className="text-sm text-gray-600">Этаж</div>
              <div className="font-semibold">{property.floor} из {property.total_floors}</div>
            </div>
          </div>
        )}
        {property.land_area && (
          <div className="flex items-center gap-2">
            <Icon name="TreePine" size={20} className="text-primary" />
            <div>
              <div className="text-sm text-gray-600">Участок</div>
              <div className="font-semibold">{property.land_area} сот.</div>
            </div>
          </div>
        )}
      </div>

      {/* Описание */}
      {property.description && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Описание</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
        </div>
      )}

      {/* Карта */}
      {property.latitude && property.longitude && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Местоположение</h3>
          <YandexMap
            latitude={property.latitude}
            longitude={property.longitude}
            title={property.title}
            address={property.location}
            className="border shadow-sm"
          />
        </div>
      )}

      {/* Видео Rutube */}
      {property.rutube_link && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Видео обзор</h3>
          <div className="rounded-lg overflow-hidden border bg-gray-100 aspect-video flex items-center justify-center">
            <a
              href={property.rutube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 hover:scale-105 transition-transform"
            >
              <Icon name="Video" size={48} className="text-primary" />
              <span className="text-lg font-semibold text-gray-700">Смотреть видео на Rutube</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
