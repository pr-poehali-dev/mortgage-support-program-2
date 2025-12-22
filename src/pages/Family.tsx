import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Family() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="Heart" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Наша Семья
                </h1>
                <p className="text-sm text-gray-600">Любовь, тепло и уют</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                О нас
              </a>
              <a href="#gallery" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Галерея
              </a>
              <a href="#values" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Ценности
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Контакты
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/2feedd38-8591-4aec-b6e4-139194384ddf.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Добро пожаловать в нашу семью
            </h2>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md text-white/95">
              Место, где каждый момент наполнен любовью, теплом и радостью
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-xl text-lg px-8 py-6 h-auto"
            >
              <Icon name="Heart" className="mr-2" size={20} />
              Узнать больше
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              О нашей семье
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мы — дружная семья, которая ценит каждую минуту, проведенную вместе
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Heart" className="text-orange-600" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Любовь</h3>
                <p className="text-gray-600 leading-relaxed">
                  Основа нашей семьи — безусловная любовь и забота друг о друге. Мы поддерживаем и вдохновляем каждого члена семьи.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Home" className="text-rose-600" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Уют</h3>
                <p className="text-gray-600 leading-relaxed">
                  Наш дом — это место, где всегда тепло и уютно. Здесь мы создаем самые теплые воспоминания и традиции.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Users" className="text-amber-600" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Единство</h3>
                <p className="text-gray-600 leading-relaxed">
                  Вместе мы сила! Мы всегда рядом друг с другом в радости и в трудные моменты. Семья — это главное.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 bg-gradient-to-br from-orange-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              Наши моменты
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Фотографии, которые хранят наши самые счастливые воспоминания
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl h-96">
              <img 
                src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4027bf41-6e2b-4c5d-ab35-c4a4227200a3.jpg"
                alt="Семейный уют"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Наш уютный дом</h3>
                  <p className="text-white/90">Место, где рождается тепло</p>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-3xl shadow-2xl h-96">
              <img 
                src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/503675db-b70f-4ae6-9e43-751c6713eb0c.jpg"
                alt="Семейный ужин"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Семейные ужины</h3>
                  <p className="text-white/90">Традиция, которую мы храним</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="values" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              Наши ценности
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              То, что делает нашу семью особенной
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Smile" className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">Радость</h3>
                    <p className="text-gray-600 text-sm">
                      Мы находим счастье в простых вещах и делимся им друг с другом
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-rose-200 hover:border-rose-400 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Handshake" className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">Доверие</h3>
                    <p className="text-gray-600 text-sm">
                      Честность и открытость — основа наших отношений
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Lightbulb" className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">Развитие</h3>
                    <p className="text-gray-600 text-sm">
                      Мы растем и учимся вместе, поддерживая мечты каждого
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="HeartHandshake" className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">Забота</h3>
                    <p className="text-gray-600 text-sm">
                      Мы всегда готовы прийти на помощь и поддержать
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-none shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Icon name="Mail" className="text-white" size={40} />
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Свяжитесь с нами
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Мы всегда рады новым знакомствам и общению!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg h-14 px-8"
                  >
                    <Icon name="Mail" className="mr-2" size={20} />
                    Написать письмо
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-orange-300 hover:bg-orange-50 text-orange-700 h-14 px-8"
                  >
                    <Icon name="Phone" className="mr-2" size={20} />
                    Позвонить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center">
                <Icon name="Heart" className="text-white" size={24} />
              </div>
              <div>
                <p className="font-bold text-lg">Наша Семья</p>
                <p className="text-sm text-gray-400">С любовью из России</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-2">Следите за нашими новостями:</p>
              <div className="flex gap-3 justify-center md:justify-end">
                <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full hover:bg-white/10">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full hover:bg-white/10">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full hover:bg-white/10">
                  <Icon name="Twitter" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Наша Семья. Сделано с любовью ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
