import { useState } from 'react';
import Icon from '@/components/ui/icon';
import OptimizedImage from '@/components/OptimizedImage';

interface PropertyGalleryProps {
  photos: string[];
  title: string;
}

export default function PropertyGallery({ photos, title }: PropertyGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="space-y-2 sm:space-y-4">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video cursor-pointer group" onClick={() => setIsFullscreen(true)}>
          <OptimizedImage 
            src={photos[currentPhotoIndex]} 
            alt={title}
            className="w-full h-full"
            objectFit="contain"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all">
              <Icon name="Maximize2" size={24} className="text-gray-800" />
            </div>
          </div>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex((currentPhotoIndex - 1 + photos.length) % photos.length);
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all touch-manipulation z-10"
              >
                <Icon name="ChevronLeft" size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIndex((currentPhotoIndex + 1) % photos.length);
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all touch-manipulation z-10"
              >
                <Icon name="ChevronRight" size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>
        
        {photos.length > 1 && (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 sm:gap-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                  index === currentPhotoIndex ? 'border-primary scale-95' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <OptimizedImage src={photo} alt={`${index + 1}`} className="w-full h-full" objectFit="cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Полноэкранный просмотр */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          >
            <Icon name="X" size={24} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={photos[currentPhotoIndex]} 
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
            
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhotoIndex((currentPhotoIndex - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
                >
                  <Icon name="ChevronLeft" size={32} />
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex((currentPhotoIndex + 1) % photos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
                >
                  <Icon name="ChevronRight" size={32} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
