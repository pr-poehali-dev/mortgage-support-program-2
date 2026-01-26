import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import MortgageCalculator from '@/components/MortgageCalculator';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Calculator() {
  const theme = useDailyTheme();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Ипотечный калькулятор - Арендодатель"
        description="Рассчитайте ипотеку онлайн. Узнайте размер ежемесячного платежа и переплату по кредиту."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <Breadcrumbs />
        <MortgageCalculator />
      </main>
      <Footer />
    </div>
  );
}