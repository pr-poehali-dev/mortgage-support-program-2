import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Videos() {
  const theme = useDailyTheme();

  const videoCategories = [
    {
      title: 'Обзоры недвижимости',
      icon: 'Home',
      videos: [
        {
          title: 'Обзор квартир в Севастополе 2025',
          description: 'Актуальные предложения по продаже квартир в центре города',
          thumbnail: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/cf3a8153-272d-4bad-ab6d-5d0f64e066f0.jpg',
          duration: '12:45',
          views: '2.5K'
        },
        {
          title: 'Коттеджи и дома в Крыму',
          description: 'Лучшие предложения загородной недвижимости',
          thumbnail: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg',
          duration: '15:20',
          views: '1.8K'
        }
      ]
    },
    {
      title: 'Инструкции по ипотеке',
      icon: 'GraduationCap',
      videos: [
        {
          title: 'Как получить ипотеку в 2025 году',
          description: 'Пошаговая инструкция по оформлению ипотеки в Крыму',
          thumbnail: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/7e56d26b-fbcb-4c95-a008-5edc882e651b.jpg',
          duration: '18:30',
          views: '5.2K'
        },
        {
          title: 'Семейная ипотека: все нюансы',
          description: 'Условия получения льготной ипотеки для семей с детьми',
          thumbnail: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/c1e5480b-a628-4f12-9e94-2a8e7f37d3c4.jpg',
          duration: '14:15',
          views: '3.9K'
        }
      ]
    },
    {
      title: 'Советы экспертов',
      icon: 'Lightbulb',
      videos: [
        {
          title: 'Как выбрать квартиру для покупки',
          description: 'На что обратить внимание при выборе недвижимости',
          thumbnail: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg',
          duration: '10:45',
          views: '4.1K'
        },
        {
          title: 'Инвестиции в недвижимость Крыма',
          description: 'Перспективные районы и объекты для инвестирования',
          thumbnail: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/cf3a8153-272d-4bad-ab6d-5d0f64e066f0.jpg',
          duration: '16:50',
          views: '2.7K'
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Видео о недвижимости | Обзоры, инструкции, советы | Арендодатель"
        description="Полезные видео: обзоры недвижимости, инструкции по оформлению ипотеки, советы по покупке и аренде в Севастополе."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Видео о недвижимости
          </h1>
          <p className="text-lg text-gray-600">
            Полезные материалы об ипотеке, покупке и аренде недвижимости в Крыму
          </p>
        </div>

        {videoCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name={category.icon} className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.videos.map((video, videoIndex) => (
                <Card key={videoIndex} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Play" className="text-primary ml-1" size={32} />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Icon name="Eye" size={16} />
                        <span>{video.views} просмотров</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Подпишитесь на наш канал</CardTitle>
            <CardDescription className="text-white/90 text-base">
              Получайте новые видео о недвижимости, ипотеке и инвестициях первыми
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://t.me/+79781281850"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                <Icon name="Send" size={20} />
                Telegram канал
              </a>
              <a
                href="tel:+79781281850"
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                <Icon name="Phone" size={20} />
                Задать вопрос
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
