import { TabsContent } from '@/components/ui/tabs';
import MortgageCalculator from './MortgageCalculator';
import MortgageQuiz from './MortgageQuiz';
import ProgramsAndComparisonTabs from './tabs/ProgramsAndComparisonTabs';
import DocumentsAndBlogTabs from './tabs/DocumentsAndBlogTabs';
import CatalogTab from './tabs/CatalogTab';
import ContactAndFaqTabs from './tabs/ContactAndFaqTabs';
import VideosTab from './tabs/VideosTab';
import HomeTab from './HomeTab';
import DailyHeroImage from './DailyHeroImage';
import ReviewsSection from './ReviewsSection';

export default function MortgageTabsContent({ onNavigateToCalculator }: { onNavigateToCalculator: () => void }) {
  return (
    <>
      <TabsContent value="home" className="space-y-4 sm:space-y-6">
        <DailyHeroImage />
        <MortgageQuiz onNavigateToCalculator={onNavigateToCalculator} />
        <HomeTab />
        <ReviewsSection />
      </TabsContent>

      <ProgramsAndComparisonTabs />

      <TabsContent value="calculator" className="space-y-4 sm:space-y-6">
        <MortgageCalculator />
      </TabsContent>

      <DocumentsAndBlogTabs />

      <ContactAndFaqTabs />

      <CatalogTab />

      <VideosTab />
    </>
  );
}