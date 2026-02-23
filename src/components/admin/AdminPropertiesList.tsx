import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Property } from '@/types/Property';

interface AdminPropertiesListProps {
  properties: Property[];
  loading: boolean;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number, archive: boolean) => void;
}

export default function AdminPropertiesList({
  properties,
  loading,
  onEdit,
  onDelete,
  onArchive,
}: AdminPropertiesListProps) {
  const [filter, setFilter] = useState<'active' | 'archived'>('active');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  const activeCount = properties.filter(p => p.is_active !== false).length;
  const archivedCount = properties.filter(p => p.is_active === false).length;

  const filtered = properties.filter(p =>
    filter === 'active' ? p.is_active !== false : p.is_active === false
  );

  return (
    <div className="space-y-4">
      {/* Переключатель фильтра */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            filter === 'active'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
          }`}
        >
          <Icon name="Eye" size={15} />
          Опубликованные
          <Badge className={`text-xs ml-0.5 ${filter === 'active' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
            {activeCount}
          </Badge>
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            filter === 'archived'
              ? 'bg-gray-700 text-white border-gray-700 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          }`}
        >
          <Icon name="Archive" size={15} />
          Архив
          <Badge className={`text-xs ml-0.5 ${filter === 'archived' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {archivedCount}
          </Badge>
        </button>
      </div>

      {/* Список объектов */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <Icon
            name={filter === 'active' ? 'Home' : 'Archive'}
            size={64}
            className="mx-auto text-gray-300 mb-4"
          />
          <p className="text-gray-500 text-lg font-medium">
            {filter === 'active' ? 'Нет опубликованных объектов' : 'Архив пуст'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === 'active'
              ? 'Добавьте первый объект кнопкой выше'
              : 'Архивированные объекты появятся здесь'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((property) => (
            <Card
              key={property.id}
              className={`overflow-hidden transition-all hover:shadow-md ${
                property.is_active === false ? 'opacity-70 grayscale-[30%]' : ''
              }`}
            >
              <CardHeader className="p-0 relative">
                {property.photo_url ? (
                  <img
                    src={property.photo_url}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Icon name="Home" size={48} className="text-gray-300" />
                  </div>
                )}
                {property.is_active === false && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-gray-700/90 text-white text-xs flex items-center gap-1">
                      <Icon name="Archive" size={11} />
                      В архиве
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-base mb-2 line-clamp-2">{property.title}</CardTitle>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={14} className="flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Banknote" size={14} className="flex-shrink-0" />
                    {property.price.toLocaleString('ru-RU')} ₽
                  </div>
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <Icon name="Maximize" size={14} className="flex-shrink-0" />
                      {property.area} м²
                    </div>
                  )}
                  {property.rooms && (
                    <div className="flex items-center gap-2">
                      <Icon name="DoorOpen" size={14} className="flex-shrink-0" />
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
                    <Icon name="Edit" size={14} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onArchive(property.id, property.is_active !== false)}
                    title={property.is_active !== false ? 'В архив' : 'Опубликовать'}
                    className={
                      property.is_active !== false
                        ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300'
                    }
                  >
                    <Icon
                      name={property.is_active !== false ? 'Archive' : 'ArchiveRestore'}
                      size={14}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(property.id)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
