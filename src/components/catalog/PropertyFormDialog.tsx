import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface PropertyFormDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editProperty: Property | null;
  formData: {
    title: string;
    type: string;
    price: string;
    location: string;
    area: string;
    rooms: string;
    floor: string;
    total_floors: string;
    land_area: string;
    photo_url: string;
    description: string;
    property_link: string;
  };
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingPhoto: boolean;
  photoPreview: string;
}

export default function PropertyFormDialog({
  dialogOpen,
  setDialogOpen,
  editProperty,
  formData,
  setFormData,
  handleSubmit,
  handlePhotoSelect,
  uploadingPhoto,
  photoPreview
}: PropertyFormDialogProps) {
  return (
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
              <Label htmlFor="photo">Фотография</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                disabled={uploadingPhoto}
              />
              {uploadingPhoto && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <Icon name="Loader2" size={14} className="animate-spin" />
                  Загрузка фото...
                </p>
              )}
              {photoPreview && (
                <div className="mt-3">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
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
  );
}
