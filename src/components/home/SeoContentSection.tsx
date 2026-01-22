import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function SeoContentSection() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-blue-50/30">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ипотека в Крыму и Севастополе в 2025 году
        </h2>
        
        <div className="prose prose-sm sm:prose max-w-none text-gray-700">
          <p className="mb-4 text-base sm:text-lg leading-relaxed">
            Приобретение недвижимости в Крыму становится доступнее благодаря государственным программам поддержки. 
            В 2025 году действуют льготные ипотечные программы с минимальными процентными ставками от 0,1% годовых. 
            Наш ипотечный центр в Севастополе специализируется на подборе оптимальных условий кредитования для жителей и 
            переезжающих в Крымский регион.
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 mt-6">
            Государственные программы ипотечного кредитования
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-bold text-lg mb-2 flex items-center">
                <Icon name="Users" size={20} className="mr-2 text-blue-600" />
                Семейная ипотека 6%
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Программа для семей с детьми позволяет приобрести жилье по льготной ставке 6% годовых. 
                Доступна сумма до 12 миллионов рублей на срок до 30 лет при первоначальном взносе от 15%.
              </p>
              <p className="text-sm text-gray-600">
                Подходит для покупки квартир в новостройках и на вторичном рынке в Севастополе, Симферополе, 
                Ялте и других городах Крыма.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-bold text-lg mb-2 flex items-center">
                <Icon name="Home" size={20} className="mr-2 text-green-600" />
                Сельская ипотека 0.1-3%
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Уникальная программа для приобретения жилья в сельской местности Крыма. Процентная ставка 
                от 0,1% до 3% годовых делает покупку дома максимально доступной.
              </p>
              <p className="text-sm text-gray-600">
                Сумма кредита до 6 миллионов рублей, первоначальный взнос от 10%. Идеально подходит для 
                покупки частных домов и земельных участков с домами в пригородах Севастополя и районах Крыма.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <h4 className="font-bold text-lg mb-2 flex items-center">
                <Icon name="Code" size={20} className="mr-2 text-purple-600" />
                IT-ипотека 6%
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Специальная программа для IT-специалистов с аккредитацией в Минцифры. Ставка 6% годовых 
                на сумму до 18 миллионов рублей.
              </p>
              <p className="text-sm text-gray-600">
                Позволяет приобрести современную квартиру в лучших жилых комплексах Крыма. Первоначальный 
                взнос от 15%, срок кредитования до 30 лет.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-lg mb-2 flex items-center">
                <Icon name="Shield" size={20} className="mr-2 text-orange-600" />
                Военная ипотека
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Для военнослужащих доступна программа накопительно-ипотечной системы. Государство помогает 
                накопить первоначальный взнос и частично оплачивает ежемесячные платежи.
              </p>
              <p className="text-sm text-gray-600">
                В Севастополе и Крыму особенно актуальна для военнослужащих Черноморского флота и других 
                воинских частей региона.
              </p>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 mt-6">
            Особенности покупки недвижимости в Крыму
          </h3>
          
          <p className="mb-4 text-base leading-relaxed">
            Крымский рынок недвижимости имеет свою специфику. При оформлении ипотеки важно учитывать региональные 
            особенности: проверку правоустанавливающих документов, соответствие объекта требованиям банков, 
            наличие коммуникаций. Наш центр имеет опыт работы со всеми районами Крыма и знает все нюансы 
            оформления сделок в регионе.
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 mt-6">
            Этапы получения ипотеки в Севастополе
          </h3>
          
          <ol className="list-decimal list-inside space-y-3 mb-6">
            <li className="text-base leading-relaxed">
              <strong>Консультация и подбор программы</strong> — анализируем вашу финансовую ситуацию, 
              определяем оптимальную ипотечную программу и рассчитываем предварительные условия кредитования.
            </li>
            <li className="text-base leading-relaxed">
              <strong>Сбор документов</strong> — помогаем подготовить полный пакет документов для банка: 
              справки о доходах, документы на объект недвижимости, выписки из реестров.
            </li>
            <li className="text-base leading-relaxed">
              <strong>Подача заявки в банки</strong> — отправляем заявки одновременно в несколько банков 
              для получения лучших условий. Обычно одобрение приходит за 1-3 рабочих дня.
            </li>
            <li className="text-base leading-relaxed">
              <strong>Оценка недвижимости</strong> — организуем работу аккредитованных оценщиков, 
              проверяем юридическую чистоту объекта.
            </li>
            <li className="text-base leading-relaxed">
              <strong>Оформление сделки</strong> — сопровождаем на всех этапах: подписание кредитного 
              договора, регистрация права собственности в Росреестре, передача ключей.
            </li>
          </ol>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 mt-6">
            Популярные районы для покупки жилья
          </h3>
          
          <p className="mb-4 text-base leading-relaxed">
            <strong>Севастополь</strong> — город федерального значения с развитой инфраструктурой. Популярны 
            районы Гагаринский, Ленинский, Нахимовский. Средняя стоимость квадратного метра варьируется 
            от 150 до 300 тысяч рублей в зависимости от района и класса жилья.
          </p>
          
          <p className="mb-4 text-base leading-relaxed">
            <strong>Симферополь</strong> — столица Крыма, крупный транспортный узел. Развитая социальная 
            инфраструктура, доступные цены на жилье от 120 тысяч рублей за квадратный метр.
          </p>
          
          <p className="mb-4 text-base leading-relaxed">
            <strong>Южный берег Крыма</strong> (Ялта, Алушта, Алупка) — престижные курортные города с 
            уникальным климатом. Жилье здесь дороже, но имеет высокий инвестиционный потенциал благодаря 
            возможности сдачи в аренду туристам.
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 mt-6">
            Преимущества работы с нашим центром
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <Icon name="CheckCircle2" size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-base">
                  <strong>Опыт с 2020 года</strong> — более 500 успешно оформленных ипотек в Крыму
                </span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle2" size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-base">
                  <strong>Работаем со всеми банками</strong> — подбираем лучшие условия среди 15+ банков-партнеров
                </span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle2" size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-base">
                  <strong>Индивидуальный подход</strong> — найдем решение даже в сложных ситуациях
                </span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle2" size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-base">
                  <strong>Полное сопровождение</strong> — от консультации до получения ключей
                </span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle2" size={20} className="mr-2 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-base">
                  <strong>Бесплатная консультация</strong> — первичный подбор программы и расчет не требует оплаты
                </span>
              </li>
            </ul>
          </div>

          <p className="text-base leading-relaxed mb-4">
            Позвоните нам по телефону <a href="tel:+79781281850" className="text-blue-600 font-semibold hover:underline">+7 978 128-18-50</a> или 
            напишите в <a href="https://t.me/+79781281850" className="text-blue-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">Telegram</a>, 
            чтобы получить бесплатную консультацию и узнать, на какую сумму ипотеки вы можете рассчитывать. 
            Наш специалист подберет оптимальную программу с учетом ваших доходов и пожеланий к недвижимости.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <Icon name="TrendingUp" size={24} className="mr-2 text-blue-600" />
              Инвестиции в крымскую недвижимость
            </h3>
            <p className="text-base leading-relaxed">
              Покупка недвижимости в Крыму — это не только решение жилищного вопроса, но и выгодная инвестиция. 
              Регион активно развивается: строятся новые дороги, открываются предприятия, растет туристический поток. 
              Стоимость квадратного метра в Севастополе и на Южном берегу Крыма показывает стабильный рост. 
              При грамотном подходе недвижимость в Крыму может приносить доход от сдачи в аренду, особенно в 
              курортных районах в летний сезон.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50/50 to-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Часто задаваемые вопросы об ипотеке в Крыму
        </h2>
        
        <div className="space-y-4">
          <details className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              <span>Можно ли взять ипотеку в Крыму, проживая в другом регионе?</span>
              <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-gray-700 text-base leading-relaxed">
              Да, можно. Многие банки одобряют ипотеку на покупку недвижимости в Крыму для жителей других регионов России. 
              Мы помогаем оформить дистанционные сделки — вы можете подать документы онлайн, а регистрацию провести 
              электронно через Росреестр. Также организуем межрегиональные сделки с полным юридическим сопровождением.
            </p>
          </details>

          <details className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              <span>Какой первоначальный взнос нужен для ипотеки в Крыму?</span>
              <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-gray-700 text-base leading-relaxed">
              Размер первоначального взноса зависит от выбранной программы. Для семейной и IT-ипотеки минимальный 
              взнос составляет 15%, для сельской ипотеки — от 10%, для базовой программы — от 20%. При наличии 
              материнского капитала его можно использовать как первоначальный взнос или для частичного погашения кредита.
            </p>
          </details>

          <details className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              <span>Сколько времени занимает оформление ипотеки?</span>
              <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-gray-700 text-base leading-relaxed">
              Предварительное одобрение ипотеки в банке занимает от 1 до 3 рабочих дней. После выбора объекта 
              недвижимости проводится оценка (1-2 дня) и проверка юридической чистоты (2-3 дня). Далее подписание 
              кредитного договора и регистрация в Росреестре занимают 7-10 дней. В среднем весь процесс от подачи 
              заявки до получения ключей занимает 2-4 недели.
            </p>
          </details>

          <details className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              <span>Какие документы нужны для получения ипотеки?</span>
              <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-gray-700 text-base leading-relaxed">
              Базовый пакет включает: паспорт, СНИЛС, справку 2-НДФЛ или справку по форме банка о доходах за последние 
              6 месяцев, трудовую книжку или копию трудового договора. Для льготных программ могут потребоваться 
              дополнительные документы: свидетельства о рождении детей (семейная ипотека), документ об аккредитации 
              (IT-ипотека). Мы поможем подготовить полный пакет документов и проверим их соответствие требованиям банка.
            </p>
          </details>

          <details className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              <span>Можно ли досрочно погасить ипотеку в Крыму?</span>
              <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-gray-700 text-base leading-relaxed">
              Да, все современные ипотечные программы позволяют досрочное погашение без комиссий и штрафов. Вы можете 
              вносить дополнительные платежи в любое время, тем самым сокращая срок кредита или уменьшая размер 
              ежемесячного платежа. Досрочное погашение особенно выгодно в первые годы ипотеки, когда основная часть 
              платежа идет на погашение процентов.
            </p>
          </details>

          <details className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
              <span>Что делать, если банк отказал в ипотеке?</span>
              <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-3 text-gray-700 text-base leading-relaxed">
              Отказ одного банка не означает невозможность получения ипотеки. У каждого банка свои критерии оценки 
              заемщиков. Мы подаем заявки одновременно в несколько банков, увеличивая шансы на одобрение. Также можем 
              помочь улучшить кредитную историю, подобрать созаемщика или поручителя, найти альтернативные программы 
              кредитования. В нашей практике 85% клиентов получают одобрение, даже после первичных отказов.
            </p>
          </details>
        </div>
      </Card>
    </div>
  );
}
