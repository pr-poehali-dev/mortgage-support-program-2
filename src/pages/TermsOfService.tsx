import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Вернуться на главную
          </Button>
          <ShareButton />
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Правила использования сайта
          </h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Общие положения</h2>
              <p>
                Настоящие Правила использования сайта (далее — «Правила») регулируют отношения между владельцем 
                сайта Арендодатель (далее — «Сайт») и пользователями Сайта.
              </p>
              <p>
                Используя Сайт, вы соглашаетесь с настоящими Правилами. Если вы не согласны с какими-либо 
                положениями Правил, пожалуйста, не используйте Сайт.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Использование информации</h2>
              <p>
                Вся информация, размещенная на Сайте, носит исключительно информационный характер и не является 
                публичной офертой, определяемой положениями статьи 437 Гражданского кодекса Российской Федерации.
              </p>
              <p>
                Владелец Сайта не несет ответственности за возможные ошибки или неточности в информации, 
                размещенной на Сайте, и оставляет за собой право вносить изменения в информацию без 
                предварительного уведомления.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Ипотечные услуги</h2>
              <p>
                Сайт предоставляет информацию об ипотечных программах и недвижимости. Окончательные условия 
                ипотечного кредитования определяются банком-кредитором после рассмотрения заявки и проверки 
                кредитоспособности заемщика.
              </p>
              <p>
                Калькуляторы на Сайте предоставляют приблизительные расчеты и могут отличаться от реальных 
                условий кредитования.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Объявления о недвижимости</h2>
              <p>
                Пользователи, размещающие объявления о продаже или аренде недвижимости на Сайте, несут полную 
                ответственность за достоверность предоставленной информации.
              </p>
              <p>
                Владелец Сайта оставляет за собой право удалить объявление без объяснения причин в случае 
                нарушения настоящих Правил или действующего законодательства.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Интеллектуальная собственность</h2>
              <p>
                Все материалы Сайта (текст, графика, логотипы, изображения) являются объектами интеллектуальной 
                собственности и защищены законодательством Российской Федерации.
              </p>
              <p>
                Использование материалов Сайта без письменного разрешения владельца запрещено.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Ограничение ответственности</h2>
              <p>
                Владелец Сайта не несет ответственности за:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Убытки, возникшие в результате использования или невозможности использования Сайта</li>
                <li>Достоверность информации, размещенной пользователями</li>
                <li>Содержание сайтов третьих лиц, на которые размещены ссылки</li>
                <li>Действия банков и других финансовых организаций</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Изменение Правил</h2>
              <p>
                Владелец Сайта оставляет за собой право вносить изменения в настоящие Правила в любое время. 
                Новая редакция Правил вступает в силу с момента ее размещения на Сайте.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Контактная информация</h2>
              <p>
                По всем вопросам, связанным с использованием Сайта, вы можете обратиться:
              </p>
              <ul className="space-y-2">
                <li><strong>Телефон:</strong> +7 978 128-18-50</li>
                <li><strong>Email:</strong> ipoteka_krym@mail.ru</li>
              </ul>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}