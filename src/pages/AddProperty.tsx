import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import { useToast } from '@/hooks/use-toast';
import PropertyFormDialog from '@/components/catalog/PropertyFormDialog';
import { compressImage, fileToBase64 } from '@/utils/imageCompressor';
import { notifyAllMainPages } from '@/services/indexnow';

export default function AddProperty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
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
    documents: [] as string[],
    description: '',
    features: [] as string[],
    property_link: '',
    price_type: 'total',
    phone: '',
    contact_name: '',
    building_type: '',
    renovation: '',
    bathroom: '',
    balcony: '',
    furniture: false,
    pets_allowed: false,
    children_allowed: true,
    utilities_included: false,
    wall_material: '',
    contact_method: 'phone',
    rutube_link: '',
    is_active: false,
  });

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const compressedFile = await compressImage(file, 1, 1920);
        const base64 = await fileToBase64(compressedFile);
        
        const response = await fetch('https://functions.poehali.dev/be14ce68-1655-468e-be45-ca3e59d65813', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) throw new Error('Ошибка загрузки фото');

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls],
        photo_url: prev.photo_url || uploadedUrls[0],
      }));

      toast({
        title: 'Фото загружены',
        description: `Загружено ${uploadedUrls.length} фото`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const base64 = await fileToBase64(file);
        
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

      toast({
        title: 'Документы загружены',
        description: `Загружено ${uploadedUrls.length} документов`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить документы',
        variant: 'destructive',
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms || !agreedToPrivacy) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо согласиться с правилами и политикой конфиденциальности',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Ошибка при добавлении объявления');

      toast({
        title: 'Успешно!',
        description: 'Объявление отправлено на модерацию',
      });

      notifyAllMainPages().catch(err => 
        console.warn('IndexNow notification failed:', err)
      );

      navigate('/');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить объявление',
        variant: 'destructive',
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      navigate('/');
    }
    setDialogOpen(open);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              Назад
            </Button>
            <h1 className="text-xl font-bold">Добавить объявление</h1>
            <ShareButton />
          </div>
        </div>
      </header>

      <PropertyFormDialog
        dialogOpen={dialogOpen}
        setDialogOpen={handleDialogClose}
        editProperty={null}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handlePhotoSelect={handlePhotoSelect}
        uploadingPhoto={uploadingPhoto}
        photoPreview=""
        handleDocumentSelect={handleDocumentSelect}
        handleRemoveDocument={handleRemoveDocument}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        agreedToPrivacy={agreedToPrivacy}
        setAgreedToPrivacy={setAgreedToPrivacy}
      />
    </div>
  );
}