import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import MortgageQuiz from '@/components/MortgageQuiz';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import ThemeIndicator from '@/components/ThemeIndicator';
import DailyHeroImage from '@/components/DailyHeroImage';
import BlogPublicationIndicator from '@/components/BlogPublicationIndicator';
import CookieConsent from '@/components/CookieConsent';
import StatisticsCounter from '@/components/StatisticsCounter';
import ViewsCounter from '@/components/ViewsCounter';
import IndexHeader from '@/components/index/IndexHeader';
import IndexMainSections from '@/components/index/IndexMainSections';
import IndexFooter from '@/components/index/IndexFooter';
import { useAutoIndexNow } from '@/hooks/useAutoIndexNow';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import { useSitemapGenerator } from '@/hooks/useSitemapGenerator';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const theme = useDailyTheme();
  useAutoIndexNow();
  useSitemapGenerator();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO />
      <StructuredData />
      
      <IndexHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
      />

      <IndexMainSections 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <IndexFooter setActiveTab={setActiveTab} />

      <DailyHeroImage />
      <MortgageQuiz />
      <Toaster />
      <ThemeIndicator theme={theme} />
      <BlogPublicationIndicator />
      <StatisticsCounter />
      <ViewsCounter />
      <CookieConsent />
    </div>
  );
}
