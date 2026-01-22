import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

export default function AdvantagesSection() {
  return (
    <>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          Почему выбирают меня
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="BadgeCheck" size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Опыт с 2020 года</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Более 500 успешно оформленных ипотек в Крыму</p>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="Percent" size={20} className="text-purple-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Лучшие условия</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Подбираю программу с минимальной ставкой для вас</p>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="FileCheck" size={20} className="text-green-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Полное сопровождение</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">От подачи заявки до получения ключей</p>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="Clock" size={20} className="text-orange-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Быстрое оформление</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Одобрение за 1-3 дня, выдача за 7-14 дней</p>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-5 text-center">
          Доступные программы 2025
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          <Card className="p-3 sm:p-5 border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h3 className="font-bold text-sm sm:text-lg">Семейная ипотека</h3>
              <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">6%</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Для семей с детьми. До 12 млн руб на срок до 30 лет</p>
            <div className="flex items-center text-blue-600 text-xs sm:text-sm font-semibold">
              <Icon name="Users" size={14} className="mr-1 sm:w-4 sm:h-4" />
              Первый взнос от 15%
            </div>
          </Card>

          <Card className="p-3 sm:p-5 border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h3 className="font-bold text-sm sm:text-lg">IT ипотека</h3>
              <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">6%</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Для IT специалистов. До 18 млн руб на срок до 30 лет</p>
            <div className="flex items-center text-purple-600 text-xs sm:text-sm font-semibold">
              <Icon name="Code" size={14} className="mr-1 sm:w-4 sm:h-4" />
              Первый взнос от 15%
            </div>
          </Card>

          <Card className="p-3 sm:p-5 border-2 border-green-200 hover:border-green-400 transition-colors">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h3 className="font-bold text-sm sm:text-lg">Сельская ипотека</h3>
              <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">0.1-3%</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">На жилье в сельской местности. До 6 млн руб</p>
            <div className="flex items-center text-green-600 text-xs sm:text-sm font-semibold">
              <Icon name="Home" size={14} className="mr-1 sm:w-4 sm:h-4" />
              Первый взнос от 10%
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 text-center">
          Межрегиональные сделки
        </h2>
        <p className="text-center text-gray-600 text-xs sm:text-base mb-3 sm:mb-5">Готовое решение</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <Card className="p-4 sm:p-6 hover:shadow-xl transition-all border-2 border-indigo-100 animate-in fade-in slide-in-from-left duration-500 [animation-delay:100ms]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="MapPin" size={20} className="text-indigo-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-lg mb-2 sm:mb-3">Ипотека в любом городе</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Поможем одобрить ипотеку в нужном городе с учетом специфики региона и требований банков к объекту недвижимости.
            </p>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-xl transition-all border-2 border-blue-100 animate-in fade-in slide-in-from-bottom duration-500 [animation-delay:200ms]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="Monitor" size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-lg mb-2 sm:mb-3">Электронные сделки</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Дистанционная покупка жилья. Приобретайте недвижимость в любом городе РФ, а сделку зарегистрируем электронно.
            </p>
          </Card>

          <Card className="p-4 sm:p-6 hover:shadow-xl transition-all border-2 border-green-100 animate-in fade-in slide-in-from-right duration-500 [animation-delay:300ms]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="ShieldCheck" size={20} className="text-green-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-lg mb-2 sm:mb-3">Безопасность и надежность</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Официальные партнеры ведущих банков и крупных застройщиков. Сопроводим сделку до конца. Проверим объект на юридическую чистоту.
            </p>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-5 text-center">
          Как я работаю
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="relative">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">1</div>
              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Консультация</h3>
              <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Анализирую вашу ситуацию и подбираю оптимальную программу</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={20} className="text-blue-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">2</div>
              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Документы</h3>
              <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Помогаю собрать и правильно оформить все необходимые документы</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={20} className="text-purple-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">3</div>
              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Одобрение</h3>
              <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Подаю заявки в банки и получаю лучшие условия для вас</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
              <Icon name="ArrowRight" size={20} className="text-green-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">4</div>
            <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Сделка</h3>
            <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Сопровождаю до момента получения ключей от вашего жилья</p>
          </div>
        </div>
      </div>
    </>
  );
}