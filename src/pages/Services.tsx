import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import { useDailyTheme } from '@/hooks/useDailyTheme';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 'sale',
    title: 'Продажа квартир и комнат',
    description: 'Профессиональная помощь в продаже недвижимости с гарантией результата',
    icon: 'Home',
    features: [
      'Бесплатная консультация и оценка квартиры',
      'Гарантируемые сроки продажи',
      'Полное сопровождение сделки'
    ]
  },
  {
    id: 'exchange',
    title: 'Обмен квартир',
    description: 'Оперативный обмен вашей недвижимости на более подходящий вариант',
    icon: 'RefreshCw',
    features: [
      'Оперативный поиск покупателя',
      'Подбор выгодных предложений',
      'Юридическая поддержка на всех этапах'
    ]
  },
  {
    id: 'buy',
    title: 'Покупка квартир',
    description: 'Подбор идеального жилья в соответствии с вашими требованиями',
    icon: 'Key',
    features: [
      'Подбор вариантов по пожеланиям и бюджету',
      'Организация показов',
      'Проверка всех документов'
    ]
  },
  {
    id: 'rent',
    title: 'Аренда квартир',
    description: 'Поиск надежных арендаторов и управление арендой вашей недвижимости',
    icon: 'Building',
    features: [
      'Подбор добросовестных нанимателей',
      'Показы и переговоры',
      'Урегулирование любых вопросов'
    ]
  },
  {
    id: 'legal',
    title: 'Оформление сделок',
    description: 'Полное юридическое сопровождение сделок с недвижимостью',
    icon: 'FileCheck',
    features: [
      'Юридическая экспертиза каждого объекта',
      'Помощь в оформлении и регистрации',
      'Полное сопровождение всех этапов'
    ]
  },
  {
    id: 'urgent',
    title: 'Срочный выкуп квартир',
    description: 'Быстрая продажа вашей недвижимости в кратчайшие сроки',
    icon: 'Zap',
    features: [
      'Быстрая реализация объекта',
      'Сохранение более 90% стоимости',
      'Конфиденциальность и безопасность'
    ]
  },
  {
    id: 'valuation',
    title: 'Оценка квартир',
    description: 'Профессиональная оценка рыночной стоимости недвижимости',
    icon: 'TrendingUp',
    features: [
      'Предварительное оценивание недвижимости',
      'Определение корректной рыночной стоимости',
      'Рекомендации по предпродажной подготовке'
    ]
  },
  {
    id: 'mortgage',
    title: 'Ипотечное кредитование',
    description: 'Помощь в получении ипотеки на выгодных условиях',
    icon: 'CreditCard',
    features: [
      'Подбор оптимальной программы кредитования',
      'Помощь в сборе документов',
      'Сопровождение до получения ипотеки'
    ]
  },
  {
    id: 'country',
    title: 'Загородная недвижимость',
    description: 'Покупка и продажа загородных домов, дач и земельных участков',
    icon: 'Trees',
    features: [
      'Широкая база загородных объектов',
      'Проверка документов на землю',
      'Организация выезда на объекты'
    ]
  },
  {
    id: 'commercial',
    title: 'Коммерческая недвижимость',
    description: 'Услуги по сделкам с коммерческими объектами недвижимости',
    icon: 'Briefcase',
    features: [
      'Подбор торговых и офисных помещений',
      'Оценка коммерческого потенциала',
      'Юридическое сопровождение сделки'
    ]
  },
  {
    id: 'investment',
    title: 'Инвестиции в недвижимость',
    description: 'Консультации по выгодным инвестициям в недвижимость',
    icon: 'LineChart',
    features: [
      'Анализ инвестиционной привлекательности',
      'Подбор объектов с высокой доходностью',
      'Прогноз роста стоимости'
    ]
  },
  {
    id: 'newbuilding',
    title: 'Новостройки',
    description: 'Помощь в покупке квартир в новостройках от застройщиков',
    icon: 'Building2',
    features: [
      'Доступ к закрытым предложениям',
      'Работа с аккредитованными застройщиками',
      'Контроль строительства и сдачи объекта'
    ]
  }
];

export default function Services() {
  const navigate = useNavigate();
  const theme = useDailyTheme();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Услуги агентства недвижимости | МГСН"
        description="Полный спектр услуг в сфере недвижимости: покупка, продажа, аренда, ипотека, юридическое сопровождение сделок"
      />
      
      <header className={`border-b ${theme.headerBg} backdrop-blur-md sticky top-0 z-50`}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="hidden sm:inline">На главную</span>
            </Button>
            <h1 className="text-lg sm:text-2xl font-bold">Наши услуги</h1>
            <div className="w-20 sm:w-32"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Профессиональные услуги в сфере недвижимости
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Мы предлагаем полный спектр услуг для решения любых задач, связанных с недвижимостью. 
              Наша команда экспертов обеспечит вам надежную поддержку на каждом этапе.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-3 flex-shrink-0">
                    <Icon name={service.icon} size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Icon 
                        name="CheckCircle2" 
                        size={16} 
                        className="text-green-600 mt-0.5 flex-shrink-0" 
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate('/register')}
                  className="w-full mt-5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  Оставить заявку
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-16 bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Не нашли нужную услугу?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 max-w-2xl mx-auto">
              Свяжитесь с нами, и мы подберем индивидуальное решение для ваших задач
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Icon name="FileText" className="mr-2" size={20} />
                Оставить заявку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.querySelector('[value="contact"]');
                    element?.click();
                  }, 100);
                }}
              >
                <Icon name="Phone" className="mr-2" size={20} />
                Контакты
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/20 mt-10 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4 text-center text-sm text-gray-600">
          <p>© 2024 МГСН - Агентство недвижимости. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
