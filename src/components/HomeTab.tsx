import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import RSSFeed from '@/components/RSSFeed';
import { useLatestRutubeVideo } from '@/hooks/useLatestRutubeVideo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { crimeaCities } from '@/data/crimea-cities';

export default function HomeTab() {
  const { video } = useLatestRutubeVideo();
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'city' | 'town'>('all');

  const filteredCities = useMemo(() => {
    let cities = crimeaCities;
    
    // Фильтр по типу
    if (filterType !== 'all') {
      cities = cities.filter(city => city.type === filterType);
    }
    
    // Фильтр по поиску
    if (searchQuery) {
      cities = cities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return cities;
  }, [searchQuery, filterType]);

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setFormData({ ...formData, city });
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('region-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/927c8f65-0024-4ded-8d22-24987e241c4e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({
          title: '✅ Заявка отправлена!',
          description: `${formData.name}, мы свяжемся с вами по номеру ${formData.phone}`,
        });
        setShowForm(false);
        setFormData({ name: '', phone: '', city: '' });
      } else {
        toast({
          title: '❌ Ошибка',
          description: 'Не удалось отправить заявку. Позвоните нам: +7 978 128-18-50',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заявку. Позвоните нам: +7 978 128-18-50',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero секция с видео */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative px-6 sm:px-12 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ипотека в Крыму от 0.1% годовых
              </h1>
              <p className="text-lg sm:text-xl text-blue-50 mb-6 sm:mb-8">
                Профессиональная помощь в получении ипотеки. Работаю со всеми программами господдержки 2025-2026
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://t.me/ipoteka_krym_rf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Icon name="Send" size={20} />
                  Получить консультацию
                </a>
                <a
                  href="tel:+79781281850"
                  className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
                >
                  <Icon name="Phone" size={20} />
                  +7 978 128-18-50
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={video.embed_url}
                  title={video.title}
                  frameBorder="0"
                  allow="clipboard-write; autoplay"
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Почему выбирают меня
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="BadgeCheck" size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Опыт с 2020 года</h3>
            <p className="text-gray-600 text-sm">Более 500 успешно оформленных ипотек в Крыму</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Percent" size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Лучшие условия</h3>
            <p className="text-gray-600 text-sm">Подбираю программу с минимальной ставкой для вас</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="FileCheck" size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Полное сопровождение</h3>
            <p className="text-gray-600 text-sm">От подачи заявки до получения ключей</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Clock" size={24} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Быстрое оформление</h3>
            <p className="text-gray-600 text-sm">Одобрение за 1-3 дня, выдача за 7-14 дней</p>
          </Card>
        </div>
      </div>

      {/* Программы кратко */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Доступные программы 2025
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5 border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">Семейная ипотека</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">6%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Для семей с детьми. До 12 млн руб на срок до 30 лет</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold">
              <Icon name="Users" size={16} className="mr-1" />
              Первый взнос от 15%
            </div>
          </Card>

          <Card className="p-5 border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">IT ипотека</h3>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">6%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Для IT специалистов. До 18 млн руб на срок до 30 лет</p>
            <div className="flex items-center text-purple-600 text-sm font-semibold">
              <Icon name="Code" size={16} className="mr-1" />
              Первый взнос от 15%
            </div>
          </Card>

          <Card className="p-5 border-2 border-green-200 hover:border-green-400 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">Сельская ипотека</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">0.1-3%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">На жилье в сельской местности. До 6 млн руб</p>
            <div className="flex items-center text-green-600 text-sm font-semibold">
              <Icon name="Home" size={16} className="mr-1" />
              Первый взнос от 10%
            </div>
          </Card>
        </div>
      </div>

      {/* Межрегиональные сделки */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Межрегиональные сделки
        </h2>
        <p className="text-center text-gray-600 mb-6">Готовое решение</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all border-2 border-indigo-100 animate-in fade-in slide-in-from-left duration-500" style={{animationDelay: '100ms'}}>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="MapPin" size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Ипотека в любом городе</h3>
            <p className="text-gray-600 text-sm">
              Поможем одобрить ипотеку в нужном городе с учетом специфики региона и требований банков к объекту недвижимости.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all border-2 border-blue-100 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '200ms'}}>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Monitor" size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Электронные сделки</h3>
            <p className="text-gray-600 text-sm">
              Дистанционная покупка жилья. Приобретайте недвижимость в любом городе РФ, а сделку зарегистрируем электронно.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all border-2 border-green-100 animate-in fade-in slide-in-from-right duration-500" style={{animationDelay: '300ms'}}>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="ShieldCheck" size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Безопасность и надежность</h3>
            <p className="text-gray-600 text-sm">
              Официальные партнеры ведущих банков и крупных застройщиков. Сопроводим сделку до конца. Проверим объект на юридическую чистоту.
            </p>
          </Card>
        </div>
      </div>

      {/* Как работаю */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Как я работаю
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Консультация</h3>
              <p className="text-gray-600 text-sm">Анализирую вашу ситуацию и подбираю оптимальную программу</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={24} className="text-blue-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Документы</h3>
              <p className="text-gray-600 text-sm">Помогаю собрать и правильно оформить все необходимые документы</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={24} className="text-purple-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Одобрение</h3>
              <p className="text-gray-600 text-sm">Подаю заявки в банки и получаю лучшие условия для вас</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={24} className="text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
            <h3 className="font-semibold text-lg mb-2">Сделка</h3>
            <p className="text-gray-600 text-sm">Сопровождаю до момента получения ключей от вашего жилья</p>
          </div>
        </div>
      </div>

      {/* RSS Лента новостей */}
      <RSSFeed />

      {/* Районы обслуживания с картой */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Работаю во всех районах Крыма
        </h2>
        
        {/* Фильтры */}
        <div className="mb-6 max-w-2xl mx-auto space-y-4">
          {/* Кнопки фильтров */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="min-w-[100px]"
            >
              <Icon name="Map" size={16} className="mr-2" />
              Все ({crimeaCities.length})
            </Button>
            <Button
              variant={filterType === 'city' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('city')}
              className="min-w-[100px]"
            >
              <Icon name="Building2" size={16} className="mr-2" />
              Города ({crimeaCities.filter(c => c.type === 'city').length})
            </Button>
            <Button
              variant={filterType === 'town' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('town')}
              className="min-w-[100px]"
            >
              <Icon name="Home" size={16} className="mr-2" />
              ПГТ ({crimeaCities.filter(c => c.type === 'town').length})
            </Button>
          </div>
          
          {/* Поиск */}
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Найти населённый пункт..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
          {searchQuery && filteredCities.length > 0 && (
            <Card className="mt-2 p-2 max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    handleCityClick(city.name);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Icon name="MapPin" size={16} className="text-blue-600" />
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {city.type === 'city' ? 'Город' : 'ПГТ'}
                  </span>
                </button>
              ))}
            </Card>
          )}
        </div>
        
        {/* Интерактивная карта */}
        <div className="relative bg-white rounded-xl p-8 mb-8 shadow-lg">
          <svg viewBox="0 0 800 400" className="w-full h-auto">
            <defs>
              {/* Градиенты */}
              <linearGradient id="crimeaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
              </linearGradient>
              
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="100%" stopColor="#a8a29e" />
              </linearGradient>
              
              <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
              </linearGradient>
              
              {/* Тени */}
              <filter id="shadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="2" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Паттерн волн для моря */}
              <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 Q 10 5 20 10 T 40 10" stroke="#0284c7" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M 0 15 Q 10 10 20 15 T 40 15" stroke="#0ea5e9" strokeWidth="0.5" fill="none" opacity="0.2"/>
              </pattern>
            </defs>
            
            {/* Фон моря */}
            <rect x="0" y="0" width="800" height="400" fill="url(#seaGradient)"/>
            <rect x="0" y="0" width="800" height="400" fill="url(#waves)"/>
            
            {/* Контур Крымского полуострова (максимально реалистичный) */}
            <path
              d="M 85 205 
                 C 90 200, 95 195, 105 190
                 L 115 185 Q 125 180, 135 175
                 L 145 168 Q 155 162, 165 157
                 C 175 152, 185 148, 195 145
                 Q 210 141, 225 139
                 L 245 138 Q 260 139, 275 143
                 L 290 148 Q 305 152, 320 156
                 L 335 159 Q 348 161, 360 161
                 L 375 160 Q 388 158, 400 154
                 L 415 149 Q 428 145, 440 143
                 L 455 141 Q 468 140, 480 141
                 L 495 144 Q 508 148, 520 154
                 L 535 162 Q 548 170, 560 178
                 L 575 188 Q 588 196, 600 202
                 L 615 209 Q 628 215, 640 220
                 L 655 227 Q 668 234, 680 242
                 L 692 251 Q 702 260, 710 270
                 L 716 281 Q 720 292, 722 303
                 L 723 315 Q 722 326, 719 336
                 L 714 347 Q 708 357, 700 366
                 L 690 375 Q 679 383, 666 390
                 L 650 397 Q 633 403, 615 407
                 L 595 411 Q 575 414, 555 416
                 L 535 417 Q 515 417, 495 416
                 L 475 414 Q 455 411, 435 407
                 L 415 402 Q 395 397, 376 390
                 L 357 383 Q 339 375, 322 366
                 L 305 356 Q 289 346, 274 335
                 L 260 324 Q 247 313, 235 301
                 L 223 289 Q 212 277, 202 265
                 L 192 252 Q 183 239, 175 226
                 L 168 214 Q 162 202, 157 190
                 L 152 179 Q 148 168, 145 157
                 L 142 146 Q 140 135, 139 124
                 L 138 113 Q 138 102, 139 91
                 L 141 81 Q 144 71, 148 62
                 L 153 53 Q 159 45, 166 38
                 L 174 32 Q 183 27, 193 23
                 Z"
              fill="url(#crimeaGradient)"
              stroke="#047857"
              strokeWidth="2.5"
              filter="url(#shadow)"
              className="transition-all hover:brightness-110"
            />
            
            {/* Крымские горы (южное побережье) */}
            <path
              d="M 400 310 Q 420 305, 440 308 L 460 312 Q 480 315, 500 318 L 520 320 Q 540 321, 560 320 L 580 318 Q 600 315, 615 310"
              fill="url(#mountainGradient)"
              opacity="0.4"
              stroke="#78716c"
              strokeWidth="1"
            />
            <path
              d="M 410 315 Q 430 312, 450 314 L 470 317 Q 490 319, 510 321 L 530 322 Q 550 322, 570 320"
              fill="url(#mountainGradient)"
              opacity="0.3"
              stroke="#a8a29e"
              strokeWidth="0.5"
            />
            
            {/* Керченский полуостров (восточная часть) */}
            <path
              d="M 680 242 L 695 237 Q 710 233, 725 232 L 740 233 Q 753 236, 765 241 L 775 248"
              stroke="#047857"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Тарханкут (западный мыс) */}
            <path
              d="M 145 168 Q 135 163, 128 158 L 122 152"
              stroke="#047857"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Внутренние детали - реки */}
            <path
              d="M 400 220 Q 410 230, 415 245 L 418 260"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 520 210 Q 530 225, 535 240"
              stroke="#0ea5e9"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
            
            {/* Города на карте */}
            {filteredCities.map((city) => {
              const radius = city.size === 'large' ? 20 : city.size === 'medium' ? 12 : 8;
              const fontSize = city.size === 'large' ? '11' : city.size === 'medium' ? '8' : '6';
              const color = city.name === 'Севастополь' ? '#3b82f6' : '#8b5cf6';
              
              return (
                <g 
                  key={city.name} 
                  className="cursor-pointer group" 
                  onClick={() => handleCityClick(city.name)}
                >
                  <circle 
                    cx={city.x} 
                    cy={city.y} 
                    r={radius} 
                    fill={color} 
                    className="group-hover:opacity-100 transition-all" 
                    opacity="0.8" 
                  />
                  {city.size === 'large' && (
                    <circle 
                      cx={city.x} 
                      cy={city.y} 
                      r={radius + 5} 
                      fill="none" 
                      stroke={color} 
                      strokeWidth="2" 
                      className="animate-pulse" 
                    />
                  )}
                  <text 
                    x={city.x} 
                    y={city.y + parseInt(fontSize)/3} 
                    fontSize={fontSize} 
                    fill="white" 
                    fontWeight="bold" 
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {city.name.substring(0, city.size === 'large' ? 3 : 2).toUpperCase()}
                  </text>
                  <title>{city.name}</title>
                </g>
              );
            })}
          </svg>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-gray-700">Севастополь</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-600"></div>
              <span className="text-gray-700">Города Крыма</span>
            </div>
          </div>
        </div>

        {/* Список районов */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Севастополь (Ленинский)')}>
            <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Ленинский</p>
            <p className="text-xs text-gray-500 mt-1">Севастополь</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Севастополь (Гагаринский)')}>
            <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Гагаринский</p>
            <p className="text-xs text-gray-500 mt-1">Севастополь</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Севастополь (Нахимовский)')}>
            <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Нахимовский</p>
            <p className="text-xs text-gray-500 mt-1">Севастополь</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Севастополь (Балаклавский)')}>
            <Icon name="MapPin" size={24} className="text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Балаклавский</p>
            <p className="text-xs text-gray-500 mt-1">Севастополь</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Симферополь')}>
            <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Симферополь</p>
            <p className="text-xs text-gray-500 mt-1">Крым</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Ялта')}>
            <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Ялта</p>
            <p className="text-xs text-gray-500 mt-1">Крым</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Феодосия')}>
            <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Феодосия</p>
            <p className="text-xs text-gray-500 mt-1">Крым</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={() => handleCityClick('Евпатория')}>
            <Icon name="MapPin" size={24} className="text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Евпатория</p>
            <p className="text-xs text-gray-500 mt-1">Крым</p>
          </Card>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-2">
            💡 Нажмите на город на карте или используйте поиск выше
          </p>
          <p className="text-sm text-gray-500">
            Показано населённых пунктов: <span className="font-semibold text-blue-600">{filteredCities.length}</span>
          </p>
        </div>
        
        {/* Форма заявки */}
        {showForm && (
          <Card id="region-form" className="mt-8 p-6 bg-white shadow-xl border-2 border-blue-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="MapPin" size={24} className="text-blue-600" />
                Заявка на ипотеку в городе {selectedCity}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <Icon name="X" size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ваше имя</label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
        )}
      </div>

    </div>
  );
}