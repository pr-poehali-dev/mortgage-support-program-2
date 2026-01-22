import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  detailedInfo: {
    fullDescription: string;
    process: string[];
    benefits: string[];
    included: string[];
    price: string;
  };
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
    ],
    detailedInfo: {
      fullDescription: 'Мы предлагаем комплексную услугу по продаже квартир и комнат в Крыму. Наши специалисты помогут вам правильно оценить недвижимость, подготовить все необходимые документы, найти покупателя и провести сделку безопасно.',
      process: [
        'Бесплатная консультация и оценка объекта',
        'Подготовка документов и фотосессия',
        'Размещение объявлений на всех площадках',
        'Организация показов потенциальным покупателям',
        'Проведение переговоров и заключение сделки',
        'Юридическое сопровождение до регистрации'
      ],
      benefits: [
        'Опыт более 15 лет на рынке недвижимости Крыма',
        'База из более 10 000 потенциальных покупателей',
        'Гарантия продажи в согласованные сроки',
        'Защита от мошенничества и юридических рисков'
      ],
      included: [
        'Профессиональная оценка недвижимости',
        'Качественная фотосъемка объекта',
        'Размещение на всех популярных площадках',
        'Организация и проведение показов',
        'Проверка покупателя',
        'Юридическое сопровождение сделки'
      ],
      price: 'Комиссия 3-5% от стоимости объекта'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Обмен квартиры - сложная операция, требующая координации нескольких сделок. Мы берем на себя все организационные и юридические вопросы, делая процесс максимально простым для вас.',
      process: [
        'Анализ вашей текущей недвижимости',
        'Определение критериев поиска новой квартиры',
        'Поиск вариантов обмена или встречной покупки',
        'Согласование условий со всеми сторонами',
        'Организация альтернативных сделок',
        'Проведение безопасного обмена'
      ],
      benefits: [
        'Экономия времени - один агент ведет все сделки',
        'Синхронизация сроков всех операций',
        'Минимизация финансовых рисков',
        'Помощь с доплатами и расчетами'
      ],
      included: [
        'Оценка обеих квартир',
        'Поиск вариантов обмена',
        'Проверка юридической чистоты',
        'Организация альтернативы',
        'Сопровождение сделок',
        'Оформление документов'
      ],
      price: 'От 50 000 руб за сделку обмена'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Поможем найти и купить квартиру вашей мечты в Крыму. Подберем варианты согласно вашим пожеланиям, проверим юридическую чистоту и проведем безопасную сделку.',
      process: [
        'Выявление ваших потребностей и бюджета',
        'Подбор подходящих вариантов из базы',
        'Организация просмотров недвижимости',
        'Юридическая проверка выбранного объекта',
        'Помощь в переговорах о цене',
        'Сопровождение сделки и регистрации'
      ],
      benefits: [
        'Доступ к скрытым предложениям',
        'Экономия до 15% от стоимости при торге',
        'Проверка на юридическую чистоту',
        'Гарантия безопасной сделки'
      ],
      included: [
        'Персональный подбор объектов',
        'Организация показов',
        'Юридическая проверка документов',
        'Помощь в торге',
        'Проверка продавца',
        'Сопровождение сделки'
      ],
      price: 'От 40 000 руб или 2% от стоимости'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Сдайте квартиру в аренду быстро и выгодно. Мы найдем надежных арендаторов, оформим все документы и будем контролировать процесс аренды.',
      process: [
        'Оценка арендной стоимости',
        'Фотосъемка и размещение объявлений',
        'Поиск и проверка арендаторов',
        'Организация показов',
        'Оформление договора аренды',
        'Передача квартиры по акту'
      ],
      benefits: [
        'Быстрый поиск арендаторов (3-7 дней)',
        'Проверка платежеспособности жильцов',
        'Юридически грамотный договор',
        'Помощь в решении конфликтов'
      ],
      included: [
        'Оценка арендной ставки',
        'Размещение объявлений',
        'Проверка арендаторов',
        'Проведение показов',
        'Подготовка договора',
        'Акт приема-передачи'
      ],
      price: 'Половина месячной арендной платы'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Профессиональное юридическое сопровождение сделок с недвижимостью в Крыму. Мы проверим чистоту объекта, подготовим все документы и обеспечим безопасность на всех этапах от предварительного договора до регистрации права собственности.',
      process: [
        'Юридическая экспертиза документов на объект',
        'Проверка правоустанавливающих документов',
        'Подготовка договора купли-продажи',
        'Организация безопасных расчетов',
        'Подача документов на регистрацию',
        'Получение выписки из ЕГРН'
      ],
      benefits: [
        'Защита от юридических рисков и мошенничества',
        'Опытные юристы со знанием крымской специфики',
        'Гарантия законности всех документов',
        'Страхование сделки от скрытых обременений'
      ],
      included: [
        'Проверка юридической чистоты объекта',
        'Подготовка договора и документов',
        'Консультации на всех этапах',
        'Сопровождение в МФЦ и Росреестре',
        'Организация расчетов через ячейку',
        'Контроль регистрации права собственности'
      ],
      price: 'От 25 000 руб за сделку'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Нужно продать квартиру срочно? Выкупим вашу недвижимость за 3-7 дней по справедливой цене. Мы берем на себя все расходы по оформлению и готовы рассмотреть объекты в любом состоянии, даже с долгами и обременениями.',
      process: [
        'Бесплатный осмотр и оценка квартиры',
        'Согласование цены и условий выкупа',
        'Проверка документов нашими юристами',
        'Подписание предварительного договора',
        'Передача аванса и основной суммы',
        'Регистрация перехода права собственности'
      ],
      benefits: [
        'Деньги на руки в течение 3-7 дней',
        'Покупаем объекты в любом состоянии',
        'Помогаем с долгами и обременениями',
        'Все расходы по сделке берем на себя'
      ],
      included: [
        'Бесплатная оценка недвижимости',
        'Юридическая проверка документов',
        'Оплата всех расходов по сделке',
        'Помощь с выпиской жильцов',
        'Погашение задолженностей',
        'Быстрое оформление документов'
      ],
      price: '85-95% от рыночной стоимости'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Точная оценка рыночной стоимости вашей недвижимости в Крыму. Анализируем текущее состояние рынка, сравниваем с аналогичными объектами и даем рекомендации по увеличению стоимости квартиры перед продажей.',
      process: [
        'Осмотр объекта и фиксация характеристик',
        'Анализ рынка и поиск объектов-аналогов',
        'Оценка состояния и инфраструктуры района',
        'Расчет рыночной стоимости объекта',
        'Подготовка отчета об оценке',
        'Консультация и рекомендации владельцу'
      ],
      benefits: [
        'Актуальная информация о рынке Крыма',
        'Учет всех факторов ценообразования',
        'Рекомендации по улучшению стоимости',
        'Помощь в определении оптимальной цены продажи'
      ],
      included: [
        'Выезд специалиста на объект',
        'Анализ рыночной ситуации',
        'Сравнение с объектами-аналогами',
        'Оценка инвестиционной привлекательности',
        'Письменный отчет об оценке',
        'Консультация по результатам'
      ],
      price: 'От 3 000 руб за объект'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Поможем получить ипотеку на лучших условиях в крупнейших банках России. Подберем программу под ваш доход и ситуацию, соберем документы и будем сопровождать до момента получения ключей от квартиры.',
      process: [
        'Анализ вашего дохода и кредитной истории',
        'Подбор оптимальной ипотечной программы',
        'Помощь в сборе и подготовке документов',
        'Подача заявок в несколько банков',
        'Сопровождение сделки и оценки объекта',
        'Контроль до полного расчета с продавцом'
      ],
      benefits: [
        'Работаем со всеми крупными банками',
        'Знаем все актуальные программы и льготы',
        'Помогаем одобрить ипотеку с низким доходом',
        'Экономия времени на поиске лучших условий'
      ],
      included: [
        'Консультация по ипотечным программам',
        'Расчет ежемесячного платежа',
        'Помощь в сборе документов',
        'Подача заявок в банки',
        'Сопровождение оценки',
        'Контроль одобрения и выдачи кредита'
      ],
      price: 'От 30 000 руб или 1% от суммы кредита'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Специализируемся на сделках с загородной недвижимостью в Крыму: дома, дачи, земельные участки. Знаем все тонкости оформления земли, проверяем юридическую чистоту и помогаем избежать типичных ошибок при покупке загородного жилья.',
      process: [
        'Определение ваших требований к участку/дому',
        'Подбор объектов в нужном районе Крыма',
        'Организация выездов на объекты',
        'Проверка документов на землю и строения',
        'Юридическое сопровождение сделки',
        'Помощь в подключении коммуникаций'
      ],
      benefits: [
        'Эксклюзивные предложения от собственников',
        'Опыт работы с земельными участками в Крыму',
        'Проверка всех рисков и ограничений',
        'Помощь в получении разрешений на строительство'
      ],
      included: [
        'Подбор загородных объектов',
        'Организация выездов на просмотр',
        'Проверка документов на землю',
        'Анализ коммуникаций и подъездных путей',
        'Юридическое сопровождение',
        'Консультации по строительству'
      ],
      price: 'От 50 000 руб или 3% от стоимости'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Профессиональные услуги на рынке коммерческой недвижимости Крыма. Поможем купить, продать или сдать в аренду офисы, магазины, склады, производственные помещения. Оценим коммерческий потенциал и юридические риски.',
      process: [
        'Анализ бизнес-задач и требований к объекту',
        'Поиск подходящих коммерческих помещений',
        'Оценка коммерческого потенциала и окупаемости',
        'Проверка юридической чистоты объекта',
        'Помощь в переговорах и торге',
        'Полное сопровождение сделки'
      ],
      benefits: [
        'Доступ к закрытым предложениям',
        'Анализ проходимости и целевой аудитории',
        'Опыт сделок с крупными объектами',
        'Помощь в оформлении НДС и налоговых вопросах'
      ],
      included: [
        'Анализ коммерческого потенциала',
        'Подбор объектов под бизнес-задачи',
        'Оценка доходности инвестиций',
        'Юридическая проверка',
        'Помощь в переговорах',
        'Сопровождение до регистрации'
      ],
      price: 'От 100 000 руб или 2-4% от стоимости'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Консультируем по инвестициям в недвижимость Крыма с максимальной доходностью. Анализируем рынок, прогнозируем рост цен, подбираем объекты для сдачи в аренду или перепродажи. Помогаем создать инвестиционный портфель.',
      process: [
        'Определение инвестиционных целей и бюджета',
        'Анализ рынка и перспективных районов',
        'Расчет потенциальной доходности объектов',
        'Подбор оптимальных вариантов вложений',
        'Сопровождение покупки инвестобъектов',
        'Помощь в запуске аренды или продаже'
      ],
      benefits: [
        'Инсайдерская информация о росте районов',
        'Расчет реальной доходности с учетом всех расходов',
        'Помощь в формировании портфеля',
        'Мониторинг рынка и рекомендации по продаже'
      ],
      included: [
        'Анализ инвестиционной привлекательности',
        'Расчет доходности и окупаемости',
        'Прогноз роста стоимости',
        'Подбор высокодоходных объектов',
        'Юридическая проверка',
        'Стратегия управления активами'
      ],
      price: 'От 50 000 руб за консультацию'
    }
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
    ],
    detailedInfo: {
      fullDescription: 'Поможем купить квартиру в новостройке напрямую от застройщика с максимальной выгодой. Имеем доступ к эксклюзивным предложениям, помогаем выбрать лучший объект и контролируем процесс строительства до сдачи дома.',
      process: [
        'Анализ всех новостроек в нужном районе',
        'Проверка застройщика и разрешений',
        'Подбор оптимальных квартир и условий',
        'Помощь в оформлении ипотеки (при необходимости)',
        'Контроль хода строительства',
        'Приемка квартиры и регистрация права'
      ],
      benefits: [
        'Скидки от застройщиков до 10%',
        'Выбор лучших квартир на ранних этапах',
        'Проверка надежности застройщика',
        'Контроль качества строительства'
      ],
      included: [
        'Обзор всех новостроек региона',
        'Проверка документов застройщика',
        'Помощь в выборе квартиры и этажа',
        'Сопровождение ипотечной сделки',
        'Контроль сроков сдачи',
        'Помощь в приемке квартиры'
      ],
      price: 'От 50 000 руб или 1-2% от стоимости'
    }
  }
];

