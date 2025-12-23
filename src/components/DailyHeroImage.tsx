import { useDailyImage } from '@/hooks/useDailyImage';

export default function DailyHeroImage() {
  const image = useDailyImage();

  return (
    <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
        <img 
          src={image.url}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
          <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3">
              {image.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl">
              Льготные ипотечные программы с господдержкой от 0.1%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
