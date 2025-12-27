import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import RSSFeed from '@/components/RSSFeed';
import { useLatestRutubeVideo } from '@/hooks/useLatestRutubeVideo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function HomeTab() {
  const { video } = useLatestRutubeVideo();
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' });

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setFormData({ ...formData, city });
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('region-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `Заявка из города ${formData.city}`,
      description: `${formData.name}, мы свяжемся с вами по номеру ${formData.phone}`,
    });
    setShowForm(false);
    setFormData({ name: '', phone: '', city: '' });
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
        
        {/* Интерактивная карта */}
        <div className="relative bg-white rounded-xl p-8 mb-8 shadow-lg">
          <svg viewBox="0 0 800 400" className="w-full h-auto">
            {/* Контур Крыма (упрощенный) */}
            <path
              d="M 100 200 Q 150 150 250 180 L 350 160 Q 450 140 550 170 L 650 190 Q 700 210 720 250 L 710 280 Q 680 320 620 330 L 500 340 Q 400 350 300 340 L 200 320 Q 130 300 100 260 Z"
              fill="#e0f2fe"
              stroke="#3b82f6"
              strokeWidth="3"
              className="transition-all hover:fill-blue-100"
            />
            
            {/* Севастополь */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Севастополь')}>
              <circle cx="180" cy="280" r="25" fill="#3b82f6" className="group-hover:fill-blue-700 transition-colors" opacity="0.8" />
              <circle cx="180" cy="280" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-pulse" />
              <text x="180" y="285" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">СВ</text>
            </g>
            
            {/* Симферополь */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Симферополь')}>
              <circle cx="400" cy="220" r="20" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="400" y="225" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">СФ</text>
            </g>
            
            {/* Ялта */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Ялта')}>
              <circle cx="480" cy="300" r="18" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="480" y="305" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">ЯЛ</text>
            </g>
            
            {/* Феодосия */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Феодосия')}>
              <circle cx="630" cy="240" r="18" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="630" y="245" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">ФД</text>
            </g>
            
            {/* Евпатория */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Евпатория')}>
              <circle cx="250" cy="160" r="18" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="250" y="165" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">ЕВ</text>
            </g>
            
            {/* Керчь */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Керчь')}>
              <circle cx="700" cy="200" r="16" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="700" y="205" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">КР</text>
            </g>
            
            {/* Алушта */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Алушта')}>
              <circle cx="550" cy="270" r="14" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="550" y="274" fontSize="9" fill="white" fontWeight="bold" textAnchor="middle">АЛ</text>
            </g>
            
            {/* Бахчисарай */}
            <g className="cursor-pointer group" onClick={() => handleCityClick('Бахчисарай')}>
              <circle cx="320" cy="240" r="14" fill="#8b5cf6" className="group-hover:fill-purple-700 transition-colors" opacity="0.8" />
              <text x="320" y="244" fontSize="9" fill="white" fontWeight="bold" textAnchor="middle">БХ</text>
            </g>
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
        <p className="text-center text-gray-600 mt-6">
          💡 Нажмите на город на карте или в списке, чтобы оставить заявку
        </p>
        
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