import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentsAndBlogTabs from '@/components/tabs/DocumentsAndBlogTabs';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import Icon from '@/components/ui/icon';

export default function Blog() {
  const theme = useDailyTheme();
  const [activeTab, setActiveTab] = useState('blog');

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Блог об ипотеке и недвижимости - Арендодатель"
        description="Полезные статьи про ипотеку, покупку недвижимости, советы экспертов."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <Breadcrumbs />
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <Icon name="BookOpen" size={18} />
                <span>Блог</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Icon name="FileText" size={18} />
                <span>Документы</span>
              </TabsTrigger>
            </TabsList>
            <DocumentsAndBlogTabs />
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}