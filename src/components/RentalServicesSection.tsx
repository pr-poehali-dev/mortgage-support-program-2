import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function RentalServicesSection() {
  const navigate = useNavigate();

  const rentalTypes = [
    {
      id: 'apartments',
      title: 'Квартиры',
      icon: 'Building',
      description: 'Однокомнатные и многокомнатные квартиры в различных районах Севастополя',
      priceRange: 'от 25 000 ₽/мес',
      features: [
        'Балаконы и Центр города',
        'Новостройки и вторичка',
        'Мебелью и техникой'
      ],
      color: 'from-blue-50 to-blue-100/50 border-blue-200'
    },
    {
      id: 'houses',
      title: 'Дома и коттеджи',
      icon: 'Home',
      description: 'Частные дома с участком для семейного проживания',
      priceRange: 'от 40 000 ₽/мес',
      features: [
        'Собственный двор',
        'Тихие районы',
        'Парковочное место'
      ],
      color: 'from-green-50 to-green-100/50 border-green-200'
    },
    {
      id: 'commercial',
      title: 'Коммерческая недвижимость',
      icon: 'Store',
      description: 'Офисы, торговые площади, склады для бизнеса',
      priceRange: 'от 50 000 ₽/мес',
      features: [
        'Проходимые места',
        'Развитая инфраструктура',
        'Гибкие условия'
      ],
      color: 'from-purple-50 to-purple-100/50 border-purple-200'
    },
    {
      id: 'shortterm',
      title: 'Посуточная аренда',
      icon: 'Calendar',
      description: 'Квартиры и апартаменты для краткосрочного проживания',
      priceRange: 'от 2 500 ₽/сутки',
      features: [
        'От 1 суток',
        'Туристам и командированным',
        'У моря и в центре'
      ],
      color: 'from-orange-50 to-orange-100/50 border-orange-200'
    }
  ];

  const benefits = [
    {
      icon: 'Shield',
      title: 'Юридическая чистота',
      description: 'Проверяем все документы и собственников'
    },
    {
      icon: 'FileCheck',
      title: 'Безопасные договоры',
      description: 'Составляем и регистрируем договоры аренды'
    },
    {
      icon: 'Search',
      title: 'Подбор под запрос',
      description: 'Найдем жилье по вашим критериям за 1-3 дня'
    },
    {
      icon: 'HeadphonesIcon',
      title: 'Поддержка 24/7',
      description: 'Решаем вопросы на всех этапах аренды'
    }
  ];

  return (
    <section className="mb-8 sm:mb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-12 shadow-xl mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Icon name="Home" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Аренда недвижимости в Севастополе</h2>
              <p className="text-blue-100 text-lg mt-1">Надежно • Быстро • </p>
            </div>
          </div>
          <p className="text-lg text-white/90 mb-6 max-w-3xl">
            Помогаем арендаторам и собственникам находить друг друга с 2008 года. Проверенные объекты, прозрачные условия, профессиональное сопровождение.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/rental')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Icon name="Building2" className="mr-2" size={20} />
              Смотреть каталог
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Icon name="Phone" className="mr-2" size={20} />
              Получить консультацию
            </Button>
          </div>
        </div>
      </div>

      {/* Rental Types */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <Icon name="Key" size={28} className="text-blue-600" />
          Что мы сдаем в аренду
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {rentalTypes.map((type) => (
            <div 
              key={type.id}
              className={`bg-gradient-to-br ${type.color} rounded-xl p-5 border-2 hover:shadow-lg transition-all cursor-pointer group`}
              onClick={() => navigate('/rental')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-white rounded-lg p-3">
                  <Icon name={type.icon} size={28} className="text-blue-600" />
                </div>
                <Icon name="ArrowUpRight" size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h4 className="font-bold text-lg mb-2">{type.title}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {type.description}
              </p>
              <p className="text-lg font-bold text-blue-600 mb-3">{type.priceRange}</p>

              <div className="space-y-1.5">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon 
                      name="Check" 
                      size={14} 
                      className="text-green-600 mt-0.5 flex-shrink-0" 
                    />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <Icon name="Info" size={24} className="text-blue-600 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <strong>Работаем со всеми районами Севастополя:</strong> Балаконы, Гагаринский, Ленинский, Нахимовский районы, а также Балаклава, Инкерман и пригороды.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <Icon name="Award" size={28} className="text-green-600" />
          Почему выбирают нас
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 h-fit">
                <Icon name={benefit.icon} size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <Icon name="ListChecks" size={28} className="text-purple-600" />
          Как мы работаем
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Заявка',
              description: 'Оставляете заявку или звоните. Рассказываете о своих требованиях',
              icon: 'Phone'
            },
            {
              step: '2',
              title: 'Подбор',
              description: 'Подбираем подходящие варианты из нашей базы за 1-3 дня',
              icon: 'Search'
            },
            {
              step: '3',
              title: 'Просмотр',
              description: 'Организуем показы объектов в удобное для вас время',
              icon: 'Eye'
            },
            {
              step: '4',
              title: 'Договор',
              description: 'Оформляем договор аренды и передаем ключи',
              icon: 'FileSignature'
            }
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                    {item.step}
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2 w-12 h-12 flex items-center justify-center">
                    <Icon name={item.icon} size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">Готовы начать поиск жилья?</p>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-6"
          >
            <Icon name="FileText" className="mr-2" size={20} />
            Оставить заявку на подбор
          </Button>
        </div>
      </div>
    </section>
  );
}