import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface FormStep2DetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  setCurrentStep: (step: number) => void;
}

export default function FormStep2Details({ formData, setFormData, setCurrentStep }: FormStep2DetailsProps) {
  return (
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

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <Label>ФИО контакта</Label>
          <Input
            type="text"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="Николаев Дмитрий Юрьевич"
          />
        </div>
        
        <div>
          <Label>Телефон</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 978 128-18-50"
          />
        </div>
        
        <div className="col-span-2">
          <Label>Ссылка на видео Rutube (необязательно)</Label>
          <Input
            type="text"
            value={formData.rutube_link}
            onChange={(e) => setFormData({ ...formData, rutube_link: e.target.value })}
            placeholder="https://rutube.ru/video/..."
          />
        </div>
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
  );
}