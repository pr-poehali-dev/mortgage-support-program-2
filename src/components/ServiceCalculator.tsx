import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ServicePrice {
  id: string;
  name: string;
  basePrice: number;
  isPercentage: boolean;
  percentageRate?: number;
}

const servicePrices: ServicePrice[] = [
  { id: 'sale', name: 'Продажа квартир', basePrice: 0, isPercentage: true, percentageRate: 4 },
  { id: 'exchange', name: 'Обмен квартир', basePrice: 50000, isPercentage: false },
  { id: 'buy', name: 'Покупка квартир', basePrice: 40000, isPercentage: false },
  { id: 'rent', name: 'Аренда квартир', basePrice: 0, isPercentage: true, percentageRate: 50 },
  { id: 'legal', name: 'Оформление сделок', basePrice: 25000, isPercentage: false },
  { id: 'urgent', name: 'Срочный выкуп', basePrice: 0, isPercentage: true, percentageRate: 10 },
  { id: 'valuation', name: 'Оценка квартир', basePrice: 3000, isPercentage: false },
  { id: 'mortgage', name: 'Ипотечное кредитование', basePrice: 30000, isPercentage: false },
  { id: 'country', name: 'Загородная недвижимость', basePrice: 50000, isPercentage: false },
  { id: 'commercial', name: 'Коммерческая недвижимость', basePrice: 100000, isPercentage: false },
  { id: 'investment', name: 'Инвестиции в недвижимость', basePrice: 50000, isPercentage: false },
  { id: 'newbuilding', name: 'Новостройки', basePrice: 50000, isPercentage: false },
];

export default function ServiceCalculator() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [propertyPrice, setPropertyPrice] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');

  const calculatePrice = () => {
    const service = servicePrices.find(s => s.id === selectedService);
    if (!service) return 0;

    if (service.isPercentage) {
      if (service.id === 'sale' && propertyPrice) {
        const price = parseFloat(propertyPrice);
        return (price * (service.percentageRate || 0)) / 100;
      }
      if (service.id === 'rent' && monthlyRent) {
        const rent = parseFloat(monthlyRent);
        return rent * 0.5;
      }
      if (service.id === 'urgent' && propertyPrice) {
        const price = parseFloat(propertyPrice);
        return price * 0.1;
      }
    }

    return service.basePrice;
  };

  const selectedServiceData = servicePrices.find(s => s.id === selectedService);
  const estimatedPrice = calculatePrice();
  const showPropertyInput = selectedService && ['sale', 'urgent'].includes(selectedService);
  const showRentInput = selectedService === 'rent';

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-3">
          <Icon name="Calculator" size={28} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold">Калькулятор стоимости</h3>
          <p className="text-sm text-gray-600">Рассчитайте стоимость услуги онлайн</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="service" className="text-base font-semibold mb-2 block">
            Выберите услугу
          </Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger id="service" className="h-12 text-base">
              <SelectValue placeholder="Выберите услугу из списка" />
            </SelectTrigger>
            <SelectContent>
              {servicePrices.map(service => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showPropertyInput && (
          <div>
            <Label htmlFor="price" className="text-base font-semibold mb-2 block">
              Стоимость недвижимости (₽)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Например: 5000000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
              className="h-12 text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              Введите примерную стоимость объекта
            </p>
          </div>
        )}

        {showRentInput && (
          <div>
            <Label htmlFor="rent" className="text-base font-semibold mb-2 block">
              Месячная арендная плата (₽)
            </Label>
            <Input
              id="rent"
              type="number"
              placeholder="Например: 30000"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="h-12 text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              Укажите желаемую арендную плату в месяц
            </p>
          </div>
        )}

        {selectedService && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5 border-2 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-700">
                Стоимость услуги:
              </span>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {estimatedPrice.toLocaleString('ru-RU')} ₽
                </div>
                {selectedServiceData?.isPercentage && (
                  <div className="text-xs text-gray-600 mt-1">
                    {selectedServiceData.id === 'sale' && 'Комиссия 4% от стоимости'}
                    {selectedServiceData.id === 'rent' && 'Половина месячной аренды'}
                    {selectedServiceData.id === 'urgent' && 'Комиссия 10% (вы получите 90%)'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-primary/20">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <p>
                  Это приблизительный расчет. Точная стоимость определяется после консультации 
                  и зависит от сложности объекта и дополнительных условий.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            disabled={!selectedService}
            onClick={() => {
              window.location.href = '/register';
            }}
          >
            <Icon name="FileText" className="mr-2" size={20} />
            Оставить заявку
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setSelectedService('');
              setPropertyPrice('');
              setMonthlyRent('');
            }}
          >
            <Icon name="RotateCcw" className="mr-2" size={20} />
            Сбросить
          </Button>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Icon name="Phone" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Бесплатная консультация</p>
              <p className="text-sm text-blue-700">
                Позвоните нам по телефону{' '}
                <a href="tel:+79781281850" className="font-bold underline hover:text-blue-800">
                  +7 (978) 128-18-50
                </a>
                {' '}для точного расчета стоимости услуги
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
