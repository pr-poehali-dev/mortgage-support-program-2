import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import PropertyFormDialog from '@/components/catalog/PropertyFormDialog';
import { compressImage } from '@/utils/imageCompressor';

const PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';

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
  photo_url?: string;
  photos?: string[];
  description?: string;
  property_link?: string;
  phone?: string;
  contact_name?: string;
  rutube_link?: string;
  operation?: string;
  property_category?: string;
  building_type?: string;
  renovation?: string;
  bathroom?: string;
  balcony?: string;
  furniture?: boolean;
  pets_allowed?: boolean;
  children_allowed?: boolean;
  utilities_included?: boolean;
  wall_material?: string;
  contact_method?: string;
}

export default function AdminProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', type: 'apartment', property_category: 'apartment',
    operation: 'sale', price: '', location: '', area: '', rooms: '',
    floor: '', total_floors: '', land_area: '', photo_url: '',
    photos: [] as string[], documents: [] as string[], description: '', property_link: '',
    phone: '', contact_name: '', rutube_link: '', building_type: '', renovation: '', bathroom: '',
    balcony: '', furniture: false, pets_allowed: false,
    children_allowed: true, utilities_included: false,
    wall_material: '', contact_method: 'phone'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(PROPERTIES_URL);
      const data = await response.json();
      
      if (data.success && data.properties) {
        setProperties(data.properties);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditProperty(null);
    setFormData({
      title: '', type: 'apartment', property_category: 'apartment',
      operation: 'sale', price: '', location: '', area: '', rooms: '',
      floor: '', total_floors: '', land_area: '', photo_url: '',
      photos: [], documents: [], description: '', property_link: '',
      phone: '', contact_name: '', rutube_link: '', building_type: '', renovation: '', bathroom: '',
      balcony: '', furniture: false, pets_allowed: false,
      children_allowed: true, utilities_included: false,
      wall_material: '', contact_method: 'phone'
    });
    setPropertyDialogOpen(true);
  };

  const openEditDialog = (property: Property) => {
    setEditProperty(property);
    setFormData({
      title: property.title || '',
      type: property.type || 'apartment',
      property_category: property.property_category || property.type || 'apartment',
      operation: property.operation || 'sale',
      price: property.price?.toString() || '',
      location: property.location || '',
      area: property.area?.toString() || '',
      rooms: property.rooms?.toString() || '',
      floor: property.floor?.toString() || '',
      total_floors: property.total_floors?.toString() || '',
      land_area: property.land_area?.toString() || '',
      photo_url: property.photo_url || '',
      photos: property.photos || [],
      description: property.description || '',
      property_link: property.property_link || '',
      phone: property.phone || '',
      contact_name: property.contact_name || '',
      rutube_link: property.rutube_link || '',
      building_type: property.building_type || '',
      renovation: property.renovation || '',
      bathroom: property.bathroom || '',
      balcony: property.balcony || '',
      furniture: property.furniture || false,
      pets_allowed: property.pets_allowed || false,
      children_allowed: property.children_allowed !== false,
      utilities_included: property.utilities_included || false,
      wall_material: property.wall_material || '',
      contact_method: property.contact_method || 'phone'
    });
    setPropertyDialogOpen(true);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_PHOTOS = 50;
    const currentPhotosCount = formData.photos.length;
    const remainingSlots = MAX_PHOTOS - currentPhotosCount;

    if (remainingSlots <= 0) {
      alert(`Максимум ${MAX_PHOTOS} фотографий. Удалите лишние фото перед добавлением новых.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`Можно добавить только ${remainingSlots} фото. Первые ${remainingSlots} будут загружены.`);
    }

    setUploadingPhoto(true);
    const uploadedUrls: string[] = [];
    let errors = 0;

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        
        // Проверка типа файла
        if (!file.type.startsWith('image/')) {
          console.error(`Файл ${file.name} не является изображением`);
          errors++;
          continue;
        }

        // Сжимаем изображение до 9 МБ
        let compressedFile: File;
        try {
          compressedFile = await compressImage(file, 9);
        } catch (compressError) {
          console.error(`Ошибка сжатия ${file.name}:`, compressError);
          errors++;
          continue;
        }

        const reader = new FileReader();
        
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Ошибка чтения файла'));
          reader.readAsDataURL(compressedFile);
        });

        const response = await fetch('https://functions.poehali.dev/94c626eb-409a-4a18-836f-f3750239d1b4', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo_data: base64 })
        });

        const data = await response.json();
        if (data.success && data.photo_url) {
          uploadedUrls.push(data.photo_url);
        } else {
          errors++;
        }
      }

      if (uploadedUrls.length > 0) {
        const allPhotos = [...formData.photos, ...uploadedUrls];
        setFormData({
          ...formData,
          photos: allPhotos,
          photo_url: allPhotos[0] || ''
        });
      }

      if (errors > 0) {
        alert(`Загружено ${uploadedUrls.length} фото. Ошибок: ${errors}`);
      } else if (uploadedUrls.length > 0) {
        alert(`Успешно загружено ${uploadedUrls.length} фото!`);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      alert('Ошибка загрузки фото: ' + (err as Error).message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Ошибка чтения файла'));
          reader.readAsDataURL(file);
        });
        
        const response = await fetch('https://functions.poehali.dev/be14ce68-1655-468e-be45-ca3e59d65813', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) throw new Error('Ошибка загрузки документа');

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...uploadedUrls],
      }));

      alert(`Загружено ${uploadedUrls.length} документов`);
    } catch (error) {
      alert('Не удалось загрузить документы');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemoveDocument = (url: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc !== url),
    }));
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload: any = {
        title: formData.title,
        type: formData.type,
        property_category: formData.property_category,
        operation: formData.operation,
        price: formData.price,
        location: formData.location,
        area: formData.area,
        rooms: formData.rooms,
        floor: formData.floor,
        total_floors: formData.total_floors,
        land_area: formData.land_area,
        photo_url: formData.photo_url,
        photos: formData.photos,
        description: formData.description,
        property_link: formData.property_link,
        phone: formData.phone,
        contact_name: formData.contact_name,
        rutube_link: formData.rutube_link,
        building_type: formData.building_type,
        renovation: formData.renovation,
        bathroom: formData.bathroom,
        balcony: formData.balcony,
        furniture: formData.furniture,
        pets_allowed: formData.pets_allowed,
        children_allowed: formData.children_allowed,
        utilities_included: formData.utilities_included,
        wall_material: formData.wall_material,
        contact_method: formData.contact_method
      };

      const method = editProperty ? 'PUT' : 'POST';
      if (editProperty) {
        payload.id = editProperty.id;
      }

      const response = await fetch(PROPERTIES_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editProperty ? 'Объект обновлен!' : 'Объект успешно добавлен!');
        setPropertyDialogOpen(false);
        setFormData({
          title: '', type: 'apartment', property_category: 'apartment',
          operation: 'sale', price: '', location: '', area: '', rooms: '',
          floor: '', total_floors: '', land_area: '', photo_url: '',
          photos: [], description: '', property_link: '',
          phone: '', contact_name: '', rutube_link: '', building_type: '', renovation: '', bathroom: '',
          balcony: '', furniture: false, pets_allowed: false,
          children_allowed: true, utilities_included: false,
          wall_material: '', contact_method: 'phone'
        });
        setEditProperty(null);
        fetchProperties();
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Ошибка при сохранении объекта');
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

  const handleDeleteAll = async () => {
    if (!confirm(`Вы уверены, что хотите удалить ВСЕ объекты (${properties.length} шт.)?`)) return;
    if (!confirm('Это действие нельзя отменить! Удалить все объекты?')) return;

    try {
      const response = await fetch(`${PROPERTIES_URL}?all=true`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Все объекты успешно удалены!');
        fetchProperties();
      } else {
        alert('Ошибка удаления: ' + data.error);
      }
    } catch (err) {
      console.error('Delete all error:', err);
      alert('Ошибка удаления');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Управление объектами
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Все объекты недвижимости на сайте</p>
          </div>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="gap-1.5 sm:gap-2 w-full sm:w-auto"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between">
          <Button
            onClick={openCreateDialog}
            className="gap-2 w-full sm:w-auto"
            size="lg"
          >
            <Icon name="Plus" size={18} />
            Добавить объект
          </Button>
          {properties.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              variant="destructive"
              className="gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Icon name="Trash2" size={18} />
              <span className="hidden sm:inline">Удалить все ({properties.length})</span>
              <span className="sm:hidden">Удалить все ({properties.length})</span>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <Icon name="Loader2" size={48} className="sm:w-16 sm:h-16 mx-auto animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12 p-4 sm:p-6">
              <Icon name="Building2" size={48} className="sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600">Нет добавленных объектов</p>
              <Button onClick={openCreateDialog} className="mt-3 sm:mt-4 gap-2 w-full sm:w-auto">
                <Icon name="Plus" size={16} />
                Добавить первый объект
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={property.photos?.[0] || property.photo_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <p className="font-bold text-primary text-sm sm:text-base">{property.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  {property.operation && (
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                      {property.operation === 'sale' ? 'Продажа' : property.operation === 'rent' ? 'Аренда' : 'Посуточно'}
                    </div>
                  )}
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
                    {property.land_area && (
                      <div className="flex items-center gap-1">
                        <Icon name="TreePine" size={14} />
                        <span>{property.land_area} сот.</span>
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
                      onClick={() => handleDelete(property.id)}
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
      </div>

      <PropertyFormDialog
        dialogOpen={propertyDialogOpen}
        setDialogOpen={setPropertyDialogOpen}
        editProperty={editProperty}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handlePropertySubmit}
        handlePhotoSelect={handlePhotoSelect}
        uploadingPhoto={uploadingPhoto}
        photoPreview={formData.photos[0] || ''}
        handleDocumentSelect={handleDocumentSelect}
        handleRemoveDocument={handleRemoveDocument}
      />
    </div>
  );
}