import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

export default function RentCalculator() {
  const [propertyType, setPropertyType] = useState('apartment');
  const [rooms, setRooms] = useState('1');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('center');
  const [hasRepair, setHasRepair] = useState(false);
  const [hasFurniture, setHasFurniture] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasSeaView, setHasSeaView] = useState(false);

  const calculateRent = () => {
    let basePrice = 0;

    if (propertyType === 'apartment') {
      switch (rooms) {
        case '1':
          basePrice = 35000;
          break;
        case '2':
          basePrice = 45000;
          break;
        case '3':
          basePrice = 55000;
          break;
        case '4':
          basePrice = 70000;
          break;
        default:
          basePrice = 35000;
      }
    } else if (propertyType === 'house') {
      basePrice = 80000;
    } else if (propertyType === 'room') {
      basePrice = 20000;
    }

    if (district === 'center') {
      basePrice *= 1.2;
    } else if (district === 'north') {
      basePrice *= 1.1;
    } else if (district === 'gagarin') {
      basePrice *= 0.95;
    } else if (district === 'balaklave') {
      basePrice *= 1.15;
    }

    if (area) {
      const areaNum = parseFloat(area);
      if (areaNum > 60) {
        basePrice *= 1.1;
      } else if (areaNum < 35) {
        basePrice *= 0.9;
      }
    }

    if (hasRepair) basePrice *= 1.15;
    if (hasFurniture) basePrice *= 1.1;
    if (hasParking) basePrice += 5000;
    if (hasSeaView) basePrice *= 1.2;

    return Math.round(basePrice / 1000) * 1000;
  };

  const estimatedPrice = calculateRent();
  const minPrice = Math.round(estimatedPrice * 0.9 / 1000) * 1000;
  const maxPrice = Math.round(estimatedPrice * 1.1 / 1000) * 1000;

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
            <Icon name="Calculator" className="text-white" size={24} />
          </div>
          <div>
            <CardTitle className="text-2xl">Калькулятор аренды</CardTitle>
            <CardDescription>Узнайте примерную стоимость аренды вашей недвижимости</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Тип недвижимости</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="propertyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Квартира</SelectItem>
                <SelectItem value="house">Дом</SelectItem>
                <SelectItem value="room">Комната</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {propertyType === 'apartment' && (
            <div className="space-y-2">
              <Label htmlFor="rooms">Количество комнат</Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger id="rooms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 комната</SelectItem>
                  <SelectItem value="2">2 комнаты</SelectItem>
                  <SelectItem value="3">3 комнаты</SelectItem>
                  <SelectItem value="4">4+ комнаты</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="area">Площадь (м²)</Label>
            <Input
              id="area"
              type="number"
              placeholder="Введите площадь"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Район</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger id="district">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Центр (Ленинский)</SelectItem>
                <SelectItem value="north">Северная сторона</SelectItem>
                <SelectItem value="gagarin">Гагаринский район</SelectItem>
                <SelectItem value="balaklave">Балаклава</SelectItem>
                <SelectItem value="other">Другой район</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <Label className="text-base font-semibold">Дополнительные параметры</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="repair"
              checked={hasRepair}
              onCheckedChange={(checked) => setHasRepair(checked as boolean)}
            />
            <label
              htmlFor="repair"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Свежий ремонт (не более 2 лет)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="furniture"
              checked={hasFurniture}
              onCheckedChange={(checked) => setHasFurniture(checked as boolean)}
            />
            <label
              htmlFor="furniture"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Полностью с мебелью и техникой
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="parking"
              checked={hasParking}
              onCheckedChange={(checked) => setHasParking(checked as boolean)}
            />
            <label
              htmlFor="parking"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Парковочное место
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="seaview"
              checked={hasSeaView}
              onCheckedChange={(checked) => setHasSeaView(checked as boolean)}
            />
            <label
              htmlFor="seaview"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Вид на море
            </label>
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Примерная стоимость аренды в месяц</p>
            <div className="flex items-baseline justify-center gap-2 mb-3">
              <span className="text-4xl font-bold text-primary">
                {estimatedPrice.toLocaleString('ru-RU')}
              </span>
              <span className="text-xl text-gray-600">₽</span>
            </div>
            <p className="text-sm text-gray-500">
              Диапазон: {minPrice.toLocaleString('ru-RU')} – {maxPrice.toLocaleString('ru-RU')} ₽
            </p>
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-white/50 p-3 rounded-lg">
              <Icon name="Info" size={16} className="flex-shrink-0 mt-0.5" />
              <p className="text-left">
                Расчёт является приблизительным и основан на средней рыночной стоимости аренды в Севастополе. 
                Точная цена определяется после осмотра объекта специалистом.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
