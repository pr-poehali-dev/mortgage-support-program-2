import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Toaster } from '@/components/ui/toaster';
import MortgageQuiz from '@/components/MortgageQuiz';
import MortgageTabsContent from '@/components/MortgageTabsContent';

import StatisticsCounter from '@/components/StatisticsCounter';
import ViewsCounter from '@/components/ViewsCounter';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';

import ThemeIndicator from '@/components/ThemeIndicator';
import DailyHeroImage from '@/components/DailyHeroImage';
import BlogPublicationIndicator from '@/components/BlogPublicationIndicator';
import CookieConsent from '@/components/CookieConsent';
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                navigate('/');
                setActiveTab('home');
              }}
            >
              <img 
                src="https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png" 
                alt="Арендодатель" 
                className="h-10 sm:h-14 w-auto object-contain"
              />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Ипотечный центр | Севастополь, Крым</p>
                <p className="text-xs text-gray-500">Продажа, Аренда, Оформление недвижимости</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date().toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => navigate('/register')}
                  className="h-7 sm:h-10 px-2 sm:px-6 text-[10px] sm:text-sm whitespace-nowrap"
                >
                  <Icon name="UserPlus" className="mr-1 sm:mr-1.5" size={14} />
                  Заявка на ипотеку
                </Button>
                <Button
                  onClick={() => navigate('/add-property')}
                  className="h-7 sm:h-10 px-2 sm:px-6 text-[10px] sm:text-sm whitespace-nowrap bg-green-600 hover:bg-green-700"
                >
                  <Icon name="PlusCircle" className="mr-1 sm:mr-1.5" size={14} />
                  Добавить объявление
                </Button>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="tel:+79781281850" 
                  onClick={() => trackPhoneClick('header')}
                  className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon name="Phone" size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base hidden sm:inline">+7 978 128-18-50</span>
                </a>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a 
                    href="https://t.me/+79781281850" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                    title="Telegram"
                  >
                    <Icon name="Send" size={18} className="sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="https://wa.me/79781281850" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600 transition-colors"
                    title="WhatsApp"
                  >
                    <Icon name="MessageCircle" size={18} className="sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href="viber://chat?number=%2B79781281850" 
                    className="text-purple-500 hover:text-purple-600 transition-colors"
                    title="Viber"
                  >
                    <Icon name="Smartphone" size={18} className="sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-8">
          <TabsList className="!grid grid-cols-5 gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-xl shadow-sm h-auto w-full" style={{gridTemplateRows: 'auto auto auto'}}>
            <TabsTrigger value="home" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '0ms'}}>
              <Icon name="Home" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Главная</span>
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '50ms'}}>
              <Icon name="Building2" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Объекты</span>
              <span className="md:hidden">Объекты</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '100ms'}}>
              <Icon name="ClipboardList" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Программы</span>
              <span className="md:hidden">Прогр.</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '150ms'}}>
              <Icon name="GitCompare" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Сравнение</span>
              <span className="md:hidden">Сравн.</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '200ms'}}>
              <Icon name="Calculator" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Калькулятор</span>
              <span className="md:hidden">Калькул.</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '250ms'}}>
              <Icon name="FileText" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Документы</span>
              <span className="md:hidden">Докум.</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '300ms'}}>
              <Icon name="HelpCircle" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '350ms'}}>
              <Icon name="BookOpen" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Блог</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '400ms'}}>
              <Icon name="Video" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Видео</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-md active:scale-95" style={{animationDelay: '450ms'}}>
              <Icon name="Phone" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Контакты</span>
              <span className="md:hidden">Конт.</span>
            </TabsTrigger>

          </TabsList>

          <MortgageTabsContent onNavigateToCalculator={() => {
            setActiveTab('calculator');
            trackTabChanged('calculator');
          }} />
        </Tabs>
      </main>

      <footer className="bg-gray-900 text-white mt-8 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="space-y-2">
              <img 
                src="https://cdn.poehali.dev/files/с дескриптором белый вариант (1).png" 
                alt="Арендодатель" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
              <div className="text-xs sm:text-sm text-gray-400">
                <p>Ипотечный центр | Севастополь, Крым</p>
                <p>Продажа, Аренда, Оформление недвижимости</p>
              </div>
            </div>
            <div className="text-center md:text-right space-y-3">
              <p className="font-semibold text-sm sm:text-base">Николаев Дмитрий Юрьевич</p>
              
              <div className="space-y-2">
                <a
                  href="tel:+79781281850"
                  onClick={() => trackPhoneClick('footer')}
                  className="text-sm text-gray-300 hover:text-white transition-colors block"
                >
                  +7 978 128-18-50
                </a>
                
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <a
                    href="https://t.me/+79781281850"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                    title="Telegram"
                  >
                    <Icon name="Send" size={16} className="text-white" />
                  </a>
                  <a
                    href="https://wa.me/79781281850"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
                    title="WhatsApp"
                  >
                    <Icon name="MessageCircle" size={16} className="text-white" />
                  </a>
                  <a
                    href="viber://chat?number=%2B79781281850"
                    className="w-8 h-8 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                    title="Viber"
                  >
                    <Icon name="Smartphone" size={16} className="text-white" />
                  </a>
                  <a
                    href="https://maxim.chat/79781281850"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                    title="Max Messenger"
                  >
                    <Icon name="MessageSquare" size={16} className="text-white" />
                  </a>
                </div>
              </div>
              
              <a
                href="mailto:ipoteka_krym@mail.ru"
                className="text-sm text-gray-300 hover:text-white transition-colors block"
              >
                ipoteka_krym@mail.ru
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
              <ViewsCounter />
              <ThemeIndicator inline />
            </div>
            <div className="text-center text-gray-400 text-xs sm:text-sm">
              <p>© 2008-2026 Все права защищены.</p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-gray-400 hover:text-gray-200 transition-colors text-sm underline"
                >
                  Политика конфиденциальности
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-gray-500 hover:text-gray-300 transition-all text-sm px-3 py-1 rounded hover:bg-gray-800 group relative"
                  title="Панель администратора"
                >
                  <Icon name="Settings" size={16} className="inline" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Панель администратора
                  </span>
                </button>
              </div>
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