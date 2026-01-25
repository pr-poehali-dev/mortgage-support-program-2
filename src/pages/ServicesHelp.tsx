import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import SEO from '@/components/SEO';

export default function ServicesHelp() {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: 'Home',
      title: 'Покупка недвижимости',
      description: 'Поможем найти и купить квартиру, дом или участок с юридическим сопровождением'
    },
    {
      icon: 'TrendingUp',
      title: 'Продажа недвижимости',
      description: 'Оценим, разместим объявления, найдём покупателей и проведём сделку'
    },
    {
      icon: 'Key',
      title: 'Аренда недвижимости',
      description: 'Сдадим вашу недвижимость надёжным арендаторам с проверкой'
    },
    {
      icon: 'Calculator',
      title: 'Ипотека',
      description: 'Подберём выгодную программу, соберём документы, получим одобрение'
    },
    {
      icon: 'FileCheck',
      title: 'Юридические услуги',
      description: 'Проверка чистоты сделки, оформление документов, сопровождение'
    },
    {
      icon: 'ClipboardList',
      title: 'Оценка недвижимости',
      description: 'Профессиональная оценка рыночной стоимости вашего объекта'
    }
  ];

  const additionalServices = [
    {
      icon: 'Camera',
      title: 'Фотосъёмка',
      price: 'от 3 000 ₽',
      description: 'Профессиональная фотосъёмка недвижимости для продажи или аренды'
    },
    {
      icon: 'FileText',
      title: 'Приватизация',
      price: 'от 15 000 ₽',
      description: 'Полное сопровождение процесса приватизации жилья'
    },
    {
      icon: 'Users',
      title: 'Перепланировка',
      price: 'от 25 000 ₽',
      description: 'Согласование и узаконивание перепланировки квартиры'
    },
    {
      icon: 'FileSignature',
      title: 'Оформление наследства',
      price: 'от 20 000 ₽',
      description: 'Помощь в оформлении наследственных прав на недвижимость'
    },
    {
      icon: 'Building',
      title: 'Ввод в эксплуатацию',
      price: 'от 30 000 ₽',
      description: 'Оформление разрешения на ввод объекта в эксплуатацию'
    },
    {
      icon: 'Scale',
      title: 'Судебные споры',
      price: 'от 40 000 ₽',
      description: 'Представительство в судах по спорам о недвижимости'
    }
  ];

  const advantages = [
    {
      icon: 'Award',
      title: 'Опыт с 2012 года',
      description: 'Более 10 лет успешной работы на рынке недвижимости Севастополя'
    },
    {
      icon: 'Users',
      title: '500+ довольных клиентов',
      description: 'Помогли сотням семей с покупкой, продажей и арендой недвижимости'
    },
    {
      icon: 'Shield',
      title: 'Юридическая защита',
      description: 'Все сделки проходят тщательную проверку нашими юристами'
    },
    {
      icon: 'Clock',
      title: 'Работаем быстро',
      description: 'Сокращаем сроки оформления благодаря отлаженным процессам'
    }
  ];

  const howWeWork = [
    {
      number: '1',
      title: 'Бесплатная консультация',
      description: 'Обсудим вашу ситуацию и подберём оптимальное решение'
    },
    {
      number: '2',
      title: 'Анализ и планирование',
      description: 'Составим план действий и рассчитаем стоимость услуг'
    },
    {
      number: '3',
      title: 'Выполнение работ',
      description: 'Берём на себя все организационные вопросы и документы'
    },
    {
      number: '4',
      title: 'Результат',
      description: 'Получаете готовое решение вашей задачи под ключ'
    }
  ];

  const whyUs = [
    'Комплексный подход к каждой задаче',
    'Прозрачное ценообразование без скрытых платежей',
    'Персональный менеджер для каждого клиента',
    'Работаем только с проверенными партнёрами',
    'Гарантия юридической чистоты всех сделок',
    'Поддержка клиентов и после завершения сделки'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <SEO
        title="Услуги агентства недвижимости в Севастополе"
        description="Полный спектр услуг: покупка, продажа, аренда, ипотека, юридическое сопровождение. Опыт с 2012 года."
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
              Услуги агентства недвижимости
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Полный спектр услуг для решения любых задач с недвижимостью в Севастополе
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Основные услуги
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainServices.map((service, index) => (
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
              Дополнительные услуги
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name={service.icon} className="text-purple-600" size={20} />
                      </div>
                      <span className="text-lg font-bold text-primary">{service.price}</span>
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Почему выбирают нас
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
              Как мы работаем
            </h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-purple-600 hidden md:block" />
              <div className="space-y-8">
                {howWeWork.map((step, index) => (
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

          <section className="mb-16 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Наши принципы работы
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {whyUs.map((item, index) => (
                <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                    <Icon name="Check" className="text-white" size={16} />
                  </div>
                  <p className="text-gray-700 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Нужна консультация?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Свяжитесь с нами, и мы подберём оптимальное решение вашей задачи
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/services')}
                className="gap-2"
              >
                <Icon name="ClipboardList" size={20} />
                Заказать услугу
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
                  Стоимость зависит от типа услуги. Консультация всегда бесплатна. Комиссия за сделки купли-продажи — 
                  от 2% от стоимости объекта. Юридические услуги — от 15 000 рублей.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Работаете ли вы с иногородними клиентами?
                </h3>
                <p className="text-gray-600">
                  Да, мы работаем с клиентами из любых регионов. Большую часть вопросов можно решить дистанционно, 
                  при необходимости организуем онлайн-показы и электронный документооборот.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Как долго занимает оформление сделки?
                </h3>
                <p className="text-gray-600">
                  Средний срок оформления покупки/продажи — от 2 недель до 1 месяца в зависимости от сложности сделки. 
                  Ипотечные сделки могут занимать до 1,5-2 месяцев.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Предоставляете ли вы гарантии на свои услуги?
                </h3>
                <p className="text-gray-600">
                  Да, мы гарантируем юридическую чистоту всех сделок. В случае возникновения проблем по нашей вине — 
                  берём на себя все расходы по их устранению.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
