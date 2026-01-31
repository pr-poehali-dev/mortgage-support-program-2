import { FormEvent } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ApplicationFormProps {
  showForm: boolean;
  selectedCity: string;
  formData: { name: string; phone: string; city: string };
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onFormDataChange: (data: { name: string; phone: string; city: string }) => void;
}

export default function ApplicationForm({
  showForm,
  selectedCity,
  formData,
  onClose,
  onSubmit,
  onFormDataChange,
}: ApplicationFormProps) {
  if (!showForm) return null;

  return (
    <Card id="region-form" className="mt-8 p-6 bg-white shadow-xl border-2 border-blue-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon name="MapPin" size={24} className="text-blue-600" />
          Заявка на ипотеку в городе {selectedCity}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <Icon name="X" size={24} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ваше имя</label>
          <Input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            placeholder="Введите имя"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
          <Input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
            placeholder="+7 (___) ___-__-__"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
          <Input
            type="text"
            value={formData.city}
            readOnly
            className="w-full bg-gray-50"
          />
        </div>
        <Button type="submit" className="w-full">
          <Icon name="Send" size={18} className="mr-2" />
          Отправить заявку
        </Button>
      </form>
    </Card>
  );
}