import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Property } from '@/types/Property';

interface AdminPropertiesListProps {
  properties: Property[];
  loading: boolean;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
}

export default function AdminPropertiesList({ 
  properties, 
  loading, 
  onEdit, 
  onDelete 
}: AdminPropertiesListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Home" size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">Объектов пока нет</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <CardHeader className="p-0">
            {property.photo_url ? (
              <img
                src={property.photo_url}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <Icon name="Home" size={48} className="text-gray-400" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{property.title}</CardTitle>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                {property.location}
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Banknote" size={16} />
                {property.price.toLocaleString('ru-RU')} ₽
              </div>
              {property.area && (
                <div className="flex items-center gap-2">
                  <Icon name="Maximize" size={16} />
                  {property.area} м²
                </div>
              )}
              {property.rooms && (
                <div className="flex items-center gap-2">
                  <Icon name="DoorOpen" size={16} />
                  {property.rooms} комн.
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(property)}
                className="flex-1"
              >
                <Icon name="Edit" size={16} className="mr-1" />
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(property.id)}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
