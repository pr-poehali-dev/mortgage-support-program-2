import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import AnimatedLogo from '@/components/AnimatedLogo';

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
                <AnimatedLogo
                  src="https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png"
                  alt="Арендодатель"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Icon name="Building2" size={32} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">О компании</h1>
                  <p className="text-lg text-gray-600 mt-1">Агентство недвижимости "Арендодатель"</p>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <span className="font-semibold text-primary">Работаем с 2008 года</span>, помогая людям находить идеальное жилье и оформлять ипотеку на выгодных условиях в Крыму и Севастополе.
                </p>
                <p className="leading-relaxed">
                  Специализируемся на ипотечных программах с господдержкой и операциях с недвижимостью в Республике Крым. Наш профессиональный подход и индивидуальное сопровождение каждого клиента — залог успешных сделок.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary">16+</div>
                  <div className="text-sm text-gray-600 mt-1">лет опыта</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600 mt-1">ипотечных программ</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">127</div>
                  <div className="text-sm text-gray-600 mt-1">отзывов клиентов</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">0.1%</div>
                  <div className="text-sm text-gray-600 mt-1">ставка по ипотеке</div>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <img
                src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg"
                alt="Арендодатель - Агентство недвижимости"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Contact Person */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
              <Icon name="UserCircle" size={64} className="text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Николаев Дмитрий Юрьевич</h2>
              <p className="text-blue-100 text-lg mb-4">Специалист по ипотеке</p>
              <div className="space-y-2">
                <a 
                  href="tel:+79781281850"
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors justify-center md:justify-start"
                >
                  <Icon name="Phone" size={20} />
                  <span className="font-semibold">+7 978 128-18-50</span>
                </a>
                <a 
                  href="mailto:ipoteka_krym@mail.ru"
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors justify-center md:justify-start"
                >
                  <Icon name="Mail" size={20} />
                  <span>ipoteka_krym@mail.ru</span>
                </a>
                <a 
                  href="https://t.me/ipoteka_krym_rf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors justify-center md:justify-start"
                >
                  <Icon name="Send" size={20} />
                  <span>@ipoteka_krym_rf</span>
                </a>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-1">5.0</div>
              <div className="flex items-center gap-1 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-blue-100">Рейтинг</div>
            </div>
          </div>
        </div>

        {/* Mortgage Programs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/10 rounded-lg p-3">
              <Icon name="Percent" size={28} className="text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Ипотечные программы</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-xl hover:shadow-md transition-shadow border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 rounded-full p-2">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Семейная</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">6%</div>
              <p className="text-sm text-gray-600 mb-3">Для семей с детьми</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Первоначальный взнос от 15%</li>
                <li>• Льготные условия</li>
                <li>• Господдержка</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-xl hover:shadow-md transition-shadow border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 rounded-full p-2">
                  <Icon name="Laptop" size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">IT ипотека</h3>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">6%</div>
              <p className="text-sm text-gray-600 mb-3">Для IT специалистов</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Первоначальный взнос от 15%</li>
                <li>• Специальные условия</li>
                <li>• Поддержка отрасли</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-xl hover:shadow-md transition-shadow border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 rounded-full p-2">
                  <Icon name="TreePine" size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Сельская</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">0.1-3%</div>
              <p className="text-sm text-gray-600 mb-3">Жилье в сельской местности</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Первоначальный взнос от 10%</li>
                <li>• Самая низкая ставка</li>
                <li>• Развитие регионов</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-xl hover:shadow-md transition-shadow border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600 rounded-full p-2">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Военная</h3>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">~9%</div>
              <p className="text-sm text-gray-600 mb-3">Для военнослужащих</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Первоначальный взнос от 15%</li>
                <li>• С господдержкой</li>
                <li>• Накопительная система</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl hover:shadow-md transition-shadow border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gray-600 rounded-full p-2">
                  <Icon name="Home" size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Базовая</h3>
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-2">от 17%</div>
              <p className="text-sm text-gray-600 mb-3">Стандартная программа</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Первоначальный взнос от 20%</li>
                <li>• Для всех категорий</li>
                <li>• Классические условия</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Our Services */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500/10 rounded-lg p-3">
              <Icon name="Briefcase" size={28} className="text-orange-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Наши услуги</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="Home" size={24} className="text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Аренда недвижимости</h3>
              <p className="text-sm text-gray-600">
                Поможем найти квартиру, дом или коммерческое помещение для аренды в Крыму
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="ShoppingCart" size={24} className="text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Покупка и продажа</h3>
              <p className="text-sm text-gray-600">
                Сопровождение сделок купли-продажи недвижимости на всех этапах
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="Percent" size={24} className="text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Ипотечное кредитование</h3>
              <p className="text-sm text-gray-600">
                Подбор ипотечных программ от 0.1%: семейная, IT, военная, сельская
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="Scale" size={24} className="text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Юридическое сопровождение</h3>
              <p className="text-sm text-gray-600">
                Проверка документов, оформление договоров, сопровождение регистрации
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-5 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="Calculator" size={24} className="text-red-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Оценка недвижимости</h3>
              <p className="text-sm text-gray-600">
                Профессиональная оценка рыночной стоимости для сделок и ипотеки
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 p-5 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="Users" size={24} className="text-pink-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Консультации</h3>
              <p className="text-sm text-gray-600">
                Бесплатные консультации по всем вопросам недвижимости и ипотеки
              </p>
            </div>
          </div>
        </div>

        {/* Work Schedule */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/10 rounded-lg p-3">
              <Icon name="Clock" size={28} className="text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Режим работы</h2>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Icon name="Calendar" size={32} className="text-blue-600" />
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">Ежедневно</p>
                <p className="text-2xl font-bold text-blue-600">09:00 - 20:00</p>
                <p className="text-sm text-gray-600 mt-2">Без выходных и праздников</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/10 rounded-lg p-3">
              <Icon name="Award" size={28} className="text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Почему выбирают нас</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex gap-4">
              <div className="bg-blue-100 rounded-full p-3 h-fit">
                <Icon name="CheckCircle" size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Опыт с 2008 года</h3>
                <p className="text-sm text-gray-600">
                  16 лет успешной работы на рынке недвижимости Крыма и Севастополя
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-green-100 rounded-full p-3 h-fit">
                <Icon name="Shield" size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Юридическая чистота</h3>
                <p className="text-sm text-gray-600">
                  Полная проверка документов и сопровождение сделок
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 rounded-full p-3 h-fit">
                <Icon name="Zap" size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Быстрое оформление</h3>
                <p className="text-sm text-gray-600">
                  Оперативная обработка заявок и подготовка документов
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-orange-100 rounded-full p-3 h-fit">
                <Icon name="TrendingDown" size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Низкие ставки</h3>
                <p className="text-sm text-gray-600">
                  Ипотека от 0.1% — самые выгодные условия на рынке
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-red-100 rounded-full p-3 h-fit">
                <Icon name="HeadphonesIcon" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Поддержка 7 дней в неделю</h3>
                <p className="text-sm text-gray-600">
                  Консультации и помощь в удобное для вас время с 9:00 до 20:00
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-pink-100 rounded-full p-3 h-fit">
                <Icon name="Star" size={24} className="text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Рейтинг 5.0</h3>
                <p className="text-sm text-gray-600">
                  Высокие оценки клиентов подтверждают качество наших услуг
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 sm:p-10 text-white shadow-lg text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-lg mb-6 text-white/90">
            Свяжитесь с нами сегодня и получите бесплатную консультацию по недвижимости и ипотеке
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Icon name="FileText" className="mr-2" size={20} />
              Оставить заявку
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Icon name="Phone" className="mr-2" size={20} />
              Связаться с нами
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2008-2025 Арендодатель. Агентство недвижимости в Крыму и Севастополе
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Политика конфиденциальности
            </button>
            <button
              onClick={() => navigate('/terms-of-service')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Условия использования
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}