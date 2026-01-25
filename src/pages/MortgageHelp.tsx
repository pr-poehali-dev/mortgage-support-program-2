import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import SEO from '@/components/SEO';

export default function MortgageHelp() {
  const navigate = useNavigate();

  const services = [
    {
      icon: 'FileSearch',
      title: 'Подбор программы',
      description: 'Найдём оптимальную ипотечную программу под ваши условия'
    },
    {
      icon: 'Calculator',
      title: 'Расчёт ипотеки',
      description: 'Рассчитаем ежемесячный платёж и переплату по кредиту'
    },
    {
      icon: 'FileText',
      title: 'Сбор документов',
      description: 'Поможем собрать и правильно оформить все необходимые документы'
    },
    {
      icon: 'Send',
      title: 'Подача заявки',
      description: 'Отправим заявки в несколько банков одновременно'
    },
    {
      icon: 'Shield',
      title: 'Одобрение кредита',
      description: 'Повысим шансы на одобрение благодаря опыту работы с банками'
    },
    {
      icon: 'Home',
      title: 'Подбор недвижимости',
      description: 'Найдём подходящую квартиру или дом в рамках одобренной суммы'
    }
  ];

  const advantages = [
    {
      icon: 'TrendingDown',
      title: 'Минимальная ставка',
      description: 'Находим программы с самыми выгодными условиями'
    },
    {
      icon: 'Clock',
      title: 'Быстрое оформление',
      description: 'Сокращаем сроки одобрения благодаря опыту работы с банками'
    },
    {
      icon: 'Award',
      title: 'Высокий процент одобрений',
      description: 'Более 85% заявок получают одобрение'
    },
    {
      icon: 'Headphones',
      title: 'Поддержка 24/7',
      description: 'Консультации и помощь на всех этапах оформления'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Консультация',
      description: 'Обсудим ваши пожелания, доход и возможности по ипотеке'
    },
    {
      number: '2',
      title: 'Подбор программы',
      description: 'Найдём оптимальную программу среди предложений банков'
    },
    {
      number: '3',
      title: 'Сбор документов',
      description: 'Поможем подготовить все необходимые справки и документы'
    },
    {
      number: '4',
      title: 'Подача заявок',
      description: 'Отправим заявки в несколько банков для максимальных шансов'
    },
    {
      number: '5',
      title: 'Одобрение и сделка',
      description: 'Получите одобрение и проведём сделку с юридическим сопровождением'
    }
  ];

  const programs = [
    {
      title: 'Семейная ипотека',
      rate: 'от 6%',
      description: 'Для семей с детьми',
      features: ['Рождение ребёнка после 2018 года', 'Ставка 6% годовых', 'До 12 млн рублей']
    },
    {
      title: 'Господдержка',
      rate: 'от 8%',
      description: 'Для покупки новостройки',
      features: ['Квартира в новостройке', 'Первоначальный взнос от 15%', 'До 6 млн рублей']
    },
    {
      title: 'Военная ипотека',
      rate: 'от 6,5%',
      description: 'Для военнослужащих',
      features: ['Служба от 3 лет', 'Без первоначального взноса', 'Государственная поддержка']
    },
    {
      title: 'Стандартная ипотека',
      rate: 'от 13%',
      description: 'Классические условия',
      features: ['Первичное и вторичное жильё', 'Гибкие условия', 'Срок до 30 лет']
    }
  ];

  const documents = [
    'Паспорт гражданина РФ',
    'СНИЛС',
    'Справка 2-НДФЛ или справка о доходах по форме банка',
    'Трудовая книжка или копия трудового договора',
    'ИНН',
    'Документы на недвижимость (при наличии)',
    'Свидетельство о браке (если применимо)',
    'Свидетельства о рождении детей (если применимо)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <SEO
        title="Помощь с ипотекой в Севастополе"
        description="Профессиональная помощь в оформлении ипотеки в Севастополе. Подбор программы, сбор документов, одобрение кредита."
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
              Поможем оформить ипотеку в Севастополе
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Подберём программу, соберём документы, получим одобрение и проведём сделку
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
              Ипотечные программы
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <span className="text-2xl font-bold text-primary">{program.rate}</span>
                    </div>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="Check" className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
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
                Точный список документов может отличаться в зависимости от выбранного банка и программы. 
                Мы поможем собрать все необходимые справки.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Готовы оформить ипотеку?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Оставьте заявку, и мы подберём лучшие условия для вас
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="gap-2"
              >
                <Icon name="FileText" size={20} />
                Оставить заявку на ипотеку
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
                  Какой минимальный первоначальный взнос?
                </h3>
                <p className="text-gray-600">
                  Минимальный первоначальный взнос зависит от программы — от 0% (военная ипотека) до 15-20% 
                  (стандартные программы). Чем больше взнос, тем ниже ставка.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Сколько времени занимает оформление?
                </h3>
                <p className="text-gray-600">
                  От подачи заявки до получения одобрения — 3-7 дней. Полное оформление сделки — 1-2 недели.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Могу ли я получить ипотеку без официального трудоустройства?
                </h3>
                <p className="text-gray-600">
                  Да, есть программы для ИП, самозанятых и тех, кто получает доходы неофициально. 
                  Условия будут отличаться от стандартных.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Какая максимальная сумма кредита?
                </h3>
                <p className="text-gray-600">
                  Максимальная сумма зависит от вашего дохода, первоначального взноса и выбранной программы. 
                  В среднем — до 80-85% от стоимости недвижимости.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
