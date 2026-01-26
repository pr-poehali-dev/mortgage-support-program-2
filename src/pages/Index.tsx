import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Toaster } from '@/components/ui/toaster';
import MortgageQuiz from '@/components/MortgageQuiz';
import MortgageTabsContent from '@/components/MortgageTabsContent';
import PopularServicesSection from '@/components/PopularServicesSection';
import InternalLinks from '@/components/InternalLinks';
import SiteMap from '@/components/SiteMap';
import ShareButton from '@/components/ShareButton';

import StatisticsCounter from '@/components/StatisticsCounter';
import ViewsCounter from '@/components/ViewsCounter';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';

import ThemeIndicator from '@/components/ThemeIndicator';
import DailyHeroImage from '@/components/DailyHeroImage';
import BlogPublicationIndicator from '@/components/BlogPublicationIndicator';
import CookieConsent from '@/components/CookieConsent';
import AnimatedLogo from '@/components/AnimatedLogo';
import { useAutoIndexNow } from '@/hooks/useAutoIndexNow';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import { useSitemapGenerator } from '@/hooks/useSitemapGenerator';
import { trackPhoneClick, trackTabChanged } from '@/services/analytics';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const theme = useDailyTheme();
  useAutoIndexNow();
  useSitemapGenerator();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackTabChanged(tab);
  };

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO />
      <StructuredData />
      <header className={`border-b ${theme.headerBg} backdrop-blur-md sticky top-0 z-50`}>
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div 
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-80 transition-opacity min-w-0 flex-shrink"
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
          <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-3 sm:space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-lg shadow-sm h-auto flex flex-col gap-1">
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5 w-full">
              <TabsTrigger value="home" className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]">
                <Icon name="Home" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Главная</span>
              </TabsTrigger>
              <TabsTrigger 
                value="catalog" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/catalog')}
              >
                <Icon name="Building2" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Объекты</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calculator" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/calculator')}
              >
                <Icon name="Calculator" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Расчёт</span>
              </TabsTrigger>
              <TabsTrigger 
                value="programs" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/programs')}
              >
                <Icon name="ClipboardList" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Прогр.</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]">
                <Icon name="GitCompare" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Сравн.</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]">
                <Icon name="FileText" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Док.</span>
              </TabsTrigger>
            </div>
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5 w-full">
              <TabsTrigger 
                value="blog" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/blog')}
              >
                <Icon name="BookOpen" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Блог</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]">
                <Icon name="Video" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Видео</span>
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/services')}
              >
                <Icon name="Briefcase" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Услуги</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chatgpt" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/chatgpt')}
              >
                <Icon name="Bot" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">ChatGPT</span>
              </TabsTrigger>
              <TabsTrigger 
                value="online-services" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/online-services')}
              >
                <Icon name="ShoppingCart" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Онлайн</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/faq')}
              >
                <Icon name="HelpCircle" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">FAQ</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
                onClick={() => navigate('/contact')}
              >
                <Icon name="Phone" size={20} className="sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Контакты</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <MortgageTabsContent onNavigateToCalculator={() => {
            setActiveTab('calculator');
            trackTabChanged('calculator');
          }} />
        </Tabs>

        <PopularServicesSection />

        <div className="container mx-auto px-3 sm:px-4 mt-8 sm:mt-12 space-y-8">
          <InternalLinks />
          <SiteMap />
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-8 sm:mt-12 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <AnimatedLogo
                src="https://cdn.poehali.dev/files/с дескриптором белый вариант (1).png"
                alt="Арендодатель"
                className="h-12 w-auto object-contain mb-4"
              />
              <p className="text-sm text-gray-400 mb-2">Ипотечный центр</p>
              <p className="text-sm text-gray-400 mb-4">Севастополь, Крым</p>
              <div className="flex gap-2">
                <a
                  href="https://t.me/+79781281850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                  title="Telegram"
                >
                  <Icon name="Send" size={18} className="text-white" />
                </a>
                <a
                  href="https://wa.me/79781281850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <Icon name="MessageCircle" size={18} className="text-white" />
                </a>
                <a
                  href="viber://chat?number=%2B79781281850"
                  className="w-9 h-9 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                  title="Viber"
                >
                  <Icon name="Smartphone" size={18} className="text-white" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Ипотека</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => { setActiveTab('programs'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                    Ипотечные программы
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('calculator'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                    Калькулятор ипотеки
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/register')} className="hover:text-white transition-colors">
                    Подать заявку
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('faq'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                    Вопросы и ответы
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Недвижимость</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => { setActiveTab('catalog'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                    Каталог недвижимости
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/add-property')} className="hover:text-white transition-colors">
                    Добавить объект
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                    Услуги агентства
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Информация</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => { setActiveTab('blog'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                    Блог и статьи
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('videos'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                    Видео
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                    Политика конфиденциальности
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors">
                    Условия использования
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-base mb-4">Контакты</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white font-medium">Николаев Дмитрий Юрьевич</p>
                </div>
                <a
                  href="tel:+79781281850"
                  onClick={() => trackPhoneClick('footer')}
                  className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors font-medium"
                >
                  <Icon name="Phone" size={16} />
                  +7 978 128-18-50
                </a>
                <a
                  href="mailto:ipoteka_krym@mail.ru"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="Mail" size={16} />
                  ipoteka_krym@mail.ru
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <ViewsCounter />
                <ThemeIndicator inline />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                © 2008-2026 Арендодатель. Все права защищены.
              </p>
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                title="Панель администратора"
              >
                <Icon name="Settings" size={16} />
              </button>
            </div>
          </div>
        </div>
      </footer>


      <BlogPublicationIndicator />
      <CookieConsent />
      <Toaster />
    </div>
  );
}