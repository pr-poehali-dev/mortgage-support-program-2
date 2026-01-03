import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface FormStep3DescriptionProps {
  formData: any;
  setFormData: (data: any) => void;
  setCurrentStep: (step: number) => void;
  handlePhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingPhoto: boolean;
  handleRemovePhoto: (photoUrl: string) => void;
  editProperty: any | null;
}

export default function FormStep3Description({
  formData,
  setFormData,
  setCurrentStep,
  handlePhotoSelect,
  uploadingPhoto,
  handleRemovePhoto,
  editProperty,
}: FormStep3DescriptionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Описание и фото</h3>

      <div>
        <Label>Название объявления *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Например: 2-комн. квартира, 65 м², 5/10 эт."
        />
      </div>

      <div>
        <Label>Описание</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Расскажите подробнее о вашем объекте..."
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-1">
          Укажите преимущества, особенности планировки, инфраструктуру
        </p>
      </div>

      <div>
        <Label>Фотографии</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoSelect}
          disabled={uploadingPhoto}
        />
        {uploadingPhoto && (
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <Icon name="Loader2" size={14} className="animate-spin" />
            Загрузка фото...
          </p>
        )}
        {formData.photos && formData.photos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {formData.photos.map((photo: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="X" size={14} />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                    Главное
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Телефон для связи</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 (978) 123-45-67"
          />
        </div>

        <div>
          <Label>Способ связи</Label>
          <Select
            value={formData.contact_method || 'phone'}
            onValueChange={(value) => setFormData({ ...formData, contact_method: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Телефон</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="any">Любой</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
          <Icon name="ChevronLeft" size={16} className="mr-1" /> Назад
        </Button>
        <Button type="submit" className="px-8">
          {editProperty ? 'Сохранить изменения' : 'Разместить объявление'}
        </Button>
      </div>
    </div>
  );
}
