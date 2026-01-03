import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AVITO_LISTINGS_URL = 'https://functions.poehali.dev/0363e1df-5e38-47b1-83ba-6d01b09d4e99';
const AVITO_PHOTOS_URL = 'https://functions.poehali.dev/cb793899-a403-4569-b4f2-f673db51a730';

interface AvitoListing {
  id: number;
  avitoId: number;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
}

export default function AdminPhotosTab() {
  const [listings, setListings] = useState<AvitoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<AvitoListing | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [description, setDescription] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<'photo' | 'edit' | 'delete' | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(AVITO_LISTINGS_URL);
      const data = await response.json();
      
      if (data.success) {
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
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

  const handleUploadPhoto = async () => {
    if (!selectedListing || !imageFile) return;

    try {
      setUploadingPhoto(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const response = await fetch(AVITO_PHOTOS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avito_id: selectedListing.avitoId,
            image_data: base64Image,
            description: description || selectedListing.description,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert('Фото успешно загружено!');
          setDialogOpen(false);
          setImageFile(null);
          setImagePreview('');
          setDescription('');
          setSelectedListing(null);
          fetchListings();
        } else {
          alert('Ошибка загрузки: ' + data.error);
        }
      };

      reader.readAsDataURL(imageFile);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Ошибка загрузки фото');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openUploadDialog = (listing: AvitoListing) => {
    setSelectedListing(listing);
    setDescription(listing.description || '');
    setImagePreview(listing.image);
    setEditMode('photo');
    setDialogOpen(true);
  };

  const handleDeletePhoto = async () => {
    if (!selectedListing) return;

    if (!confirm('Удалить фото и описание для этого объявления?')) return;

    try {
      const response = await fetch(`${AVITO_PHOTOS_URL}?avito_id=${selectedListing.avitoId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Фото удалено!');
        setDialogOpen(false);
        setSelectedListing(null);
        fetchListings();
      } else {
        alert('Ошибка удаления: ' + data.error);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Ошибка удаления фото');
    }
  };

  return (
    <TabsContent value="admin-photos" className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Управление фото объявлений</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Загрузите свои фотографии для объявлений Avito
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="mb-4 animate-spin">
            <Icon name="Loader2" size={64} className="mx-auto text-primary" />
          </div>
          <p className="text-gray-500">Загружаю объявления...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {listings.map((listing) => (
            <Card key={listing.avitoId} className="hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.image.includes('unsplash.com') && (
                  <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <p className="text-white text-xs font-semibold">Нет фото</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="MapPin" size={14} />
                  <span className="line-clamp-1">{listing.location}</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {listing.price.toLocaleString('ru-RU')} ₽
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => openUploadDialog(listing)}
                  className="w-full gap-2"
                  variant={listing.image.includes('unsplash.com') ? 'default' : 'outline'}
                >
                  <Icon name={listing.image.includes('unsplash.com') ? 'Upload' : 'Edit'} size={16} />
                  {listing.image.includes('unsplash.com') ? 'Загрузить фото' : 'Изменить фото'}
                </Button>
                {!listing.image.includes('unsplash.com') && (
                  <Button 
                    onClick={() => {
                      setSelectedListing(listing);
                      handleDeletePhoto();
                    }}
                    className="w-full gap-2"
                    variant="destructive"
                    size="sm"
                  >
                    <Icon name="Trash2" size={14} />
                    Удалить фото
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Загрузка фото для объявления</DialogTitle>
          </DialogHeader>
          
          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedListing.title}</h3>
                <p className="text-sm text-gray-600">{selectedListing.location}</p>
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
                  <div className="mt-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание (необязательно)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Добавьте описание объявления..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleUploadPhoto}
                  disabled={!imageFile || uploadingPhoto}
                  className="flex-1 gap-2"
                >
                  {uploadingPhoto ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name="Upload" size={16} />
                      {editMode === 'photo' ? 'Загрузить' : 'Сохранить'}
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => {
                    setDialogOpen(false);
                    setEditMode(null);
                  }}
                  variant="outline"
                  disabled={uploadingPhoto}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}