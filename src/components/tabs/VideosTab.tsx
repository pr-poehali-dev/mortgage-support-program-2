import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { TabsContent } from '@/components/ui/tabs';

interface Video {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  created: string;
  embed_url: string;
  views: number;
}

export default function VideosTab() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/4bf42b28-1491-44aa-a515-434841d027d6?page_size=50');
        
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
          if (data.videos && data.videos.length > 0) {
            setSelectedVideo(data.videos[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();

    // Update every 5 minutes
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (isLoading) {
    return (
      <TabsContent value="videos" className="space-y-6">
        <div className="text-center py-12">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-gray-600">Загружаем видео...</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="videos" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Видео об ипотеке</h2>
        <p className="text-gray-600">Полезная информация о программах ипотеки и недвижимости</p>
      </div>

      {selectedVideo && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 animate-in fade-in duration-500">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl mb-4">
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo.embed_url}
              title={selectedVideo.title}
              frameBorder="0"
              allow="clipboard-write; autoplay"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h3>
          {selectedVideo.description && (
            <p className="text-gray-700 text-sm line-clamp-3">{selectedVideo.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Icon name="Eye" size={16} />
              <span>{formatViews(selectedVideo.views)} просмотров</span>
            </div>
            {selectedVideo.duration > 0 && (
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={16} />
                <span>{formatDuration(selectedVideo.duration)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Все видео канала</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <Card
              key={video.video_id}
              className="cursor-pointer hover:shadow-xl transition-all overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => {
                setSelectedVideo(video);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Icon name="Play" size={48} className="text-blue-600" />
                  </div>
                )}
                {video.duration > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                {video.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{video.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    <span>{formatViews(video.views)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Video" className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-600">Видео не найдены</p>
        </div>
      )}
    </TabsContent>
  );
}
