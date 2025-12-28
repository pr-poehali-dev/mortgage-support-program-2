import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { crimeaCities } from '@/data/crimea-cities';

export default function RegionsMapSection() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'city' | 'town'>('all');

  const filteredCities = useMemo(() => {
    let cities = crimeaCities;
    
    if (filterType !== 'all') {
      cities = cities.filter(city => city.type === filterType);
    }
    
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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
        Работаю во всех районах Крыма
      </h2>
      
      <div className="mb-6 max-w-2xl mx-auto space-y-4">
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
      
      <div className="relative bg-white rounded-xl p-8 mb-8 shadow-lg">
        <svg viewBox="0 0 800 400" className="w-full h-auto">
          <defs>
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
            
            <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 Q 10 5 20 10 T 40 10" stroke="#0284c7" strokeWidth="1" fill="none" opacity="0.3"/>
              <path d="M 0 15 Q 10 10 20 15 T 40 15" stroke="#0ea5e9" strokeWidth="0.5" fill="none" opacity="0.2"/>
            </pattern>
          </defs>
          
          <rect x="0" y="0" width="800" height="400" fill="url(#seaGradient)"/>
          <rect x="0" y="0" width="800" height="400" fill="url(#waves)"/>
          
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
          
          <path
            d="M 680 242 L 695 237 Q 710 233, 725 232 L 740 233 Q 753 236, 765 241 L 775 248"
            stroke="#047857"
            strokeWidth="2"
            fill="none"
          />
          
          <path
            d="M 145 168 Q 135 163, 128 158 L 122 152"
            stroke="#047857"
            strokeWidth="2"
            fill="none"
          />
          
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
  );
}
