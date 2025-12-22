import { TabsContent } from '@/components/ui/tabs';
import MortgageCalculator from './MortgageCalculator';
import ProgramsAndComparisonTabs from './tabs/ProgramsAndComparisonTabs';
import DocumentsAndBlogTabs from './tabs/DocumentsAndBlogTabs';
import CatalogTab from './tabs/CatalogTab';
import ContactAndFaqTabs from './tabs/ContactAndFaqTabs';

export default function MortgageTabsContent() {
  return (
    <>
      <ProgramsAndComparisonTabs />

      <TabsContent value="calculator" className="space-y-4 sm:space-y-6">
        <MortgageCalculator />
      </TabsContent>

      <DocumentsAndBlogTabs />

      <ContactAndFaqTabs />

      <CatalogTab />
    </>
  );
}
