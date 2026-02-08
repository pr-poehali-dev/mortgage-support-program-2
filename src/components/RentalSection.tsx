import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function RentalSection() {
  const navigate = useNavigate();

  const rentalTypes = [
    {
      title: 'Квартиры посуточно',
      icon: 'Home',
      description: 'От студий до 3-комнатных квартир в центре и на побережье',
      price: 'от 1 500 ₽/сутки',
      features: ['Wi-Fi', 'Мебель', 'Бытовая техника', 'Отчётные документы'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Долгосрочная аренда',
      icon: 'Building',
      description: 'Квартиры для длительного проживания от 6 месяцев',
      price: 'от 15 000 ₽/месяц',
      features: ['Договор', 'Без комиссии', 'Проверенные собственники', 'Помощь в оформлении'],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Жильё для командированных',
      icon: 'Briefcase',
      description: 'Комфортное размещение для работы и отдыха',
      price: 'от 2 000 ₽/сутки',
      features: ['Рабочая зона', 'Парковка', 'Рядом с деловым центром', 'Быстрое заселение'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Коттеджи и дома',
      icon: 'House',
      description: 'Загородные дома для семейного отдыха',
      price: 'от 5 000 ₽/сутки',
      features: ['Двор', 'Парковка', 'Мангал', 'Вид на море'],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const advantages = [
    {
      icon: 'Shield',
      title: 'Безопасность сделки',
      description: 'Проверяем документы собственников, гарантируем юридическую чистоту'
    },
    {
      icon: 'Clock',
      title: 'Быстрый подбор',
      description: 'Найдём подходящий вариант за 1-2 дня, заселение в день обращения'
    },
    {
      icon: 'Wallet',
      title: 'Честная цена',
      description: 'Без скрытых комиссий, оплата напрямую собственнику'
    },
    {
      icon: 'HeadphonesIcon',
      title: 'Поддержка 24/7',
      description: 'Решаем любые вопросы в любое время суток'
    },
    {
      icon: 'FileText',
      title: 'Документы для отчёта',
      description: 'Предоставляем все необходимые документы для командировки'
    },
    {
      icon: 'Star',
      title: 'Только проверенное жильё',
      description: 'Все объекты проходят проверку, соответствуют описанию'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Аренда недвижимости в Севастополе
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-6">
            Найдём идеальную квартиру или дом для любых целей: отдых, командировка, длительное проживание
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/catalog')}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
            >
              <Icon name="Search" className="mr-2" size={20} />
              Смотреть каталог
            </Button>
            <a
              href="tel:+79781281850"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-lg transition-colors"
            >
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить сейчас
            </a>
          </div>
        </div>
      </div>

      {/* Rental Types */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Виды аренды
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Подберём недвижимость под ваши задачи и бюджет
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {rentalTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${type.color} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Icon name={type.icon} size={28} />
                  </div>
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                </div>
                <p className="text-white/90 mb-2">{type.description}</p>
                <div className="text-2xl font-bold">{type.price}</div>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <Icon name="CheckCircle" size={18} className="text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advantages */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Почему арендуют через нас
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            16 лет помогаем найти идеальное жильё в Севастополе
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Icon name={advantage.icon} size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {advantage.title}
              </h3>
              <p className="text-gray-600">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Как мы работаем
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Заявка',
              description: 'Позвоните или оставьте заявку на сайте с описанием требований',
              icon: 'Phone'
            },
            {
              step: '2',
              title: 'Подбор вариантов',
              description: 'Подберём 3-5 подходящих объектов за 1-2 часа',
              icon: 'Search'
            },
            {
              step: '3',
              title: 'Просмотр',
              description: 'Организуем просмотр удобным для вас способом',
              icon: 'Eye'
            },
            {
              step: '4',
              title: 'Заселение',
              description: 'Оформляем договор и помогаем с заселением',
              icon: 'Key'
            }
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <div className="mb-3">
                  <Icon name={item.icon} size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <Icon name="ArrowRight" size={24} className="text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 sm:p-10 text-white shadow-xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ищете жильё в Севастополе?
        </h2>
        <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
          Оставьте заявку — подберём лучшие варианты за 1 день
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/catalog')}
            className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6"
          >
            <Icon name="Building2" className="mr-2" size={20} />
            Смотреть объекты
          </Button>
          <a
            href="tel:+79781281850"
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-lg transition-colors"
          >
            <Icon name="Phone" className="mr-2" size={20} />
            +7 978 128-18-50
          </a>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-blue-50 rounded-2xl p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Адрес</h3>
            <p className="text-sm text-gray-600">Севастополь, Крым</p>
          </div>
          <div>
            <Icon name="Phone" size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Телефон</h3>
            <a href="tel:+79781281850" className="text-sm text-blue-600 hover:underline">
              +7 978 128-18-50
            </a>
          </div>
          <div>
            <Icon name="Clock" size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Режим работы</h3>
            <p className="text-sm text-gray-600">Ежедневно 09:00 - 20:00</p>
          </div>
          <div>
            <Icon name="Mail" size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <a href="mailto:ipoteka_krym@mail.ru" className="text-sm text-blue-600 hover:underline">
              ipoteka_krym@mail.ru
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
