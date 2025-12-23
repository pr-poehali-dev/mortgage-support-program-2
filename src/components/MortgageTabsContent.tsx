import { TabsContent } from '@/components/ui/tabs';
import MortgageCalculator from './MortgageCalculator';
import ProgramsAndComparisonTabs from './tabs/ProgramsAndComparisonTabs';
import DocumentsAndBlogTabs from './tabs/DocumentsAndBlogTabs';
import CatalogTab from './tabs/CatalogTab';
import ContactAndFaqTabs from './tabs/ContactAndFaqTabs';
import VideosTab from './tabs/VideosTab';
import HomeTab from './HomeTab';

export default function MortgageTabsContent() {
  return (
    <>
      <TabsContent value="home" className="space-y-4 sm:space-y-6">
        <HomeTab />
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