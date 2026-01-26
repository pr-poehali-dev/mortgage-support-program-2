import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import AnimatedLogo from '@/components/AnimatedLogo';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import { trackPhoneClick } from '@/services/analytics';

export default function Header() {
  const navigate = useNavigate();
  const theme = useDailyTheme();

  return (
    <header className={`border-b ${theme.headerBg} backdrop-blur-md sticky top-0 z-50`}>
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-80 transition-opacity min-w-0 flex-shrink"
            onClick={() => navigate('/')}
          >
            <AnimatedLogo
              src="https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png"
              alt="Арендодатель"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain flex-shrink-0"
            />
            <div className="hidden sm:block">
              <p className="text-xs md:text-sm text-gray-600 font-medium whitespace-nowrap">Ипотечный центр | Крым, Севастополь</p>
              <p className="text-[10px] md:text-xs text-gray-500">Продажа, Аренда, Оформление</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <ShareButton />
            <a 
              href="tel:+79781281850" 
              onClick={() => trackPhoneClick('header')}
              className="flex items-center gap-1 sm:gap-1.5 text-primary hover:text-primary/80 transition-colors bg-blue-50 hover:bg-blue-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg min-h-[44px]"
            >
              <Icon name="Phone" size={20} className="sm:w-6 sm:h-6" />
              <span className="font-semibold text-xs sm:text-sm whitespace-nowrap hidden xs:inline">Позвонить</span>
            </a>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <a 
                href="https://t.me/+79781281850" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 hover:bg-blue-100 p-2.5 sm:p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Telegram"
              >
                <Icon name="Send" size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a 
                href="https://wa.me/79781281850" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition-colors bg-green-50 hover:bg-green-100 p-2.5 sm:p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="WhatsApp"
              >
                <Icon name="MessageCircle" size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a 
                href="https://maxim.chat/79781281850" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100 p-2.5 sm:p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Max Messenger"
              >
                <Icon name="MessageSquare" size={20} className="sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
          <Button
            onClick={() => navigate('/register')}
            className="h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-semibold"
          >
            <Icon name="Home" className="mr-1 sm:mr-1.5" size={16} />
            <span>Ипотека</span>
          </Button>
          <Button
            onClick={() => navigate('/sell-help')}
            className="h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Icon name="TrendingUp" className="mr-1 sm:mr-1.5" size={16} />
            <span>Помощь продать</span>
          </Button>
          <Button
            onClick={() => navigate('/services')}
            variant="outline"
            className="h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-semibold"
          >
            <Icon name="Briefcase" className="mr-1 sm:mr-1.5" size={16} />
            <span>Услуги</span>
          </Button>
          <Button
            onClick={() => navigate('/rent-help')}
            variant="outline"
            className="h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-semibold border-primary text-primary hover:bg-primary/10"
          >
            <Icon name="HandshakeIcon" className="mr-1 sm:mr-1.5" size={16} />
            <span>Помощь сдать</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
