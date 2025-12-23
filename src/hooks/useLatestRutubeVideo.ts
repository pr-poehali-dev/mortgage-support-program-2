import { useEffect, useState } from 'react';

interface RutubeVideo {
  video_id: string;
  title: string;
  embed_url: string;
}

const DEFAULT_VIDEO: RutubeVideo = {
  video_id: 'cf5c2c281fbbc416c45ee25d552f702c',
  title: 'Видео об ипотеке',
  embed_url: 'https://rutube.ru/play/embed/cf5c2c281fbbc416c45ee25d552f702c'
};

export function useLatestRutubeVideo() {
  const [video, setVideo] = useState<RutubeVideo>(DEFAULT_VIDEO);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/4bf42b28-1491-44aa-a515-434841d027d6');
        
        if (response.ok) {
          const data = await response.json();
          setVideo(data);
        } else {
          setVideo(DEFAULT_VIDEO);
        }
      } catch (error) {
        console.error('Failed to fetch latest Rutube video:', error);
        setVideo(DEFAULT_VIDEO);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestVideo();

    // Update every 30 minutes
    const interval = setInterval(fetchLatestVideo, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { video, isLoading };
}
