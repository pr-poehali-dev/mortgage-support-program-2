import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useState, useRef } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        Array.from(files).forEach(file => {
          if (file.type.startsWith('image/')) {
            dataTransfer.items.add(file);
          }
        });
        input.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

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
        <Label>Фотографии (макс. 50)</Label>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
          } ${uploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Перетащите фото сюда или нажмите для выбора
          </p>
          <p className="text-xs text-gray-500">
            Загружено: {formData.photos?.length || 0} / 50 фото (макс. 9 МБ каждое)
          </p>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoSelect}
          disabled={uploadingPhoto}
          className="hidden"
        />
        {uploadingPhoto && (
          <p className="text-sm text-primary mt-2 flex items-center gap-2 font-medium">
            <Icon name="Loader2" size={14} className="animate-spin" />
            Сжатие и загрузка фото...
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