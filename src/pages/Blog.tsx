import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BlogSection from '@/components/BlogSection';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Blog() {
  const theme = useDailyTheme();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Блог об ипотеке и недвижимости - Арендодатель"
        description="Полезные статьи про ипотеку, покупку недвижимости, советы экспертов."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
