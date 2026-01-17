import { useState } from 'react';
import { useDailyImage } from '@/hooks/useDailyImage';

export default function DailyHeroImage() {
  const image = useDailyImage();
  const [imgError, setImgError] = useState(false);

  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1600" height="500"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%232563eb;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%233b82f6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%239333ea;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1600" height="500" fill="url(%23grad)"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3E%D0%9A%D1%80%D1%8B%D0%BC %D0%B8 %D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C%3C/text%3E%3C/svg%3E';

  return (
    <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        <img 
          src={imgError ? fallbackImage : image.url}
          alt={image.alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
          <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3">
              {image.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl">Льготные ипотечные программы с господдержкой от 3%</p>
          </div>
        </div>
      </div>
    </div>
  );
}