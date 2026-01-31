import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function PropertyCard({ property, onView, isAdmin = false }: PropertyCardProps) {
  const navigate = useNavigate();
  const photos = property.photos && property.photos.length > 0 ? property.photos : [property.photo_url];
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleClick = () => {
    if (onView) {
      onView();
    } else {
      const urlParam = property.slug || property.id;
      navigate(`/property/${urlParam}`);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all overflow-hidden cursor-pointer" onClick={handleClick}>
      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden group">
        <img 
          src={photos[currentPhotoIndex]} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
            >
              <Icon name="ChevronLeft" size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
            >
              <Icon name="ChevronRight" size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        )}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
          <p className="font-bold text-primary text-sm sm:text-base lg:text-lg">{property.price.toLocaleString('ru-RU')} ₽</p>
        </div>
      </div>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg lg:text-xl">{property.title}</CardTitle>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
          <Icon name="MapPin" size={14} />
          <span className="line-clamp-1">{property.location}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
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
      </CardContent>
    </Card>
  );
}