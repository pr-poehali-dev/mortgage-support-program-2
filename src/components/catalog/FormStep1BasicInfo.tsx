import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface FormStep1BasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  setCurrentStep: (step: number) => void;
}

export default function FormStep1BasicInfo({ formData, setFormData, setCurrentStep }: FormStep1BasicInfoProps) {
  return (
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
  );
}