export default function Services() {
  const navigate = useNavigate();
  const theme = useDailyTheme();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

                <div className="flex gap-2 mt-5">
                  <Button
                    onClick={() => setSelectedService(service)}
                    variant="outline"
                    className="flex-1"
                  >
                    Подробнее
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  >
                    Заявка
                  </Button>
                </div>
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

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2.5">
                    <Icon name={selectedService.icon} size={28} className="text-white" />
                  </div>
                  <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  {selectedService.detailedInfo.fullDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Стоимость услуги</span>
                    <span className="text-xl font-bold text-primary">
                      {selectedService.detailedInfo.price}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Icon name="ListChecks" size={20} className="text-primary" />
                    Этапы работы
                  </h4>
                  <div className="space-y-2">
                    {selectedService.detailedInfo.process.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Icon name="Star" size={20} className="text-primary" />
                    Преимущества работы с нами
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.detailedInfo.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Icon name="CheckCircle2" size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Icon name="Package" size={20} className="text-primary" />
                    Что входит в услугу
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.detailedInfo.included.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg">
                        <Icon name="Check" size={16} className="text-blue-600 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => navigate('/register')}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    size="lg"
                  >
                    <Icon name="FileText" className="mr-2" size={20} />
                    Оставить заявку
                  </Button>
                  <Button
                    onClick={() => setSelectedService(null)}
                    variant="outline"
                    size="lg"
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}