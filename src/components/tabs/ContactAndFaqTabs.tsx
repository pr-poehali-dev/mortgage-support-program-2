import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqItems } from '@/data/mortgageData';

export default function ContactAndFaqTabs() {
  return (
    <>
      <TabsContent value="faq" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Часто задаваемые вопросы</CardTitle>
            <CardDescription>Ответы на популярные вопросы об ипотеке</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="space-y-4 sm:space-y-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">Контакты</CardTitle>
            <CardDescription>Свяжитесь с нами любым удобным способом</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="User" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Николаев Дмитрий Юрьевич</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href="tel:+79781281850"
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="Phone" className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Телефон</p>
                      <p className="font-semibold text-xl text-gray-900">+7 978 128-18-50</p>
                    </div>
                  </a>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <a
                      href="https://t.me/+79781281850"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                      title="Telegram"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Send" className="text-white" size={20} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Telegram</span>
                    </a>
                    
                    <a
                      href="https://wa.me/79781281850"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                      title="WhatsApp"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="MessageCircle" className="text-white" size={20} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                    </a>
                    
                    <a
                      href="viber://chat?number=%2B79781281850"
                      className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                      title="Viber"
                    >
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Smartphone" className="text-white" size={20} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Viber</span>
                    </a>
                    
                    <a
                      href="https://maxim.chat/79781281850"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
                      title="Max Messenger"
                    >
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="MessageSquare" className="text-white" size={20} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Max</span>
                    </a>
                  </div>
                </div>

                <a
                  href="mailto:ipoteka_krym@mail.ru"
                  className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Mail" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">ipoteka_krym@mail.ru</p>
                  </div>
                </a>

                <a
                  href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="ExternalLink" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Профиль на Домклик</p>
                    <p className="font-semibold text-gray-900">Посмотреть профиль</p>
                  </div>
                </a>

                <a
                  href="https://t.me/ipoteka_krym_rf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="MessageCircle" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telegram канал</p>
                    <p className="font-semibold text-gray-900">Наши новости и советы</p>
                  </div>
                </a>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Мы в социальных сетях</h4>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://vk.com/arendodatel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-600/10 rounded-lg hover:bg-blue-600/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="Share2" className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">ВКонтакте</p>
                      <p className="text-xs text-gray-600">Группа Арендодатель</p>
                    </div>
                  </a>
                  
                  <a
                    href="https://t.me/arendodatel_com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-sky-500/10 rounded-lg hover:bg-sky-500/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="Send" className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Telegram</p>
                      <p className="text-xs text-gray-600">Канал Арендодатель</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-4">Наши услуги</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Подбор оптимальной ипотечной программы</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Помощь в сборе и оформлении документов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Полное сопровождение сделки</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span>Консультации по всем вопросам ипотеки</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Где мы находимся</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="relative overflow-hidden rounded-lg">
                <a 
                  href="https://yandex.ru/maps/org/arendodatel/81713615933/?utm_medium=mapframe&utm_source=maps" 
                  className="text-gray-200 text-xs absolute top-0 z-10"
                >
                  Арендодатель
                </a>
                <a 
                  href="https://yandex.ru/maps/959/sevastopol/category/real_estate_agency/184107503/?utm_medium=mapframe&utm_source=maps" 
                  className="text-gray-200 text-xs absolute top-[14px] z-10"
                >
                  Агентство недвижимости в Севастополе
                </a>
                <a 
                  href="https://yandex.ru/maps/959/sevastopol/category/apartments_in_new_buildings/184107519/?utm_medium=mapframe&utm_source=maps" 
                  className="text-gray-200 text-xs absolute top-[28px] z-10"
                >
                  Квартиры в новостройках в Севастополе
                </a>
                <iframe 
                  src="https://yandex.ru/map-widget/v1/org/arendodatel/81713615933/reviews/?indoorLevel=1&ll=33.518898%2C44.580696&z=17.2" 
                  width="100%" 
                  height="400" 
                  className="relative border border-gray-300"
                  allowFullScreen={true}
                  title="Карта офиса"
                ></iframe>
              </div>

              <div className="mt-4 flex justify-center">
                <iframe 
                  src="https://yandex.ru/sprav/widget/rating-badge/81713615933?type=award" 
                  width="150" 
                  height="50" 
                  style={{ border: 0 }}
                  title="Награда Яндекс.Карт"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Преимущества работы с нами</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="BadgeCheck" className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Экспертность</h4>
                  <p className="text-blue-100">Глубокие знания всех ипотечных программ и актуальных условий</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Экономия времени</h4>
                  <p className="text-blue-100">Берём на себя всю рутинную работу с документами и банками</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Надёжность</h4>
                  <p className="text-blue-100">Гарантируем юридическую чистоту сделки</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="TrendingDown" className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Лучшие условия</h4>
                  <p className="text-blue-100">Помогаем получить максимально выгодные условия кредитования</p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6 mt-6 space-y-3">
                <Button variant="secondary" className="w-full" size="lg" asChild>
                  <a href="https://t.me/ipoteka_krym_rf" target="_blank" rel="noopener noreferrer">
                    <Icon name="MessageCircle" className="mr-2" />
                    Получить консультацию в Telegram
                  </a>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white" asChild>
                    <a href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile" target="_blank" rel="noopener noreferrer">
                      <Icon name="ExternalLink" className="mr-2" size={18} />
                      Домклик
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white" asChild>
                    <a href="tel:+79781281850">
                      <Icon name="Phone" className="mr-2" size={18} />
                      Позвонить
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
      </TabsContent>
    </>
  );
}