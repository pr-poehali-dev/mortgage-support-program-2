import Icon from '@/components/ui/icon';

export default function TelegramButton() {
  return (
    <a
      href="https://t.me/ipoteka_krym_rf"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#0088cc] hover:bg-[#006ba1] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 group"
      aria-label="Написать в Telegram"
    >
      <Icon name="Send" size={24} className="group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline font-semibold">Быстрая заявка</span>
    </a>
  );
}
