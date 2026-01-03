import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import PropertyCard from '@/components/catalog/PropertyCard';
import PropertyFormDialog from '@/components/catalog/PropertyFormDialog';
import PropertyViewDialog from '@/components/catalog/PropertyViewDialog';
import CatalogSortControls from '@/components/catalog/CatalogSortControls';

const MANUAL_PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';
const UPLOAD_PHOTO_URL = 'https://functions.poehali.dev/94c626eb-409a-4a18-836f-f3750239d1b4';

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
  created_at?: string;
  phone?: string;
}

export default function CatalogTab() {
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [catalogSort, setCatalogSort] = useState<'default' | 'price-asc' | 'price-desc' | 'date-new' | 'date-old'>('default');
  const [realEstateObjects, setRealEstateObjects] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    property_category: 'apartment',
    operation: 'sale',
    price: '',
    location: '',
    area: '',
    rooms: '',
    floor: '',
    total_floors: '',
    land_area: '',
    photo_url: '',
    photos: [] as string[],
    description: '',
    property_link: '',
    phone: '',
    building_type: '',
    renovation: '',
    bathroom: '',
    balcony: '',
    furniture: false,
    pets_allowed: false,
    children_allowed: true,
    utilities_included: false,
    wall_material: '',
    contact_method: 'phone'
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

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          
          try {
            const response = await fetch(UPLOAD_PHOTO_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_data: base64 })
            });

            const data = await response.json();
            if (data.success) {
              newPhotos.push(data.url);
            } else {
              alert('Ошибка загрузки: ' + data.error);
            }
          } catch (err) {
            console.error('Upload error:', err);
            alert('Ошибка загрузки фото');
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    const allPhotos = [...uploadedPhotos, ...newPhotos];
    setUploadedPhotos(allPhotos);
    setFormData({ ...formData, photos: allPhotos, photo_url: allPhotos[0] || '' });
    setUploadingPhoto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const photos = formData.photos.length > 0 ? formData.photos : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];
      
      const payload = {
        ...(editProperty ? { id: editProperty.id } : {}),
        title: formData.title,
        type: formData.property_category,
        property_category: formData.property_category,
        operation: formData.operation,
        price: parseInt(formData.price),
        location: formData.location,
        area: formData.area ? parseFloat(formData.area) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        land_area: formData.land_area ? parseFloat(formData.land_area) : null,
        photo_url: photos[0],
        photos: photos,
        description: formData.description,
        property_link: formData.property_link,
        phone: formData.phone,
        price_type: 'total',
        building_type: formData.building_type || null,
        renovation: formData.renovation || null,
        bathroom: formData.bathroom || null,
        balcony: formData.balcony || null,
        furniture: formData.furniture,
        pets_allowed: formData.pets_allowed,
        children_allowed: formData.children_allowed,
        utilities_included: formData.utilities_included,
        wall_material: formData.wall_material || null,
        contact_method: formData.contact_method
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
    setPhotoPreview('');
    setUploadedPhotos([]);
    setDialogOpen(true);
  };

  const openEditDialog = (property: Property) => {
    setEditProperty(property);
    const photos = property.photos || [property.photo_url];
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
      photos: photos,
      description: property.description || '',
      property_link: property.property_link || '',
      phone: property.phone || ''
    });
    setUploadedPhotos(photos);
    setPhotoPreview(property.photo_url);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'apartment',
      property_category: 'apartment',
      operation: 'sale',
      price: '',
      location: '',
      area: '',
      rooms: '',
      floor: '',
      total_floors: '',
      land_area: '',
      photo_url: '',
      photos: [],
      description: '',
      property_link: '',
      phone: '',
      building_type: '',
      renovation: '',
      bathroom: '',
      balcony: '',
      furniture: false,
      pets_allowed: false,
      children_allowed: true,
      utilities_included: false,
      wall_material: '',
      contact_method: 'phone'
    });
    setUploadedPhotos([]);
    setEditProperty(null);
  };

  const handleRemovePhoto = (photoUrl: string) => {
    const newPhotos = uploadedPhotos.filter(p => p !== photoUrl);
    setUploadedPhotos(newPhotos);
    setFormData({ ...formData, photos: newPhotos, photo_url: newPhotos[0] || '' });
  };



  const catalogCounts = getCatalogCounts();

  return (
    <TabsContent value="catalog" className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Объекты</h2>
          {!loading && !error && (
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Найдено объектов: {realEstateObjects.length}
            </p>
          )}
        </div>

        {!loading && !error && realEstateObjects.length > 0 && (
          <CatalogSortControls
            catalogFilter={catalogFilter}
            setCatalogFilter={setCatalogFilter}
            catalogSort={catalogSort}
            setCatalogSort={setCatalogSort}
            catalogCounts={catalogCounts}
          />
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
          <Button onClick={fetchProperties}>
            <Icon name="RefreshCw" size={18} className="mr-2" />
            Попробовать снова
          </Button>
        </div>
      ) : realEstateObjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Icon name="Home" size={64} className="mx-auto text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Пока нет объектов</h3>
          <p className="text-gray-500 mb-6">Добавьте первый объект недвижимости</p>
          <Button onClick={openCreateDialog}>
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить объект
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {realEstateObjects
            .filter(obj => catalogFilter === 'all' || obj.type === catalogFilter)
            .sort((a, b) => {
              if (catalogSort === 'price-asc') return a.price - b.price;
              if (catalogSort === 'price-desc') return b.price - a.price;
              if (catalogSort === 'date-new') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
              if (catalogSort === 'date-old') return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
              return 0;
            })
            .map((obj) => (
              <PropertyCard
                key={obj.id}
                property={obj}
                onView={() => {
                  setViewProperty(obj);
                  setViewDialogOpen(true);
                }}
              />
            ))}
        </div>
      )}

      <PropertyFormDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editProperty={editProperty}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handlePhotoSelect={handlePhotoSelect}
        uploadingPhoto={uploadingPhoto}
        photoPreview={photoPreview}
      />

      <PropertyViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        property={viewProperty}
      />
    </TabsContent>
  );
}