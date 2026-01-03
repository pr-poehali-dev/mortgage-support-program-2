import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  floor?: number;
  total_floors?: number;
  land_area?: number;
  photo_url: string;
  photos?: string[];
  description?: string;
  features?: string[];
  property_link?: string;
  price_type?: string;
  phone?: string;
}

interface PropertyViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
}

export default function PropertyViewDialog({ open, onOpenChange, property }: PropertyViewDialogProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!property) return null;

  const photos = property.photos && property.photos.length > 0 ? property.photos : [property.photo_url];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const typeNames: Record<string, string> = {
    apartment: 'Квартира',
    house: 'Дом',
    land: 'Участок',
    commercial: 'Коммерция'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative h-[400px] bg-black group">
          <img 
            src={photos[currentPhotoIndex]} 
            alt={property.title}
            className="w-full h-full object-contain"
          />
          
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </>
          )}
          
          <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg">
            <p className="font-bold text-primary text-2xl">{property.price.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                {typeNames[property.type] || property.type}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3">{property.title}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Icon name="MapPin" size={18} />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
            {property.area && (
              <div className="text-center">
                <Icon name="Maximize" size={24} className="mx-auto text-primary mb-1" />
                <p className="text-sm text-gray-500">Площадь</p>
                <p className="font-semibold">{property.area} м²</p>
              </div>
            )}
            {property.rooms && (
              <div className="text-center">
                <Icon name="DoorOpen" size={24} className="mx-auto text-primary mb-1" />
                <p className="text-sm text-gray-500">Комнат</p>
                <p className="font-semibold">{property.rooms}</p>
              </div>
            )}
            {property.floor && (
              <div className="text-center">
                <Icon name="Layers" size={24} className="mx-auto text-primary mb-1" />
                <p className="text-sm text-gray-500">Этаж</p>
                <p className="font-semibold">{property.floor}/{property.total_floors}</p>
              </div>
            )}
            {property.land_area && (
              <div className="text-center">
                <Icon name="TreePine" size={24} className="mx-auto text-primary mb-1" />
                <p className="text-sm text-gray-500">Участок</p>
                <p className="font-semibold">{property.land_area} сот.</p>
              </div>
            )}
          </div>

          {property.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Описание</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.description}</p>
            </div>
          )}

          {property.phone && (
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Icon name="Phone" size={20} />
                Контакты для связи
              </h3>
              <a 
                href={`tel:${property.phone}`}
                className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
              >
                {property.phone}
                <Icon name="ExternalLink" size={20} />
              </a>
            </div>
          )}

          {property.property_link && (
            <div>
              <Button 
                onClick={() => window.open(property.property_link, '_blank')}
                className="w-full gap-2"
                size="lg"
              >
                <Icon name="ExternalLink" size={18} />
                Посмотреть объявление
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
