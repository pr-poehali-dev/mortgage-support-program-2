import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MANUAL_PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';

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

export default function CatalogTab() {
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [realEstateObjects, setRealEstateObjects] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    price: '',
    location: '',
    area: '',
    rooms: '',
    floor: '',
    total_floors: '',
    land_area: '',
    photo_url: '',
    description: '',
    property_link: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(MANUAL_PROPERTIES_URL);
      const data = await response.json();
      
      if (data.success) {
        setRealEstateObjects(data.properties || []);
      }
    } catch (err) {
      setError('Ошибка загрузки объектов');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCatalogCounts = () => {
    return {
      all: realEstateObjects.length,
      apartment: realEstateObjects.filter(obj => obj.type === 'apartment').length,
      house: realEstateObjects.filter(obj => obj.type === 'house').length,
      land: realEstateObjects.filter(obj => obj.type === 'land').length,
      commercial: realEstateObjects.filter(obj => obj.type === 'commercial').length
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...(editProperty ? { id: editProperty.id } : {}),
        title: formData.title,
        type: formData.type,
        price: parseInt(formData.price),
        location: formData.location,
        area: formData.area ? parseFloat(formData.area) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        land_area: formData.land_area ? parseFloat(formData.land_area) : null,
        photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        description: formData.description,
        property_link: formData.property_link,
        price_type: 'total'
      };

      const response = await fetch(MANUAL_PROPERTIES_URL, {
        method: editProperty ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setDialogOpen(false);
        resetForm();
        fetchProperties();
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Ошибка сохранения объекта');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить объект?')) return;

    try {
      const response = await fetch(`${MANUAL_PROPERTIES_URL}?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchProperties();
      } else {
        alert('Ошибка удаления: ' + data.error);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Ошибка удаления объекта');
    }
  };

  const openCreateDialog = () => {
    setEditProperty(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (property: Property) => {
    setEditProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      price: property.price.toString(),
      location: property.location,
      area: property.area?.toString() || '',
      rooms: property.rooms?.toString() || '',
      floor: property.floor?.toString() || '',
      total_floors: property.total_floors?.toString() || '',
      land_area: property.land_area?.toString() || '',
      photo_url: property.photo_url,
      description: property.description || '',
      property_link: property.property_link || ''
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'apartment',
      price: '',
      location: '',
      area: '',
      rooms: '',
      floor: '',
      total_floors: '',
      land_area: '',
      photo_url: '',
      description: '',
      property_link: ''
    });
    setEditProperty(null);
  };

  const catalogCounts = getCatalogCounts();

  return (
    <TabsContent value="catalog" className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Объекты</h2>
            {!loading && !error && (
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Найдено объектов: {realEstateObjects.length}
              </p>
            )}
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Icon name="Plus" size={18} />
            <span className="hidden sm:inline">Добавить объект</span>
          </Button>
        </div>

        {!loading && !error && realEstateObjects.length > 0 && (
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
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="mb-4 animate-spin">
            <Icon name="Loader2" size={64} className="mx-auto text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Загружаю объявления...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Icon name="AlertCircle" size={64} className="mx-auto text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={fetchProperties} variant="outline" className="gap-2">
            <Icon name="RefreshCw" size={18} />
            Попробовать снова
          </Button>
        </div>
      ) : realEstateObjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Icon name="Building2" size={64} className="mx-auto text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет объектов</h3>
          <p className="text-gray-500 mb-6">Добавьте первый объект недвижимости</p>
          <Button onClick={openCreateDialog} className="gap-2">
            <Icon name="Plus" size={18} />
            Добавить объект
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {realEstateObjects
            .filter(obj => catalogFilter === 'all' || obj.type === catalogFilter)
            .map((obj) => (
            <Card key={obj.id} className="hover:shadow-xl transition-all overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={obj.photo_url} 
                  alt={obj.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <p className="font-bold text-primary text-lg">{obj.price.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{obj.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="MapPin" size={14} />
                  <span>{obj.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3 text-sm">
                  {obj.area && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="Maximize" size={14} className="text-gray-400" />
                      <span>{obj.area} м²</span>
                    </div>
                  )}
                  {obj.rooms && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="DoorOpen" size={14} className="text-gray-400" />
                      <span>{obj.rooms} комн.</span>
                    </div>
                  )}
                  {obj.floor && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="Layers" size={14} className="text-gray-400" />
                      <span>{obj.floor}/{obj.total_floors} эт.</span>
                    </div>
                  )}
                  {obj.land_area && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="TreePine" size={14} className="text-gray-400" />
                      <span>{obj.land_area} сот.</span>
                    </div>
                  )}
                </div>

                {obj.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{obj.description}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => openEditDialog(obj)} variant="outline" size="sm" className="flex-1 gap-2">
                    <Icon name="Edit" size={14} />
                    Редактировать
                  </Button>
                  <Button onClick={() => handleDelete(obj.id)} variant="destructive" size="sm" className="gap-2">
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProperty ? 'Редактировать объект' : 'Добавить объект'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Например: 2-комн. квартира, 65 м²"
                />
              </div>

              <div>
                <Label htmlFor="type">Тип *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                    <SelectItem value="land">Участок</SelectItem>
                    <SelectItem value="commercial">Коммерция</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Цена, ₽ *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  placeholder="5000000"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="location">Адрес *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  placeholder="Севастополь, ул. Ленина, 1"
                />
              </div>

              <div>
                <Label htmlFor="area">Площадь, м²</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="65"
                />
              </div>

              <div>
                <Label htmlFor="rooms">Комнат</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                  placeholder="2"
                />
              </div>

              <div>
                <Label htmlFor="floor">Этаж</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  placeholder="5"
                />
              </div>

              <div>
                <Label htmlFor="total_floors">Всего этажей</Label>
                <Input
                  id="total_floors"
                  type="number"
                  value={formData.total_floors}
                  onChange={(e) => setFormData({...formData, total_floors: e.target.value})}
                  placeholder="10"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="land_area">Площадь участка, сот.</Label>
                <Input
                  id="land_area"
                  type="number"
                  step="0.01"
                  value={formData.land_area}
                  onChange={(e) => setFormData({...formData, land_area: e.target.value})}
                  placeholder="6"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="photo_url">URL фотографии</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Подробное описание объекта..."
                  rows={4}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="property_link">Ссылка на объявление</Label>
                <Input
                  id="property_link"
                  value={formData.property_link}
                  onChange={(e) => setFormData({...formData, property_link: e.target.value})}
                  placeholder="https://avito.ru/..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editProperty ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
