import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useDailyTheme } from '@/hooks/useDailyTheme';

interface Video {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  created: string;
  embed_url: string;
}

export default function Videos() {
  const theme = useDailyTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/4bf42b28-1491-44aa-a515-434841d027d6');
      const data = await response.json();
      
      if (data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

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

        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
            <div className="relative w-full max-w-5xl bg-white rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Icon name="X" size={24} />
              </button>
              <div className="relative pt-[56.25%]">
                <iframe
                  src={selectedVideo.embed_url}
                  frameBorder="0"
                  allow="clipboard-write; autoplay"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-600">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка видео...</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="Video" size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Пока нет видео
              </h3>
              <p className="text-gray-600">
                Скоро здесь появятся полезные материалы
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.video_id} 
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
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
                  {video.duration > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={16} />
                      <span>{formatViews(video.views)} просмотров</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-12 bg-gradient-to-br from-primary to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Подпишитесь на наш канал</CardTitle>
            <CardDescription className="text-white/90 text-base">
              Получайте новые видео о недвижимости, ипотеке и инвестициях первыми
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://rutube.ru/channel/49706639/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                <Icon name="Video" size={20} />
                Rutube канал
              </a>
              <a
                href="https://t.me/+79781281850"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                <Icon name="Send" size={20} />
                Telegram
              </a>
              <a
                href="tel:+79781281850"
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                <Icon name="Phone" size={20} />
                Позвонить
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
