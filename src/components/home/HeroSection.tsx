import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  video: {
    embed_url: string;
    title: string;
  };
}

export default function HeroSection({ video }: HeroSectionProps) {
  return (
    <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0">
        <img 
          src="https://i.imgur.com/LxyQAtM.jpeg" 
          alt="Крым недвижимость" 
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-blue-500/90 to-purple-600/95"></div>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
              Ипотечный центр в Крыму и Севастополе — Ипотека от 0.1%
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-blue-50 mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
              Профессиональная помощь в получении ипотеки. Работаю со всеми программами господдержки 2025-2026
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
              <a
                href="https://t.me/ipoteka_krym_rf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg text-xs sm:text-sm lg:text-base"
              >
                <Icon name="Send" size={18} className="sm:w-5 sm:h-5" />
                Получить консультацию
              </a>
              <a
                href="tel:+79781281850"
                className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-800 transition-colors text-xs sm:text-sm lg:text-base"
              >
                <Icon name="Phone" size={18} className="sm:w-5 sm:h-5" />
                +7 978 128-18-50
              </a>
            </div>
            
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-2">
              <iframe 
                src="https://yandex.ru/sprav/widget/rating-badge/81713615933?type=rating" 
                width="150" 
                height="50" 
                className="max-w-full border-0"
                title="Рейтинг на Яндекс.Картах"
              ></iframe>
            </div>
          </div>

          <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={video.embed_url}
                title={video.title}
                className="rounded-lg sm:rounded-xl border-0"
                allow="clipboard-write; autoplay"
                allowFullScreen
              ></iframe>
            </div>
            <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-lg sm:rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}