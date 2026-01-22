import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 300);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-300"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png" 
            alt="Арендодатель"
            className="h-24 sm:h-32 w-auto mx-auto mb-6 object-contain"
            loading="eager"
            fetchpriority="high"
          />
          <div className="text-blue-600 text-6xl sm:text-7xl font-bold mb-2">
            {Math.floor(progress)}%
          </div>
          <div className="text-gray-600 text-lg sm:text-xl">
            Загрузка сайта...
          </div>
        </div>

        <div className="w-64 sm:w-80 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}