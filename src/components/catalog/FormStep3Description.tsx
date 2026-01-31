import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormStep3DescriptionProps {
  formData: any;
  setFormData: (data: any) => void;
  setCurrentStep: (step: number) => void;
  handlePhotoSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  uploadingPhoto: boolean;
  handleRemovePhoto: (photoUrl: string) => void;
  editProperty: any | null;
  handleDocumentSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDocument: (url: string) => void;
  agreedToTerms?: boolean;
  setAgreedToTerms?: (agreed: boolean) => void;
  agreedToPrivacy?: boolean;
  setAgreedToPrivacy?: (agreed: boolean) => void;
}

interface SortablePhotoItemProps {
  photo: string;
  index: number;
  onRemove: (photo: string) => void;
  onView: (photo: string) => void;
}

function SortablePhotoItem({ photo, index, onRemove, onView }: SortablePhotoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group cursor-move"
      {...attributes}
      {...listeners}
    >
      <img
        src={photo}
        alt={`Photo ${index + 1}`}
        className="w-full h-24 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onView(photo);
        }}
        className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-[5]"
      >
        <div className="bg-white/90 p-2 rounded-full">
          <Icon name="Maximize2" size={16} />
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(photo);
        }}
        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Icon name="X" size={14} />
      </button>
      {index === 0 && (
        <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
          Главное
        </div>
      )}
      <div className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        <Icon name="GripVertical" size={14} />
      </div>
    </div>
  );
}

export default function FormStep3Description({
  formData,
  setFormData,
  setCurrentStep,
  handlePhotoSelect,
  uploadingPhoto,
  handleRemovePhoto,
  editProperty,
  handleDocumentSelect,
  handleRemoveDocument,
  agreedToTerms,
  setAgreedToTerms,
  agreedToPrivacy,
  setAgreedToPrivacy,
}: FormStep3DescriptionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formData.photos.indexOf(active.id);
      const newIndex = formData.photos.indexOf(over.id);

      const newPhotos = arrayMove(formData.photos, oldIndex, newIndex);
      setFormData({
        ...formData,
        photos: newPhotos,
        photo_url: newPhotos[0] || '',
      });
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
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">
              <Icon name="Info" size={12} className="inline mr-1" />
              Перетащите фото, чтобы изменить порядок. Первое фото — главное.
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={formData.photos} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-4 gap-2">
                  {formData.photos.map((photo: string, index: number) => (
                    <SortablePhotoItem
                      key={photo}
                      photo={photo}
                      index={index}
                      onRemove={handleRemovePhoto}
                      onView={setFullscreenPhoto}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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

      <div>
        <Label>Документы (свидетельство, выписка ЕГРН и т.д.)</Label>
        <div className="mt-2">
          <input
            type="file"
            id="documents-upload"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            onChange={handleDocumentSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('documents-upload')?.click()}
            disabled={uploadingPhoto}
            className="w-full"
          >
            {uploadingPhoto ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="FileText" className="mr-2" size={18} />
                Добавить документы
              </>
            )}
          </Button>
          {formData.documents && formData.documents.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.documents.map((doc: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={18} className="text-blue-600" />
                    <span className="text-sm text-gray-700">Документ {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(doc)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!editProperty && agreedToTerms !== undefined && setAgreedToTerms && agreedToPrivacy !== undefined && setAgreedToPrivacy && (
        <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="agreedToTerms" className="text-sm text-gray-700 flex-1">
              Я согласен с{' '}
              <button
                type="button"
                onClick={() => window.open('/terms-of-service', '_blank')}
                className="text-primary hover:underline font-medium"
              >
                правилами использования сайта
              </button>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreedToPrivacy"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="agreedToPrivacy" className="text-sm text-gray-700 flex-1">
              Я согласен на обработку персональных данных в соответствии с{' '}
              <button
                type="button"
                onClick={() => window.open('/privacy-policy', '_blank')}
                className="text-primary hover:underline font-medium"
              >
                политикой конфиденциальности
              </button>
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
          <Icon name="ChevronLeft" size={16} className="mr-1" /> Назад
        </Button>
        <Button type="submit" className="px-8">
          {editProperty ? 'Сохранить изменения' : 'Разместить объявление'}
        </Button>
      </div>

      {/* Полноэкранный просмотр */}
      {fullscreenPhoto && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={() => setFullscreenPhoto(null)}
        >
          <button
            onClick={() => setFullscreenPhoto(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          >
            <Icon name="X" size={24} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={fullscreenPhoto} 
              alt="Полноэкранный просмотр"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}