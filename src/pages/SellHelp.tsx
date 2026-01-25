import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import SEO from '@/components/SEO';
import SellCalculator from '@/components/SellCalculator';

export default function SellHelp() {
  const navigate = useNavigate();

  const services = [
    {
      icon: 'Camera',
      title: 'Профессиональная фотосъёмка',
      description: 'Качественные фото вашей недвижимости для привлечения покупателей'
    },
    {
      icon: 'TrendingUp',
      title: 'Оценка недвижимости',
      description: 'Определим оптимальную рыночную стоимость вашего объекта'
    },
    {
      icon: 'Megaphone',
      title: 'Реклама и продвижение',
      description: 'Разместим объявления на всех популярных площадках'
    },
    {
      icon: 'Users',
      title: 'Проведение показов',
      description: 'Организуем и проведём показы недвижимости потенциальным покупателям'
    },
    {
      icon: 'FileText',
      title: 'Юридическое сопровождение',
      description: 'Полная проверка документов и оформление сделки'
    },
    {
      icon: 'Shield',
      title: 'Безопасная сделка',
      description: 'Гарантируем безопасность всех этапов продажи'
    }
  ];

  const advantages = [
    {
      icon: 'Clock',
      title: 'Быстрая продажа',
      description: 'Продадим недвижимость в оптимальные сроки по максимальной цене'
    },
    {
      icon: 'Award',
      title: 'Опыт и экспертиза',
      description: 'Более 10 лет успешной работы на рынке Севастополя'
    },
    {
      icon: 'Target',
      title: 'Целевые покупатели',
      description: 'Работаем только с реальными и проверенными покупателями'
    },
    {
      icon: 'FileCheck',
      title: 'Юридическая чистота',
      description: 'Проверяем все документы и сопровождаем сделку до конца'
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
      title: 'Оценка и осмотр',
      description: 'Наш специалист осмотрит объект и определит рыночную стоимость'
    },
    {
      number: '3',
      title: 'Фотосъёмка и размещение',
      description: 'Сделаем качественные фото и разместим объявления на площадках'
    },
    {
      number: '4',
      title: 'Поиск покупателей',
      description: 'Проведём показы и найдём надёжного покупателя'
    },
    {
      number: '5',
      title: 'Сопровождение сделки',
      description: 'Подготовим документы и проведём сделку безопасно'
    }
  ];

  const documents = [
    'Свидетельство о праве собственности или выписка из ЕГРН',
    'Технический паспорт объекта',
    'Паспорт собственника',
    'Согласие супруга (если применимо)',
    'Документы о приватизации (если применимо)',
    'Справка об отсутствии задолженностей по коммунальным платежам'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <SEO
        title="Помощь продать недвижимость в Севастополе"
        description="Профессиональная помощь в продаже квартир и домов в Севастополе. Оценка, фотосъёмка, показы, юридическое сопровождение."
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
              Поможем продать недвижимость в Севастополе
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Оценим, сделаем фото, найдём покупателей и проведём сделку под ключ
            </p>
          </div>

          <section className="mb-16">
            <SellCalculator />
          </section>

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

          <section className="mb-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Необходимые документы
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <Icon name="Check" className="text-primary" size={16} />
                  </div>
                  <p className="text-gray-700">{doc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg flex gap-3">
              <Icon name="Info" className="text-primary flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-gray-600">
                Не волнуйтесь, если у вас нет всех документов. Мы поможем собрать и оформить недостающие бумаги.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Готовы продать недвижимость?
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
                onClick={() => window.open('tel:+79781281850', '_self')}
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <Icon name="Phone" size={20} />
                Позвонить нам
              </Button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Сколько стоят ваши услуги?
                </h3>
                <p className="text-gray-600">
                  Стоимость зависит от типа и стоимости недвижимости. Базовая консультация и оценка — бесплатно. 
                  Комиссия за успешную продажу обсуждается индивидуально.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Как быстро вы продадите недвижимость?
                </h3>
                <p className="text-gray-600">
                  Средний срок продажи — от 1 до 3 месяцев. Срок зависит от типа объекта, цены, района и состояния недвижимости.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Могу ли я продать квартиру в ипотеке?
                </h3>
                <p className="text-gray-600">
                  Да, мы поможем продать квартиру с обременением. Проведём все необходимые процедуры с банком и покупателем.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Что входит в юридическое сопровождение?
                </h3>
                <p className="text-gray-600">
                  Проверка документов на юридическую чистоту, подготовка договора купли-продажи, сопровождение регистрации сделки в Росреестре, 
                  расчёты через банковскую ячейку или аккредитив.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}