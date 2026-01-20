import { useState, useEffect } from 'react';
import { Property, PropertyFormData, PROPERTIES_URL } from '@/types/Property';
import { compressImage } from '@/utils/imageCompressor';
import { notifyPropertyPage, notifyAllMainPages } from '@/services/indexnow';

const initialFormData: PropertyFormData = {
  title: '', type: 'apartment', property_category: 'apartment',
  operation: 'sale', price: '', location: '', area: '', rooms: '',
  floor: '', total_floors: '', land_area: '', photo_url: '',
  photos: [], documents: [], description: '', property_link: '',
  phone: '', contact_name: '', rutube_link: '', building_type: '', renovation: '', bathroom: '',
  balcony: '', furniture: false, pets_allowed: false,
  children_allowed: true, utilities_included: false,
  wall_material: '', contact_method: 'phone'
};

export function usePropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);

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
    setFormData(initialFormData);
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
      documents: property.documents || [],
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
        
        if (!file.type.startsWith('image/')) {
          console.error(`Файл ${file.name} не является изображением`);
          errors++;
          continue;
        }

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
        documents: formData.documents,
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
        contact_method: formData.contact_method,
      };

      if (editProperty) {
        payload.id = editProperty.id;
      }

      const response = await fetch(PROPERTIES_URL, {
        method: editProperty ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        alert(editProperty ? 'Объект успешно обновлен!' : 'Объект успешно добавлен!');
        setPropertyDialogOpen(false);
        fetchProperties();
        
        if (result.property?.id) {
          notifyPropertyPage(result.property.id).catch(err => 
            console.warn('IndexNow notification failed:', err)
          );
          notifyAllMainPages().catch(err => 
            console.warn('IndexNow main pages notification failed:', err)
          );
        }
      } else {
        alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Ошибка при сохранении: ' + (err as Error).message);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект?')) {
      return;
    }

    try {
      const response = await fetch(PROPERTIES_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (result.success) {
        alert('Объект успешно удален!');
        fetchProperties();
        
        notifyAllMainPages().catch(err => 
          console.warn('IndexNow notification failed:', err)
        );
      } else {
        alert('Ошибка удаления: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Ошибка при удалении: ' + (err as Error).message);
    }
  };

  return {
    properties,
    loading,
    propertyDialogOpen,
    setPropertyDialogOpen,
    uploadingPhoto,
    editProperty,
    formData,
    setFormData,
    openCreateDialog,
    openEditDialog,
    handlePhotoSelect,
    handleDocumentSelect,
    handleRemoveDocument,
    handlePropertySubmit,
    handleDeleteProperty,
  };
}