import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import SEO from '@/components/SEO';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import { useState } from 'react';

const services = [
  {
    icon: 'Home',
    title: 'Строительство домов под ключ',
    description: 'Возведём дом от фундамента до финишной отделки. Работаем с кирпичом, газоблоком, деревом и каркасными технологиями.',
    badge: 'Популярное'
  },
  {
    icon: 'Layers',
    title: 'Фундаментные работы',
    description: 'Проектирование и закладка фундамента любого типа: ленточный, свайный, плитный. Геологические изыскания.'
  },
  {
    icon: 'Triangle',
    title: 'Кровельные работы',
    description: 'Монтаж крыши любой сложности: двускатная, вальмовая, плоская. Металлочерепица, профнастил, мягкая кровля.'
  },
  {
    icon: 'Zap',
    title: 'Инженерные коммуникации',
    description: 'Подключение и прокладка электрики, водоснабжения, канализации, отопления и вентиляции.'
  },
  {
    icon: 'PaintBucket',
    title: 'Отделочные работы',
    description: 'Внутренняя и внешняя отделка: штукатурка, плитка, укладка полов, гипсокартон, покраска.'
  },
  {
    icon: 'Wrench',
    title: 'Ремонт и реконструкция',
    description: 'Капитальный и косметический ремонт. Перепланировка, усиление конструкций, надстройка этажей.'
  },
  {
    icon: 'TreePine',
    title: 'Благоустройство территории',
    description: 'Ландшафтный дизайн, мощение дорожек, установка ограждений, строительство гаражей и хозпостроек.'
  },
  {
    icon: 'FileSearch',
    title: 'Проектирование и сметы',
    description: 'Разработка архитектурных проектов, рабочей документации и детальных смет. Согласование в госорганах.'
  },
  {
    icon: 'Shield',
    title: 'Строительный контроль',
    description: 'Технический надзор за ходом строительства, приёмка этапов работ, проверка качества материалов.'
  }
];

const advantages = [
  {
    icon: 'Award',
    title: 'Собственная бригада',
    description: 'Штатные специалисты без субподрядчиков — полный контроль качества на каждом этапе'
  },
  {
    icon: 'Clock',
    title: 'Соблюдение сроков',
    description: 'Фиксируем сроки в договоре и несём финансовую ответственность за их нарушение'
  },
  {
    icon: 'BadgeRuble',
    title: 'Фиксированная смета',
    description: 'Цена прописана в договоре и не меняется. Никаких скрытых доплат в процессе работы'
  },
  {
    icon: 'FileCheck',
    title: 'Гарантия на работы',
    description: 'Даём официальную гарантию 3 года на все строительные и отделочные работы'
  },
  {
    icon: 'Calculator',
    title: 'Строительство в ипотеку',
    description: 'Помогаем оформить ипотеку на строительство дома — работаем с ведущими банками'
  },
  {
    icon: 'MapPin',
    title: 'Крым и Севастополь',
    description: 'Знаем местную специфику: грунты, климат, требования к строительству в регионе'
  }
];

const steps = [
  { number: '1', title: 'Консультация и выезд на участок', description: 'Бесплатно оценим участок, расскажем о возможностях и ограничениях, ответим на все вопросы' },
  { number: '2', title: 'Проектирование и смета', description: 'Разработаем проект дома по вашим пожеланиям, составим детальную смету с фиксированной стоимостью' },
  { number: '3', title: 'Заключение договора', description: 'Прописываем все работы, материалы, сроки и стоимость. Никаких устных договорённостей' },
  { number: '4', title: 'Строительство', description: 'Ведём работы строго по проекту. Вы можете посещать стройку в любое время и следить за прогрессом' },
  { number: '5', title: 'Сдача объекта', description: 'Принимаем дом вместе с вами по акту приёмки. Устраняем все замечания до подписания документов' }
];

const houseTypes = [
  { name: 'Кирпичный дом', price: 'от 35 000 ₽/м²', features: ['Долговечность 100+ лет', 'Отличная теплоизоляция', 'Пожаробезопасность'], color: 'from-orange-500 to-red-500' },
  { name: 'Газоблок / пеноблок', price: 'от 25 000 ₽/м²', features: ['Быстрое строительство', 'Хорошая теплоизоляция', 'Доступная цена'], color: 'from-blue-500 to-blue-600' },
  { name: 'Каркасный дом', price: 'от 18 000 ₽/м²', features: ['Минимальные сроки', 'Отличная энергоэффективность', 'Лёгкий фундамент'], color: 'from-green-500 to-emerald-600' },
  { name: 'Дом из бруса', price: 'от 22 000 ₽/м²', features: ['Экологичность', 'Природный микроклимат', 'Красивый внешний вид'], color: 'from-amber-600 to-yellow-600' }
];

