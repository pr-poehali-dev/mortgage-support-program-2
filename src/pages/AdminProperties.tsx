import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import AdminPhotosTab from '@/components/tabs/AdminPhotosTab';

const PROPERTIES_URL = 'https://functions.poehali.dev/d286a6ac-5f97-4343-9332-1ee6a1e9ad53';
const AVITO_LISTINGS_URL = 'https://functions.poehali.dev/0363e1df-5e38-47b1-83ba-6d01b09d4e99';

interface Property {
  id?: number;
  avitoId?: number;
  title: string;
  type: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  landArea?: number;
  image?: string;
  description: string;
  features: string[];
  propertyLink?: string;
  priceType: string;
  isActive?: boolean;
}

export default function AdminProperties() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'manual' | 'avito'>('manual');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState<Property>({
    title: '',
    type: 'apartment',
    price: 0,
    location: '',
    description: '',
    features: [],
    priceType: 'total'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(PROPERTIES_URL);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateDialog = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      type: 'apartment',
      price: 0,
      location: '',
      description: '',
      features: [],
      priceType: 'total'
    });
    setImageFile(null);
    setImagePreview('');
    setDialogOpen(true);
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setImagePreview(property.image || '');
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: any = { ...formData };
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          payload.image_data = reader.result as string;
          await submitProperty(payload);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await submitProperty(payload);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Ошибка сохранения');
    }
  };

  const submitProperty = async (payload: any) => {
    const method = editingProperty ? 'PUT' : 'POST';
    
    if (editingProperty) {
      payload.id = editingProperty.id;
    }

    const response = await fetch(PROPERTIES_URL, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      alert(editingProperty ? 'Объект обновлен!' : 'Объект создан!');
      setDialogOpen(false);
      fetchProperties();
    } else {
      alert('Ошибка: ' + data.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот объект?')) return;

    try {
      const response = await fetch(`${PROPERTIES_URL}?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Объект удален!');
        fetchProperties();
      } else {
        alert('Ошибка удаления: ' + data.error);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Ошибка удаления');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Управление объектами
            </h1>
            <p className="text-gray-600 mt-1">Недвижимость на сайте и Avito</p>
          </div>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Button>
        </div>

        <div className="flex gap-3 border-b pb-4">
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual')}
            className="gap-2"
          >
            <Icon name="Home" size={16} />
            Мои объекты ({properties.length})
          </Button>
          <Button
            variant={activeTab === 'avito' ? 'default' : 'outline'}
            onClick={() => setActiveTab('avito')}
            className="gap-2"
          >
            <Icon name="ImagePlus" size={16} />
            Фото для Avito
          </Button>
        </div>

        {activeTab === 'manual' ? (
          <>
            <Button
              onClick={openCreateDialog}
              className="gap-2"
              size="lg"
            >
              <Icon name="Plus" size={18} />
              Добавить объект
            </Button>

            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" size={64} className="mx-auto animate-spin text-primary" />
              </div>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Icon name="Building2" size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Нет добавленных объектов</p>
                  <Button onClick={openCreateDialog} className="mt-4 gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить первый объект
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <p className="font-bold text-primary">{property.price.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="MapPin" size={14} />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-sm">
                        {property.area && (
                          <div className="flex items-center gap-1">
                            <Icon name="Home" size={14} />
                            <span>{property.area} м²</span>
                          </div>
                        )}
                        {property.rooms && (
                          <div className="flex items-center gap-1">
                            <Icon name="DoorOpen" size={14} />
                            <span>{property.rooms} комн.</span>
                          </div>
                        )}
                        {property.landArea && (
                          <div className="flex items-center gap-1">
                            <Icon name="TreePine" size={14} />
                            <span>{property.landArea} сот.</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(property)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                        >
                          <Icon name="Edit" size={14} />
                          Изменить
                        </Button>
                        <Button
                          onClick={() => handleDelete(property.id!)}
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                        >
                          <Icon name="Trash2" size={14} />
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <AdminPhotosTab />
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProperty ? 'Редактирование объекта' : 'Новый объект'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Квартира 2 комнаты..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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

                <div className="space-y-2">
                  <Label htmlFor="price">Цена (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Адрес</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Севастополь, ул. Ленина 10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Площадь (м²)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) || undefined })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Комнат</Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={formData.rooms || ''}
                    onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Фотография</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Подробное описание объекта..."
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1 gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить
                </Button>
                <Button onClick={() => setDialogOpen(false)} variant="outline">
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
