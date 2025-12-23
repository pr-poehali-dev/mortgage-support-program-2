import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { trackTelegramClick } from '@/services/metrika-goals';

export default function TelegramButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('telegram-tooltip-seen');
    
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 2000);

      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem('telegram-tooltip-seen', 'true');
      }, 8000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleClick = () => {
    setShowTooltip(false);
    localStorage.setItem('telegram-tooltip-seen', 'true');
    trackTelegramClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Всплывающая подсказка */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white text-gray-900 px-4 py-3 rounded-lg shadow-2xl border border-gray-200 max-w-xs relative">
            <button
              onClick={() => {
                setShowTooltip(false);
                localStorage.setItem('telegram-tooltip-seen', 'true');
              }}
              className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 transition-colors"
              aria-label="Закрыть"
            >
              <Icon name="X" size={14} />
            </button>
            <p className="text-sm font-semibold mb-1">💬 Есть вопросы?</p>
            <p className="text-xs text-gray-600">Напишите мне в Telegram — отвечу быстро!</p>
            <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200"></div>
          </div>
        </div>
      )}

      
      {/* Основная кнопка */}
      <a
        href="https://t.me/ipoteka_krym_rf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative bg-[#0088cc] hover:bg-[#006ba1] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 group"
        aria-label="Написать в Telegram"
      >
        <Icon name="Send" size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-semibold whitespace-nowrap">Быстрая заявка</span>
      </a>
    </div>
  );
}