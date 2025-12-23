import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import RSSFeed from '@/components/RSSFeed';

export default function HomeTab() {
  return (
    <div className="space-y-8">
      {/* Hero секция с видео */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative px-6 sm:px-12 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ипотека в Крыму от 0.1% годовых
              </h1>
              <p className="text-lg sm:text-xl text-blue-50 mb-6 sm:mb-8">
                Профессиональная помощь в получении ипотеки. Работаю со всеми программами господдержки 2025-2026
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://t.me/ipoteka_krym_rf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Icon name="Send" size={20} />
                  Получить консультацию
                </a>
                <a
                  href="tel:+79781281850"
                  className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
                >
                  <Icon name="Phone" size={20} />
                  +7 978 128-18-50
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Видео об ипотеке"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl"
                ></iframe>
              </div>
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Почему выбирают меня
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="BadgeCheck" size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Опыт с 2020 года</h3>
            <p className="text-gray-600 text-sm">Более 500 успешно оформленных ипотек в Крыму</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Percent" size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Лучшие условия</h3>
            <p className="text-gray-600 text-sm">Подбираю программу с минимальной ставкой для вас</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="FileCheck" size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Полное сопровождение</h3>
            <p className="text-gray-600 text-sm">От подачи заявки до получения ключей</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Clock" size={24} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Быстрое оформление</h3>
            <p className="text-gray-600 text-sm">Одобрение за 1-3 дня, выдача за 7-14 дней</p>
          </Card>
        </div>
      </div>

      {/* Программы кратко */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Доступные программы 2025
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5 border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">Семейная ипотека</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">6%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Для семей с детьми. До 12 млн руб на срок до 30 лет</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold">
              <Icon name="Users" size={16} className="mr-1" />
              Первый взнос от 15%
            </div>
          </Card>

          <Card className="p-5 border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">IT ипотека</h3>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">6%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">Для IT специалистов. До 18 млн руб на срок до 30 лет</p>
            <div className="flex items-center text-purple-600 text-sm font-semibold">
              <Icon name="Code" size={16} className="mr-1" />
              Первый взнос от 15%
            </div>
          </Card>

          <Card className="p-5 border-2 border-green-200 hover:border-green-400 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">Сельская ипотека</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">0.1-3%</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">На жилье в сельской местности. До 6 млн руб</p>
            <div className="flex items-center text-green-600 text-sm font-semibold">
              <Icon name="Home" size={16} className="mr-1" />
              Первый взнос от 10%
            </div>
          </Card>
        </div>
      </div>

      {/* Межрегиональные сделки */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Межрегиональные сделки
        </h2>
        <p className="text-center text-gray-600 mb-6">Готовое решение</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-xl transition-all border-2 border-indigo-100 animate-in fade-in slide-in-from-left duration-500" style={{animationDelay: '100ms'}}>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="MapPin" size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Ипотека в любом городе</h3>
            <p className="text-gray-600 text-sm">
              Поможем одобрить ипотеку в нужном городе с учетом специфики региона и требований банков к объекту недвижимости.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all border-2 border-blue-100 animate-in fade-in slide-in-from-bottom duration-500" style={{animationDelay: '200ms'}}>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Monitor" size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Электронные сделки</h3>
            <p className="text-gray-600 text-sm">
              Дистанционная покупка жилья. Приобретайте недвижимость в любом городе РФ, а сделку зарегистрируем электронно.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all border-2 border-green-100 animate-in fade-in slide-in-from-right duration-500" style={{animationDelay: '300ms'}}>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="ShieldCheck" size={24} className="text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Безопасность и надежность</h3>
            <p className="text-gray-600 text-sm">
              Официальные партнеры ведущих банков и крупных застройщиков. Сопроводим сделку до конца. Проверим объект на юридическую чистоту.
            </p>
          </Card>
        </div>
      </div>

      {/* Как работаю */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Как я работаю
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Консультация</h3>
              <p className="text-gray-600 text-sm">Анализирую вашу ситуацию и подбираю оптимальную программу</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={24} className="text-blue-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Документы</h3>
              <p className="text-gray-600 text-sm">Помогаю собрать и правильно оформить все необходимые документы</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={24} className="text-purple-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Одобрение</h3>
              <p className="text-gray-600 text-sm">Подаю заявки в банки и получаю лучшие условия для вас</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={24} className="text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">4</div>
            <h3 className="font-semibold text-lg mb-2">Сделка</h3>
            <p className="text-gray-600 text-sm">Сопровождаю до момента получения ключей от вашего жилья</p>
          </div>
        </div>
      </div>

      {/* RSS Лента новостей */}
      <RSSFeed />

      {/* CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Готовы начать?</h2>
        <p className="text-lg text-blue-50 mb-6">
          Получите бесплатную консультацию и узнайте, какая программа подходит именно вам
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://t.me/ipoteka_krym_rf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg text-lg"
          >
            <Icon name="Send" size={24} />
            Написать в Telegram
          </a>
          <a
            href="tel:+79781281850"
            className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors text-lg"
          >
            <Icon name="Phone" size={24} />
            Позвонить сейчас
          </a>
        </div>
      </Card>
    </div>
  );
}