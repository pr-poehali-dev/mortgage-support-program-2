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
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center transition-opacity duration-300"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="text-white text-6xl sm:text-7xl font-bold mb-2">
            {Math.floor(progress)}%
          </div>
          <div className="text-blue-100 text-lg sm:text-xl">
            Загрузка сайта...
          </div>
        </div>

        <div className="w-64 sm:w-80 mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
