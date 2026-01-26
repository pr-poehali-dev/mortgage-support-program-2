import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import OnlineServices from '@/components/OnlineServices';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function OnlineServicesPage() {
  const theme = useDailyTheme();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Онлайн-услуги по недвижимости - Арендодатель"
        description="Дистанционные услуги: подбор недвижимости, виртуальные туры, оформление ипотеки онлайн, юридическое сопровождение."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <OnlineServices />
      </main>
      <Footer />
    </div>
  );
}
