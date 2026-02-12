import { TabsContent } from '@/components/ui/tabs';
import MortgageQuiz from './MortgageQuiz';
import DocumentsAndBlogTabs from './tabs/DocumentsAndBlogTabs';
import CatalogTab from './tabs/CatalogTab';
import ContactAndFaqTabs from './tabs/ContactAndFaqTabs';
import VideosTab from './tabs/VideosTab';
import HomeTab from './HomeTab';
import ReviewsSection from './ReviewsSection';
import MortgageTab from './tabs/MortgageTab';

export default function MortgageTabsContent({ onNavigateToCalculator }: { onNavigateToCalculator: () => void }) {
  return (
    <>
      <TabsContent value="home" className="space-y-3 sm:space-y-6">
        <MortgageQuiz onNavigateToCalculator={onNavigateToCalculator} />
        <HomeTab />
        <ReviewsSection />
      </TabsContent>

      <CatalogTab />

      <TabsContent value="mortgage" className="space-y-3 sm:space-y-6">
        <MortgageTab />
      </TabsContent>

      <DocumentsAndBlogTabs />

      <VideosTab />

      <ContactAndFaqTabs />
    </>
  );
}