import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  description?: string;
  features?: string[];
  property_link?: string;
  price_type?: string;
}

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
}

export default function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.photo_url} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="font-bold text-primary text-lg">{property.price.toLocaleString('ru-RU')} ₽</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{property.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icon name="MapPin" size={14} />
          <span>{property.location}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm">
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

        <div className="flex gap-2 pt-2">
          <Button onClick={() => onEdit(property)} variant="outline" size="sm" className="flex-1 gap-2">
            <Icon name="Edit" size={14} />
            Редактировать
          </Button>
          <Button onClick={() => onDelete(property.id)} variant="destructive" size="sm" className="gap-2">
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
