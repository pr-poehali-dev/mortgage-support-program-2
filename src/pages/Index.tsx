import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Toaster } from '@/components/ui/toaster';
import MortgageQuiz from '@/components/MortgageQuiz';
import MortgageTabsContent from '@/components/MortgageTabsContent';
import FloatingApplicationButton from '@/components/FloatingApplicationButton';
import StatisticsCounter from '@/components/StatisticsCounter';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import TelegramButton from '@/components/TelegramButton';
import ThemeIndicator from '@/components/ThemeIndicator';
import DailyHeroImage from '@/components/DailyHeroImage';
import BlogPublicationIndicator from '@/components/BlogPublicationIndicator';
import { useAutoIndexNow } from '@/hooks/useAutoIndexNow';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import { trackPhoneClick, trackTabChanged } from '@/services/metrika-goals';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const theme = useDailyTheme();
  useAutoIndexNow();

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
                src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/97dcf769-3099-433c-93a7-982d4b12e27d.jpg" 
                alt="Ипотека РФ" 
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Ипотека РФ</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Льготные программы с господдержкой</p>
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
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => navigate('/register')}
                className="h-8 sm:h-10 px-3 sm:px-6 text-xs sm:text-sm"
              >
                <Icon name="UserPlus" className="mr-1.5" size={16} />
                Регистрация
              </Button>
              <a 
                href="tel:+79781281850" 
                onClick={() => trackPhoneClick('header')}
                className="flex items-center gap-1.5 sm:gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Icon name="Phone" size={18} className="sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base hidden sm:inline">+7 978 128-18-50</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <DailyHeroImage />
        <MortgageQuiz onNavigateToCalculator={() => {
          setActiveTab('calculator');
          trackTabChanged('calculator');
        }} />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-5 md:grid-cols-9 h-auto gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-xl shadow-sm overflow-x-auto">
            <TabsTrigger value="home" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="Home" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Главная</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="ClipboardList" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Программы</span>
              <span className="md:hidden">Прогр.</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="GitCompare" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Сравнение</span>
              <span className="md:hidden">Сравн.</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="Calculator" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Калькулятор</span>
              <span className="md:hidden">Калькул.</span>
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="Building2" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Каталог</span>
              <span className="md:hidden">Катал.</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="FileText" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Документы</span>
              <span className="md:hidden">Докум.</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="HelpCircle" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="BookOpen" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Блог</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="Phone" size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden md:inline">Контакты</span>
              <span className="md:hidden">Конт.</span>
            </TabsTrigger>
          </TabsList>

          <MortgageTabsContent />
        </Tabs>
      </main>

      <footer className="bg-gray-900 text-white mt-8 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/97dcf769-3099-433c-93a7-982d4b12e27d.jpg" 
                alt="Ипотека РФ" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <div>
                <p className="font-bold text-sm sm:text-base">Ипотека РФ</p>
                <p className="text-xs sm:text-sm text-gray-400">Льготные программы с господдержкой</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="font-semibold text-sm sm:text-base">Николаев Дмитрий Юрьевич</p>
              <p className="text-sm text-gray-400">+7 978 128-18-50</p>
              <p className="text-sm text-gray-400">ipoteka_krym@mail.ru</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
              <StatisticsCounter inline />
              <ThemeIndicator inline />
            </div>
            <div className="text-center text-gray-400 text-xs sm:text-sm">
              <p>© 2025 Все права защищены. Информация носит справочный характер.</p>
              <button
                onClick={() => navigate('/admin')}
                className="mt-3 text-gray-500 hover:text-gray-300 transition-all text-sm px-3 py-1 rounded hover:bg-gray-800 group relative"
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
      </footer>

      <FloatingApplicationButton />
      <TelegramButton />
      <BlogPublicationIndicator />
      <Toaster />
    </div>
  );
}