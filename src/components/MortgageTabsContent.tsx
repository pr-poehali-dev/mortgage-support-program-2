import { TabsContent } from '@/components/ui/tabs';
import MortgageCalculator from './MortgageCalculator';
import MortgageQuiz from './MortgageQuiz';
import ProgramsAndComparisonTabs from './tabs/ProgramsAndComparisonTabs';
import DocumentsAndBlogTabs from './tabs/DocumentsAndBlogTabs';
import CatalogTab from './tabs/CatalogTab';
import ContactAndFaqTabs from './tabs/ContactAndFaqTabs';
import VideosTab from './tabs/VideosTab';
import TagsTab from './tabs/TagsTab';
import HomeTab from './HomeTab';
import ReviewsSection from './ReviewsSection';

export default function MortgageTabsContent({ onNavigateToCalculator }: { onNavigateToCalculator: () => void }) {
  return (
    <>
      <TabsContent value="home" className="space-y-3 sm:space-y-6">
        <MortgageQuiz onNavigateToCalculator={onNavigateToCalculator} />
        <HomeTab />
        <ReviewsSection />
      </TabsContent>

      <CatalogTab />

      <TabsContent value="calculator" className="space-y-3 sm:space-y-6">
        <MortgageCalculator />
      </TabsContent>

      <ProgramsAndComparisonTabs />

      <DocumentsAndBlogTabs />

      <VideosTab />

      <TagsTab />

      <ContactAndFaqTabs />
    </>
  );
}