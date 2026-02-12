import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import MortgageTabsContent from '@/components/MortgageTabsContent';
import PopularServicesSection from '@/components/PopularServicesSection';
import RentalServicesSection from '@/components/RentalServicesSection';
import MainServicesGrid from '@/components/MainServicesGrid';
import InternalLinks from '@/components/InternalLinks';
import SiteMap from '@/components/SiteMap';
import { trackTabChanged } from '@/services/analytics';

interface IndexMainSectionsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function IndexMainSections({ activeTab, setActiveTab }: IndexMainSectionsProps) {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackTabChanged(tab);
  };

  return (
    <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
      <RentalServicesSection />
      
      <MainServicesGrid />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-3 sm:space-y-6">
        {/* Дополнительные разделы */}
        <TabsList className="bg-white/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-lg shadow-sm h-auto">
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 w-full">
            <TabsTrigger value="documents" className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]">
              <Icon name="FileText" size={20} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Документы</span>
            </TabsTrigger>
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
              value="photos" 
              className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
              onClick={() => navigate('/photos')}
            >
              <Icon name="Image" size={20} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Фото</span>
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
              value="online-services" 
              className="flex flex-col items-center gap-0.5 sm:gap-1 py-3 sm:py-3 text-[10px] sm:text-xs min-h-[48px]"
              onClick={() => navigate('/online-services')}
            >
              <Icon name="ShoppingCart" size={20} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap text-center leading-tight">Онлайн услуги</span>
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
  );
}