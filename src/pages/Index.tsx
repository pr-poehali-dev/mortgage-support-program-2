import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Toaster } from '@/components/ui/toaster';
import MortgageQuiz from '@/components/MortgageQuiz';
import MortgageTabsContent from '@/components/MortgageTabsContent';
import FloatingApplicationButton from '@/components/FloatingApplicationButton';
import StatisticsCounter from '@/components/StatisticsCounter';

export default function Index() {
  const [activeTab, setActiveTab] = useState('programs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Home" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Ипотека РФ 2025</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Льготные программы с господдержкой</p>
              </div>
            </div>
            <a href="tel:+79781281850" className="flex items-center gap-1.5 sm:gap-2 text-primary hover:text-primary/80 transition-colors">
              <Icon name="Phone" size={18} className="sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base hidden sm:inline">+7 978 128-18-50</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <MortgageQuiz onNavigateToCalculator={() => setActiveTab('calculator')} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 h-auto gap-1 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-xl shadow-sm overflow-x-auto">
            <TabsTrigger value="programs" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Icon name="Home" size={16} className="sm:w-[18px] sm:h-[18px]" />
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Home" className="text-white" size={20} />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">Ипотека РФ 2025</p>
                <p className="text-xs sm:text-sm text-gray-400">Льготные программы с господдержкой</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="font-semibold text-sm sm:text-base">Николаев Дмитрий Юрьевич</p>
              <p className="text-sm text-gray-400">+7 978 128-18-50</p>
              <p className="text-sm text-gray-400">ipoteka_krym@mail.ru</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-4 sm:pt-6 text-center text-gray-400 text-xs sm:text-sm">
            <p>© 2025 Все права защищены. Информация носит справочный характер.</p>
          </div>
        </div>
      </footer>

      <StatisticsCounter />
      <FloatingApplicationButton />
      <Toaster />
    </div>
  );
}