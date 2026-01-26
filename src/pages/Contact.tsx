import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Contact() {
  const theme = useDailyTheme();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Контакты - Арендодатель"
        description="Свяжитесь с нами: телефон +7 978 128-18-50, Telegram, WhatsApp. Офис в Севастополе."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <Breadcrumbs />
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
              </div>

              <div>
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-4">Реквизиты</h4>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Полное наименование</p>
                      <p className="font-semibold text-gray-900">ИП Николаев Дмитрий Юрьевич</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">ИНН</p>
                        <p className="font-semibold text-gray-900">920360130683</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ОГРНИП</p>
                        <p className="font-semibold text-gray-900">318920400012912</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Дата регистрации</p>
                      <p className="font-semibold text-gray-900">23 мая 2018 г.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Регион</p>
                      <p className="font-semibold text-gray-900">г. Севастополь</p>
                    </div>
                  </div>
                </div>
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
              <iframe 
                src="https://yandex.ru/map-widget/v1/org/arendodatel/81713615933/reviews/?indoorLevel=1&ll=33.518898%2C44.580696&z=17.2" 
                width="100%" 
                height="400" 
                className="relative border border-gray-300"
                allowFullScreen={true}
                title="Карта офиса"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}