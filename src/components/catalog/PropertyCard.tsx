import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface Property {
  id: number;
  slug?: string;
  title: string;
  type: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  land_area?: number;
  photo_url: string;
  photos?: string[];
  description?: string;
  features?: string[];
  property_link?: string;
  price_type?: string;
}

interface PropertyCardProps {
  property: Property;
  onView?: () => void;
  isAdmin?: boolean;
}

const PropertyCard = ({ property, onView, isAdmin = false }: PropertyCardProps) => {
  const photos = property.photos && property.photos.length > 0 ? property.photos : [property.photo_url];
  const urlParam = property.slug || property.id;
  const propertyUrl = `/property/${urlParam}`;

  if (onView) {
    return (
      <div 
        onClick={onView}
        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
      >
        <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
          <img 
            src={photos[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            <p className="font-bold text-primary text-sm sm:text-base lg:text-lg">{property.price.toLocaleString('ru-RU')} ₽</p>
          </div>
          {photos.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Icon name="Image" size={12} />
              <span>{photos.length}</span>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{property.title}</h3>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            <Icon name="MapPin" size={14} />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
            {property.area && (
              <div className="flex items-center gap-1.5">
                <Icon name="Maximize" size={14} className="text-gray-400" />
                <span>{property.area} м²</span>
              </div>
            )}
            {property.rooms && (
              <div className="flex items-center gap-1.5">
                <Icon name="DoorOpen" size={14} className="text-gray-400" />
                <span>{property.rooms} комн.</span>
              </div>
            )}
            {property.floor && (
              <div className="flex items-center gap-1.5">
                <Icon name="Layers" size={14} className="text-gray-400" />
                <span>{property.floor}/{property.total_floors} эт.</span>
              </div>
            )}
            {property.land_area && (
              <div className="flex items-center gap-1.5">
                <Icon name="TreePine" size={14} className="text-gray-400" />
                <span>{property.land_area} сот.</span>
              </div>
            )}
          </div>
          {property.description && (
            <p className="text-sm text-gray-600 line-clamp-3">{property.description}</p>
          )}
        </div>
      </div>
    );
  }

  console.log('PropertyCard render:', { id: property.id, slug: property.slug, propertyUrl });

  return (
    <Link 
      to={propertyUrl}
      onClick={(e) => {
        console.log('=== CLICK EVENT ===', propertyUrl);
        e.stopPropagation();
      }}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
        <img 
          src={photos[0]} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
          <p className="font-bold text-primary text-sm sm:text-base lg:text-lg">{property.price.toLocaleString('ru-RU')} ₽</p>
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Icon name="Image" size={12} />
            <span>{photos.length}</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 text-gray-900">{property.title}</h3>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          <Icon name="MapPin" size={14} />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
          {property.area && (
            <div className="flex items-center gap-1.5">
              <Icon name="Maximize" size={14} className="text-gray-400" />
              <span>{property.area} м²</span>
            </div>
          )}
          {property.rooms && (
            <div className="flex items-center gap-1.5">
              <Icon name="DoorOpen" size={14} className="text-gray-400" />
              <span>{property.rooms} комн.</span>
            </div>
          )}
          {property.floor && (
            <div className="flex items-center gap-1.5">
              <Icon name="Layers" size={14} className="text-gray-400" />
              <span>{property.floor}/{property.total_floors} эт.</span>
            </div>
          )}
          {property.land_area && (
            <div className="flex items-center gap-1.5">
              <Icon name="TreePine" size={14} className="text-gray-400" />
              <span>{property.land_area} сот.</span>
            </div>
          )}
        </div>
        {property.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{property.description}</p>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;