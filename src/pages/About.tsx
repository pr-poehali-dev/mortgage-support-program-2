import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <SEO />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="font-medium">Назад</span>
            </button>
            <a 
              href="tel:+79781281850"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Phone" size={18} />
              <span className="hidden sm:inline">+7 978 128-18-50</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              {/* Логотип компании */}
              <div className="flex justify-center lg:justify-start mb-6">
                <img
                  src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/bucket/f100d153-e9f4-424a-b930-5fd20c8a7495.jpg"
                  alt="Арендодатель - Агентство недвижимости"
                  className="h-32 sm:h-40 w-auto object-contain"
                />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Агентство недвижимости «Арендодатель» в Севастополе</h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary">17</div>
                  <div className="text-sm text-gray-600 mt-1">лет опыта</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">5+</div>
                  <div className="text-sm text-gray-600 mt-1">лет опыт команды</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600 mt-1">конфиденциальность</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Основные направления деятельности */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 rounded-lg p-3">
              <Icon name="Briefcase" size={28} className="text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Основные направления деятельности</h2>
          </div>

          <div className="space-y-8">
            {/* Сделки с недвижимостью */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Home" size={24} className="text-primary" />
                Сделки с недвижимостью
              </h3>
              <ul className="space-y-2 text-gray-700 ml-8">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Покупка и продажа жилой и коммерческой недвижимости</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Аренда жилых и коммерческих помещений</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Управление недвижимостью с полным сопровождением</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Оценка недвижимости для различных целей</span>
                </li>
              </ul>
            </div>

            {/* Консультационные услуги */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="MessageSquare" size={24} className="text-primary" />
                Консультационные услуги
              </h3>
              <ul className="space-y-2 text-gray-700 ml-8">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Юридическое сопровождение сделок с недвижимостью</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Налоговые консультации</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Финансовое консультирование</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Специализация в строительстве и загородной недвижимости</span>
                </li>
              </ul>
            </div>

            {/* Услуги для загородных объектов */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="TreePine" size={24} className="text-primary" />
                Услуги для загородных объектов
              </h3>
              <ul className="space-y-2 text-gray-700 ml-8">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Консультирование по строительству загородных домов</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Разработка стратегии развития загородных участков</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Сопровождение строительства от проектирования до сдачи объекта</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Экспертная оценка земельных участков и готовых строений</span>
                </li>
              </ul>
            </div>

            {/* Услуги для глэмпингов */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="Tent" size={24} className="text-primary" />
                Услуги для глэмпингов
              </h3>
              <ul className="space-y-2 text-gray-700 ml-8">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Консультирование по организации глэмпинг-проектов</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Анализ локации и потенциала участка</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Разработка концепции и бизнес-плана</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Юридическое сопровождение строительства и открытия</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Преимущества работы с агентством */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 sm:p-10 shadow-lg mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Icon name="Award" size={28} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Преимущества работы с агентством</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Calendar" size={32} className="text-white" />
                <h3 className="font-bold text-lg">17 лет опыта</h3>
              </div>
              <p className="text-blue-100">Работаем на рынке недвижимости с 2008 года</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Users" size={32} className="text-white" />
                <h3 className="font-bold text-lg">Команда профессионалов</h3>
              </div>
              <p className="text-blue-100">Опыт каждого специалиста от 5 лет</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="UserCheck" size={32} className="text-white" />
                <h3 className="font-bold text-lg">Индивидуальный подход</h3>
              </div>
              <p className="text-blue-100">К каждому клиенту и каждой сделке</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="BadgeDollarSign" size={32} className="text-white" />
                <h3 className="font-bold text-lg">Фиксированные цены</h3>
              </div>
              <p className="text-blue-100">На стандартные услуги без скрытых платежей</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="ShieldCheck" size={32} className="text-white" />
                <h3 className="font-bold text-lg">Конфиденциальность</h3>
              </div>
              <p className="text-blue-100">Гарантированная защита ваших данных</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="FileCheck" size={32} className="text-white" />
                <h3 className="font-bold text-lg">Комплексное сопровождение</h3>
              </div>
              <p className="text-blue-100">На всех этапах сделки от начала до конца</p>
            </div>
          </div>
        </div>

        {/* Contact Person */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 rounded-full p-6">
              <Icon name="UserCircle" size={64} className="text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Николаев Дмитрий Юрьевич</h2>
              <p className="text-primary text-lg mb-4">Специалист по ипотеке</p>
              <div className="space-y-2">
                <a 
                  href="tel:+79781281850"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors justify-center md:justify-start"
                >
                  <Icon name="Phone" size={20} />
                  <span className="font-semibold">+7 978 128-18-50</span>
                </a>
                <a 
                  href="mailto:ipoteka_krym@mail.ru"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors justify-center md:justify-start"
                >
                  <Icon name="Mail" size={20} />
                  <span>ipoteka_krym@mail.ru</span>
                </a>
                <a 
                  href="https://t.me/ipoteka_krym_rf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors justify-center md:justify-start"
                >
                  <Icon name="Send" size={20} />
                  <span>@ipoteka_krym_rf</span>
                </a>
              </div>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-1 text-primary">5.0</div>
              <div className="flex items-center gap-1 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-gray-600">Рейтинг</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Готовы начать работу с нами?</h2>
          <p className="text-lg mb-6 text-orange-100">Свяжитесь с нами для консультации по любым вопросам недвижимости</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="gap-2"
              asChild
            >
              <a href="tel:+79781281850">
                <Icon name="Phone" size={20} />
                Позвонить нам
              </a>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="gap-2 bg-white text-orange-600 hover:bg-orange-50 border-white"
              onClick={() => navigate('/programs')}
            >
              <Icon name="CreditCard" size={20} />
              Ипотечные программы
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}