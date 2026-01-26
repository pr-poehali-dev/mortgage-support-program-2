import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import MortgagePrograms from '@/components/MortgagePrograms';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Programs() {
  const theme = useDailyTheme();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Ипотечные программы - Арендодатель"
        description="Все актуальные ипотечные программы банков. Семейная ипотека, льготная ипотека, IT-ипотека и другие программы."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <MortgagePrograms />
      </main>
      <Footer />
    </div>
  );
}
