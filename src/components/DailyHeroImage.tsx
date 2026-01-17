import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const images = [
  {
    url: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Панорама Севастополя с видом на бухту',
    title: 'Севастополь — город-герой у моря'
  },
  {
    url: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Набережная Севастополя на закате',
    title: 'Жизнь у Черного моря в Крыму'
  },
  {
    url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Крымские горы и побережье',
    title: 'Крым — жемчужина у моря'
  },
  {
    url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Южный берег Крыма',
    title: 'Недвижимость на ЮБК'
  },
  {
    url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Современные дома в Севастополе',
    title: 'Современное жильё в Севастополе'
  },
  {
    url: 'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Морской вид на побережье Крыма',
    title: 'Дом с видом на море в Крыму'
  },
  {
    url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=2400&h=800&dpr=2',
    alt: 'Уютный дом на побережье',
    title: 'Жильё вашей мечты в Крыму'
  }
];

export default function DailyHeroImage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1600" height="500"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%232563eb;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%233b82f6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%239333ea;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1600" height="500" fill="url(%23grad)"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle"%3E%D0%9A%D1%80%D1%8B%D0%BC %D0%B8 %D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="mb-4 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group">
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
        <img 
          src={imgError ? fallbackImage : currentImage.url}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={() => setImgError(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="w-full px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 md:pb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3 leading-tight">
              {currentImage.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 drop-shadow-md max-w-2xl leading-snug">
              Льготные ипотечные программы с господдержкой от 3%
            </p>
          </div>
        </div>

        <Button
          onClick={goToPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 h-auto"
          size="icon"
        >
          <Icon name="ChevronLeft" size={24} />
        </Button>

        <Button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 h-auto"
          size="icon"
        >
          <Icon name="ChevronRight" size={24} />
        </Button>

        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}