const faqItems = [
  { q: 'Сколько времени занимает строительство дома?', a: 'Зависит от типа конструкции и площади. Каркасный дом — от 3–4 месяцев, дом из газоблока — от 6–8 месяцев, кирпичный — от 8–12 месяцев. Точные сроки прописываем в договоре.' },
  { q: 'Можно ли построить дом в ипотеку?', a: 'Да, мы активно работаем с ипотечными программами на строительство. Помогаем подать заявку в банк, подготовить все документы и согласовать проект. Ставки — от 6% по льготным программам.' },
  { q: 'Нужно ли получать разрешение на строительство?', a: 'Для домов до 3 этажей высотой — достаточно уведомления в местную администрацию. Мы берём на себя подготовку всех документов и взаимодействие с госорганами.' },
  { q: 'Вы работаете с материнским капиталом?', a: 'Да, материнский капитал можно использовать на строительство дома. Наши специалисты помогут оформить все необходимые документы для Социального фонда.' },
  { q: 'Даёте ли гарантию на построенный дом?', a: 'Да, мы даём официальную гарантию 3 года на строительные и отделочные работы, закреплённую в договоре. На конструктивные элементы — 5 лет.' }
];

export default function Construction() {
  const navigate = useNavigate();
  const theme = useDailyTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <SEO
        title="Строительство домов под ключ в Севастополе и Крыму"
        description="Строительство домов и коттеджей под ключ в Севастополе и Крыму. Кирпич, газоблок, каркас, брус. Ипотека на строительство. Гарантия 3 года."
        keywords="строительство домов Севастополь, строительство под ключ Крым, построить дом Севастополь, строительство коттеджей, ипотека на строительство"
      />

      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Icon name="ArrowLeft" size={18} />
              <span className="hidden sm:inline">На главную</span>
            </Button>
            <h1 className="text-lg font-bold text-gray-900">Строительство</h1>
            <ShareButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="HardHat" size={16} />
              Строительство в Крыму и Севастополе
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Строительство домов<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">под ключ</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Строим дома и коттеджи в Севастополе и Крыму. Фиксированная смета, официальный договор, 
              гарантия 3 года. Помогаем оформить ипотеку на строительство.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-base px-8" onClick={() => navigate('/register')}>
                <Icon name="MessageSquare" size={20} className="mr-2" />
                Получить консультацию
              </Button>
              <Button size="lg" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50 text-base px-8" asChild>
                <a href="tel:+79781281850">
                  <Icon name="Phone" size={20} className="mr-2" />
                  +7 978 128-18-50
                </a>
              </Button>
            </div>
          </div>

          {/* Типы домов */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Из чего построим дом</h2>
            <p className="text-gray-500 text-center mb-8">Подберём оптимальный материал под ваш бюджет и требования</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {houseTypes.map((type, i) => (
                <Card key={i} className="border-0 shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${type.color}`} />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <p className="text-amber-600 font-bold text-base">{type.price}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {type.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Check" size={14} className="text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Услуги */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Что мы делаем</h2>
            <p className="text-gray-500 text-center mb-8">Полный цикл строительных работ без привлечения субподрядчиков</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <Card key={i} className="border-0 shadow-sm hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name={service.icon} size={22} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-snug">{service.title}</CardTitle>
                        {service.badge && <Badge className="mt-1 bg-amber-100 text-amber-700 text-xs">{service.badge}</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Преимущества */}
          <section className="mb-16 bg-white rounded-2xl p-8 sm:p-10 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Почему выбирают нас</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((adv, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={adv.icon} size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{adv.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{adv.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Как это работает */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Как мы работаем</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-500 hidden md:block" />
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="relative flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10">
                      {step.number}
                    </div>
                    <Card className="flex-1 border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">{step.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Ипотека на строительство */}
          <section className="mb-16 bg-gradient-to-br from-blue-50 to-primary/10 rounded-2xl p-8 sm:p-10 border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Icon name="Percent" size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Ипотека на строительство</h2>
                </div>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Не хватает бюджета? Поможем оформить ипотеку на строительство дома. 
                  Работаем со всеми льготными программами: семейная ипотека, господдержка, сельская ипотека.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Ставка от 6% по льготным программам', 'Материнский капитал как первый взнос', 'Одобрение за 3–5 рабочих дней', 'Сопровождение от заявки до выдачи'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Icon name="CheckCircle" size={16} className="text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => navigate('/register')} className="gap-2">
                  <Icon name="Calculator" size={16} />
                  Рассчитать ипотеку
                </Button>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-4 text-center">
                {[
                  { value: 'от 6%', label: 'Льготная ставка' },
                  { value: '3–5 дн', label: 'Срок одобрения' },
                  { value: '30 лет', label: 'Срок ипотеки' },
                  { value: '100%', label: 'Бесплатно' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Частые вопросы</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <Card key={i} className="border-0 shadow-sm overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{item.q}</span>
                    <Icon name={openFaq === i ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-gray-400 flex-shrink-0" />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t bg-gray-50 pt-4">
                      {item.a}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <Icon name="HardHat" size={48} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Готовы начать строительство?</h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Оставьте заявку — бесплатно выедем на участок, оценим и составим смету без обязательств
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-base px-8" onClick={() => navigate('/register')}>
                <Icon name="Send" size={18} className="mr-2" />
                Оставить заявку
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base px-8" asChild>
                <a href="tel:+79781281850">
                  <Icon name="Phone" size={18} className="mr-2" />
                  Позвонить сейчас
                </a>
              </Button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
