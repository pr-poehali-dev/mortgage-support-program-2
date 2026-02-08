import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';

interface RentalProperty {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'commercial' | 'daily';
  district: string;
  rooms?: number;
  area: number;
  floor?: number;
  price: number;
  priceType: 'month' | 'day';
  image: string;
  features: string[];
  description: string;
}

export default function RentalCatalog() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Примеры объектов аренды
  const rentalProperties: RentalProperty[] = [
    {
      id: '1',
      title: '2-комнатная квартира в центре',
      type: 'apartment',
      district: 'Ленинский',
      rooms: 2,
      area: 55,
      floor: 5,
      price: 35000,
      priceType: 'month',
      image: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg',
      features: ['Мебель', 'Техника', 'Ремонт', 'Балкон'],
      description: 'Уютная квартира в центре Севастополя с современным ремонтом'
    },
    {
      id: '2',
      title: '1-комнатная квартира у моря',
      type: 'apartment',
      district: 'Гагаринский',
      rooms: 1,
      area: 38,
      floor: 3,
      price: 28000,
      priceType: 'month',
      image: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/cf3a8153-272d-4bad-ab6d-5d0f64e066f0.jpg',
      features: ['Вид на море', 'Мебель', 'Wi-Fi', 'Кондиционер'],
      description: 'Квартира в 5 минутах от пляжа, с видом на море'
    },
    {
      id: '3',
      title: 'Частный дом с участком',
      type: 'house',
      district: 'Балаклава',
      rooms: 4,
      area: 120,
      price: 50000,
      priceType: 'month',
      image: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg',
      features: ['Двор 6 соток', 'Парковка', 'Баня', 'Беседка'],
      description: 'Уютный дом для семьи в тихом районе'
    },
    {
      id: '4',
      title: 'Офис в бизнес-центре',
      type: 'commercial',
      district: 'Ленинский',
      area: 45,
      floor: 2,
      price: 60000,
      priceType: 'month',
      image: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/c1e5480b-a628-4f12-9e94-2a8e7f37d3c4.jpg',
      features: ['Ремонт', 'Охрана', 'Парковка', 'Кондиционер'],
      description: 'Современный офис в центре города'
    },
    {
      id: '5',
      title: 'Квартира-студия посуточно',
      type: 'daily',
      district: 'Нахимовский',
      rooms: 1,
      area: 30,
      floor: 7,
      price: 3000,
      priceType: 'day',
      image: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/7e56d26b-fbcb-4c95-a008-5edc882e651b.jpg',
      features: ['Все удобства', 'Wi-Fi', 'Новый дом', 'Рядом магазины'],
      description: 'Компактная студия для краткосрочного проживания'
    },
    {
      id: '6',
      title: '3-комнатная квартира на Балаконах',
      type: 'apartment',
      district: 'Балаконы',
      rooms: 3,
      area: 75,
      floor: 4,
      price: 42000,
      priceType: 'month',
      image: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg',
      features: ['Просторная', 'Лоджия', 'Встроенная кухня', 'Гардеробная'],
      description: 'Большая квартира для семьи в развитом районе'
    }
  ];

  const propertyTypes = [
    { value: 'all', label: 'Все типы', icon: 'Home' },
    { value: 'apartment', label: 'Квартиры', icon: 'Building' },
    { value: 'house', label: 'Дома', icon: 'Home' },
    { value: 'commercial', label: 'Коммерческая', icon: 'Store' },
    { value: 'daily', label: 'Посуточно', icon: 'Calendar' }
  ];

  const districts = [
    'all',
    'Ленинский',
    'Гагаринский',
    'Нахимовский',
    'Балаконы',
    'Балаклава'
  ];

  const priceRanges = [
    { value: 'all', label: 'Любая цена' },
    { value: '0-30000', label: 'До 30 000 ₽' },
    { value: '30000-50000', label: '30 000 - 50 000 ₽' },
    { value: '50000-100000', label: '50 000 - 100 000 ₽' },
    { value: '100000+', label: 'От 100 000 ₽' }
  ];

  const filteredProperties = rentalProperties.filter(property => {
    // Фильтр по типу
    if (selectedType !== 'all' && property.type !== selectedType) {
      return false;
    }

    // Фильтр по району
    if (selectedDistrict !== 'all' && property.district !== selectedDistrict) {
      return false;
    }

    // Фильтр по цене
    if (priceRange !== 'all') {
      const price = property.priceType === 'month' ? property.price : property.price * 30;
      if (priceRange === '0-30000' && price > 30000) return false;
      if (priceRange === '30000-50000' && (price < 30000 || price > 50000)) return false;
      if (priceRange === '50000-100000' && (price < 50000 || price > 100000)) return false;
      if (priceRange === '100000+' && price < 100000) return false;
    }

    return true;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Квартира';
      case 'house': return 'Дом';
      case 'commercial': return 'Коммерция';
      case 'daily': return 'Посуточно';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <SEO />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="font-medium">На главную</span>
            </button>
            <a 
              href="tel:+79781281850"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Phone" size={18} />
              <span className="hidden sm:inline">+7 978 128-18-50</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <Icon name="Key" size={36} className="text-blue-600" />
            Каталог аренды недвижимости
          </h1>
          <p className="text-lg text-gray-600">
            Найдите идеальный вариант для аренды в Севастополе
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={24} className="text-blue-600" />
            Фильтры
          </h2>

          <div className="space-y-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип недвижимости
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedType === type.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon name={type.icon} size={18} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Район
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
              >
                <option value="all">Все районы</option>
                {districts.filter(d => d !== 'all').map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена за месяц
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                      priceRange === range.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-600">
                Найдено: <strong>{filteredProperties.length}</strong> объектов
              </p>
              <Button
                onClick={() => {
                  setSelectedType('all');
                  setPriceRange('all');
                  setSelectedDistrict('all');
                }}
                variant="outline"
                size="sm"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {getTypeLabel(property.type)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {property.district}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {property.rooms && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Icon name="Home" size={14} />
                        <span>{property.rooms} комн.</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="Maximize" size={14} />
                      <span>{property.area} м²</span>
                    </div>
                    {property.floor && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Icon name="Layers" size={14} />
                        <span>{property.floor} этаж</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{property.features.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {property.price.toLocaleString('ru-RU')} ₽
                      </p>
                      <p className="text-xs text-gray-500">
                        {property.priceType === 'month' ? 'в месяц' : 'в сутки'}
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate('/contact')}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <Icon name="Phone" size={16} className="mr-2" />
                      Связаться
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
            <Icon name="SearchX" size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Объекты не найдены
            </h3>
            <p className="text-gray-600 mb-6">
              По выбранным фильтрам не найдено подходящих объектов. Попробуйте изменить параметры поиска.
            </p>
            <Button
              onClick={() => {
                setSelectedType('all');
                setPriceRange('all');
                setSelectedDistrict('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              <Icon name="RotateCcw" size={18} className="mr-2" />
              Сбросить фильтры
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mt-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Не нашли подходящий вариант?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Оставьте заявку, и мы подберем для вас идеальный объект
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Icon name="FileText" className="mr-2" size={20} />
              Оставить заявку
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить нам
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2008-2025 Арендодатель. Аренда недвижимости в Севастополе
          </p>
        </div>
      </footer>
    </div>
  );
}
