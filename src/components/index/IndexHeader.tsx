import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import AnimatedLogo from '@/components/AnimatedLogo';
import { trackPhoneClick } from '@/services/analytics';

interface IndexHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: {
    headerBg: string;
    gradient: string;
  };
}

export default function IndexHeader({ activeTab, setActiveTab, theme }: IndexHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`border-b ${theme.headerBg} backdrop-blur-md sticky top-0 z-50`}>
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            onClick={() => {
              navigate('/');
              setActiveTab('home');
            }}
          >
            <AnimatedLogo
              src="https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png"
              alt="Арендодатель"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain flex-shrink-0"
            />
          </div>

          {/* Основное меню */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
            <button
              onClick={() => {
                navigate('/');
                setActiveTab('home');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'home' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              О нас
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Объекты
            </button>
            <button
              onClick={() => {
                navigate('/');
                setActiveTab('mortgage');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'mortgage' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Ипотека
            </button>
            <button
              onClick={() => navigate('/services')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Услуги
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Документы
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Блог
            </button>
            <button
              onClick={() => navigate('/videos')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Видео
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              FAQ
            </button>
            <button
              onClick={() => navigate('/online-services')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Онлайн услуги
            </button>
          </nav>
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
        {/* 4 основных раздела */}
        <div className="hidden lg:grid grid-cols-4 gap-3 mt-3">
          <button
            onClick={() => {
              navigate('/');
              setActiveTab('mortgage');
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="Percent" size={20} />
            <span>Ипотека</span>
          </button>
          <button
            onClick={() => navigate('/sell-help')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="TrendingUp" size={20} />
            <span>Помощь продать</span>
          </button>
          <button
            onClick={() => navigate('/rent-help')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="HandshakeIcon" size={20} />
            <span>Помощь сдать</span>
          </button>
          <button
            onClick={() => navigate('/services')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Icon name="Briefcase" size={20} />
            <span>Услуги</span>
          </button>
        </div>
        {/* Мобильное меню */}
        <div className="lg:hidden overflow-x-auto">
          <div className="flex gap-2 mt-2 pb-2 min-w-max">
            <button
              onClick={() => navigate('/about')}
              className="px-2 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              О нас
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="px-2 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Объекты
            </button>
            <button
              onClick={() => {
                navigate('/');
                setActiveTab('mortgage');
              }}
              className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'mortgage' ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Ипотека
            </button>
            <button
              onClick={() => navigate('/services')}
              className="px-2 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Услуги
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-2 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Контакты
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}