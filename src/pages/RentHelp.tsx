import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import SEO from '@/components/SEO';

export default function RentHelp() {
  const navigate = useNavigate();

  const services = [
    {
      icon: 'Camera',
      title: 'Профессиональная фотосъёмка',
      description: 'Качественные фото вашей недвижимости для привлечения арендаторов'
    },
    {
      icon: 'Users',
      title: 'Проведение показов',
      description: 'Организуем и проведём показы квартиры потенциальным жильцам'
    },
    {
      icon: 'UserCheck',
      title: 'Подбор арендаторов',
      description: 'Найдём проверенных и надёжных жильцов для вашей недвижимости'
    },
    {
      icon: 'FileText',
      title: 'Составление договора',
      description: 'Подготовим юридически грамотный договор аренды'
    },
    {
      icon: 'Headphones',
      title: 'Поддержка 24/7',
      description: 'Помощь на протяжении всего срока аренды'
    },
    {
      icon: 'Shield',
      title: 'Страхование рисков',
      description: 'Защита от возможных рисков при сдаче недвижимости'
    }
  ];

  const advantages = [
    {
      icon: 'Clock',
      title: 'Экономия времени',
      description: 'Мы берём на себя все хлопоты: от фотосъёмки до поиска жильцов'
    },
    {
      icon: 'TrendingUp',
      title: 'Максимальная цена',
      description: 'Поможем определить оптимальную стоимость аренды'
    },
    {
      icon: 'Lock',
      title: 'Безопасность сделки',
      description: 'Проверка арендаторов и юридическое сопровождение'
    },
    {
      icon: 'Sparkles',
      title: 'Качественная подача',
      description: 'Профессиональные фото и описание объекта'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Оставьте заявку',
      description: 'Заполните форму или свяжитесь с нами по телефону'
    },
    {
      number: '2',
      title: 'Оценка недвижимости',
      description: 'Наш специалист осмотрит объект и определит оптимальную цену'
    },
    {
      number: '3',
      title: 'Фотосъёмка и размещение',
      description: 'Сделаем качественные фото и разместим объявление'
    },
    {
      number: '4',
      title: 'Поиск арендаторов',
      description: 'Проведём показы и найдём надёжных жильцов'
    },
    {
      number: '5',
      title: 'Оформление договора',
      description: 'Подготовим все документы и проведём сделку'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <SEO
        title="Поможем сдать недвижимость в Севастополе"
        description="Профессиональная помощь в сдаче квартир и домов в аренду в Севастополе. Фотосъёмка, показы, подбор арендаторов, договор."
      />
      
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={18} />
              Вернуться на главную
            </Button>
            <ShareButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Поможем сдать недвижимость в Севастополе
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Сделаем фото, проведём показы, найдём идеальных жильцов и оформим договор
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Наши услуги
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon name={service.icon} className="text-primary" size={24} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Преимущества работы с нами
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon name={advantage.icon} className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Как это работает
            </h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-purple-600 hidden md:block" />
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10">
                      {step.number}
                    </div>
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Готовы сдать квартиру?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Оставьте заявку, и мы свяжемся с вами в ближайшее время
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="gap-2"
              >
                <Icon name="FileText" size={20} />
                Оставить заявку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('tel:+79780000000', '_self')}
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <Icon name="Phone" size={20} />
                Позвонить нам
              </Button>
            </div>
          </section>

          <section className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Сколько стоят ваши услуги?
                </h3>
                <p className="text-gray-600">
                  Базовые услуги по размещению объявления бесплатны. Дополнительные услуги (фотосъёмка, юридическое сопровождение) оплачиваются отдельно. Свяжитесь с нами для расчёта стоимости.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Как быстро вы найдёте арендаторов?
                </h3>
                <p className="text-gray-600">
                  В среднем поиск занимает от 7 до 14 дней. Срок зависит от типа недвижимости, цены и сезона.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Вы проверяете арендаторов?
                </h3>
                <p className="text-gray-600">
                  Да, мы проверяем документы, платёжеспособность и собираем рекомендации от предыдущих арендодателей.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Что входит в договор аренды?
                </h3>
                <p className="text-gray-600">
                  Договор включает все необходимые условия: срок аренды, стоимость, порядок оплаты, права и обязанности сторон, инвентаризацию имущества.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
