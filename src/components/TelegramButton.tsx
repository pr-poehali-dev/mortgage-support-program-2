import Icon from '@/components/ui/icon';

export default function TelegramButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Пульсирующие круги */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-full h-full bg-[#0088cc] rounded-full opacity-75"></div>
      </div>
      <div className="absolute inset-0 animate-pulse">
        <div className="w-full h-full bg-[#0088cc] rounded-full opacity-50"></div>
      </div>
      
      {/* Основная кнопка */}
      <a
        href="https://t.me/ipoteka_krym_rf"
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-[#0088cc] hover:bg-[#006ba1] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 group"
        aria-label="Написать в Telegram"
      >
        <Icon name="Send" size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-semibold whitespace-nowrap">Быстрая заявка</span>
      </a>
    </div>
  );
}