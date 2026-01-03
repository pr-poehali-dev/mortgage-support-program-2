import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface PropertyFormDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editProperty: any | null;
  formData: any;
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
}: PropertyFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleRemovePhoto = (photoUrl: string) => {
    const newPhotos = formData.photos.filter((p: string) => p !== photoUrl);
    setFormData({ ...formData, photos: newPhotos, photo_url: newPhotos[0] || '' });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 gap-2">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <button
            type="button"
            onClick={() => setCurrentStep(step)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep === step
                ? 'bg-primary text-white'
                : currentStep > step
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep > step ? <Icon name="Check" size={16} /> : step}
          </button>
          {step < 3 && (
            <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editProperty ? 'Редактировать объявление' : 'Разместить объявление'}
          </DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Основная информация</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Операция *</Label>
                  <Select
                    value={formData.operation}
                    onValueChange={(value) => setFormData({ ...formData, operation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Продажа</SelectItem>
                      <SelectItem value="rent">Аренда длительно</SelectItem>
                      <SelectItem value="daily">Посуточно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Категория *</Label>
                  <Select
                    value={formData.property_category}
                    onValueChange={(value) => setFormData({ ...formData, property_category: value, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Квартира</SelectItem>
                      <SelectItem value="room">Комната</SelectItem>
                      <SelectItem value="house">Дом, дача, коттедж</SelectItem>
                      <SelectItem value="land">Земельный участок</SelectItem>
                      <SelectItem value="garage">Гараж</SelectItem>
                      <SelectItem value="commercial">Коммерческая недвижимость</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Адрес *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="Севастополь, район, улица, дом"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Цена, ₽ *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="5000000"
                  />
                </div>

                {formData.property_category === 'apartment' && (
                  <div>
                    <Label>Комнат</Label>
                    <Select
                      value={formData.rooms?.toString() || ''}
                      onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                        <SelectItem value="0">Студия</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.property_category === 'room' && (
                  <div>
                    <Label>Комнат в квартире</Label>
                    <Input
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setCurrentStep(2)}>
                  Далее <Icon name="ChevronRight" size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Детали объекта</h3>

              <div className="grid grid-cols-2 gap-4">
                {['apartment', 'room', 'house', 'commercial'].includes(formData.property_category) && (
                  <>
                    <div>
                      <Label>Общая площадь, м²</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="65"
                      />
                    </div>

                    {formData.property_category !== 'commercial' && formData.operation === 'sale' && (
                      <div>
                        <Label>Тип жилья</Label>
                        <Select
                          value={formData.building_type || ''}
                          onValueChange={(value) => setFormData({ ...formData, building_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="secondary">Вторичка</SelectItem>
                            <SelectItem value="new">Новостройка</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {['apartment', 'room'].includes(formData.property_category) && (
                      <>
                        <div>
                          <Label>Этаж</Label>
                          <Input
                            type="number"
                            value={formData.floor}
                            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                            placeholder="5"
                          />
                        </div>

                        <div>
                          <Label>Этажей в доме</Label>
                          <Input
                            type="number"
                            value={formData.total_floors}
                            onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                            placeholder="10"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label>Ремонт</Label>
                      <Select
                        value={formData.renovation || ''}
                        onValueChange={(value) => setFormData({ ...formData, renovation: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="euro">Евроремонт</SelectItem>
                          <SelectItem value="modern">Современный</SelectItem>
                          <SelectItem value="cosmetic">Косметический</SelectItem>
                          <SelectItem value="design">Дизайнерский</SelectItem>
                          <SelectItem value="none">Без ремонта</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.property_category === 'apartment' && (
                      <>
                        <div>
                          <Label>Санузел</Label>
                          <Select
                            value={formData.bathroom || ''}
                            onValueChange={(value) => setFormData({ ...formData, bathroom: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="combined">Совмещенный</SelectItem>
                              <SelectItem value="separate">Раздельный</SelectItem>
                              <SelectItem value="multiple">2 и более</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Балкон/Лоджия</Label>
                          <Select
                            value={formData.balcony || ''}
                            onValueChange={(value) => setFormData({ ...formData, balcony: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="balcony">Балкон</SelectItem>
                              <SelectItem value="loggia">Лоджия</SelectItem>
                              <SelectItem value="multiple">Несколько</SelectItem>
                              <SelectItem value="none">Нет</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </>
                )}

                {['house', 'land'].includes(formData.property_category) && (
                  <>
                    <div>
                      <Label>Площадь участка, сот.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.land_area}
                        onChange={(e) => setFormData({ ...formData, land_area: e.target.value })}
                        placeholder="6"
                      />
                    </div>

                    {formData.property_category === 'house' && (
                      <>
                        <div>
                          <Label>Площадь дома, м²</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            placeholder="100"
                          />
                        </div>

                        <div>
                          <Label>Материал стен</Label>
                          <Select
                            value={formData.wall_material || ''}
                            onValueChange={(value) => setFormData({ ...formData, wall_material: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="brick">Кирпич</SelectItem>
                              <SelectItem value="panel">Панель</SelectItem>
                              <SelectItem value="monolith">Монолит</SelectItem>
                              <SelectItem value="block">Блоки</SelectItem>
                              <SelectItem value="wood">Дерево</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </>
                )}

                {formData.operation === 'rent' || formData.operation === 'daily' ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="furniture"
                        checked={formData.furniture}
                        onCheckedChange={(checked) => setFormData({ ...formData, furniture: checked })}
                      />
                      <Label htmlFor="furniture" className="font-normal cursor-pointer">
                        Мебель в комнатах
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="utilities"
                        checked={formData.utilities_included}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, utilities_included: checked })
                        }
                      />
                      <Label htmlFor="utilities" className="font-normal cursor-pointer">
                        Коммунальные включены
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pets"
                        checked={formData.pets_allowed}
                        onCheckedChange={(checked) => setFormData({ ...formData, pets_allowed: checked })}
                      />
                      <Label htmlFor="pets" className="font-normal cursor-pointer">
                        Можно с животными
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="children"
                        checked={formData.children_allowed}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, children_allowed: checked })
                        }
                      />
                      <Label htmlFor="children" className="font-normal cursor-pointer">
                        Можно с детьми
                      </Label>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  <Icon name="ChevronLeft" size={16} className="mr-1" /> Назад
                </Button>
                <Button type="button" onClick={() => setCurrentStep(3)}>
                  Далее <Icon name="ChevronRight" size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
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
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
