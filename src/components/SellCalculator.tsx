import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

export default function SellCalculator() {
  const [propertyType, setPropertyType] = useState('apartment');
  const [rooms, setRooms] = useState('1');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('center');
  const [floor, setFloor] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [hasRepair, setHasRepair] = useState(false);
  const [hasFurniture, setHasFurniture] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasSeaView, setHasSeaView] = useState(false);
  const [buildingType, setBuildingType] = useState('panel');

  const calculatePrice = () => {
    let pricePerMeter = 0;

    if (propertyType === 'apartment') {
      switch (district) {
        case 'center':
          pricePerMeter = 120000;
          break;
        case 'north':
          pricePerMeter = 95000;
          break;
        case 'gagarin':
          pricePerMeter = 110000;
          break;
        case 'balaklave':
          pricePerMeter = 105000;
          break;
        default:
          pricePerMeter = 100000;
      }

      if (buildingType === 'monolith') {
        pricePerMeter *= 1.15;
      } else if (buildingType === 'brick') {
        pricePerMeter *= 1.1;
      } else if (buildingType === 'stalin') {
        pricePerMeter *= 1.2;
      }

      if (floor && totalFloors) {
        const floorNum = parseInt(floor);
        const totalNum = parseInt(totalFloors);
        
        if (floorNum === 1 || floorNum === totalNum) {
          pricePerMeter *= 0.95;
        } else if (floorNum >= 2 && floorNum <= 5) {
          pricePerMeter *= 1.05;
        }
      }

      if (rooms === '1') {
        pricePerMeter *= 1.1;
      } else if (rooms === '4') {
        pricePerMeter *= 0.95;
      }

    } else if (propertyType === 'house') {
      pricePerMeter = 85000;
      if (district === 'balaklave') {
        pricePerMeter *= 1.2;
      }
    } else if (propertyType === 'land') {
      pricePerMeter = 25000;
      if (district === 'center') {
        pricePerMeter *= 2;
      }
    }

    if (hasRepair) pricePerMeter *= 1.2;
    if (hasFurniture) pricePerMeter *= 1.05;
    if (hasParking) pricePerMeter += 15000;
    if (hasSeaView) pricePerMeter *= 1.25;

    const areaNum = parseFloat(area) || 50;
    const totalPrice = pricePerMeter * areaNum;

    return Math.round(totalPrice / 100000) * 100000;
  };

  const estimatedPrice = calculatePrice();
  const minPrice = Math.round(estimatedPrice * 0.92 / 100000) * 100000;
  const maxPrice = Math.round(estimatedPrice * 1.08 / 100000) * 100000;

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Icon name="Calculator" className="text-white" size={24} />
          </div>
          <div>
            <CardTitle className="text-2xl">Калькулятор стоимости</CardTitle>
            <CardDescription>Узнайте примерную рыночную стоимость вашей недвижимости</CardDescription>
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
                <SelectItem value="land">Земельный участок</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {propertyType === 'apartment' && (
            <>
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

              <div className="space-y-2">
                <Label htmlFor="buildingType">Тип дома</Label>
                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger id="buildingType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="panel">Панельный</SelectItem>
                    <SelectItem value="brick">Кирпичный</SelectItem>
                    <SelectItem value="monolith">Монолитный</SelectItem>
                    <SelectItem value="stalin">Сталинка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Этаж</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="Этаж"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalFloors">Этажность дома</Label>
                <Input
                  id="totalFloors"
                  type="number"
                  placeholder="Всего этажей"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value)}
                />
              </div>
            </>
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
              Свежий ремонт (не более 3 лет)
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
              С мебелью и техникой
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
              Парковочное место в собственности
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
          <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Примерная рыночная стоимость</p>
            <div className="flex items-baseline justify-center gap-2 mb-3">
              <span className="text-4xl font-bold text-green-600">
                {estimatedPrice.toLocaleString('ru-RU')}
              </span>
              <span className="text-xl text-gray-600">₽</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Диапазон: {minPrice.toLocaleString('ru-RU')} – {maxPrice.toLocaleString('ru-RU')} ₽
            </p>
            {area && (
              <p className="text-xs text-gray-500">
                Цена за м²: {Math.round(estimatedPrice / parseFloat(area)).toLocaleString('ru-RU')} ₽
              </p>
            )}
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-white/50 p-3 rounded-lg">
              <Icon name="Info" size={16} className="flex-shrink-0 mt-0.5" />
              <p className="text-left">
                Расчёт является приблизительным и основан на средней рыночной стоимости недвижимости в Севастополе. 
                Точная оценка проводится специалистом после осмотра объекта с учётом всех особенностей.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
