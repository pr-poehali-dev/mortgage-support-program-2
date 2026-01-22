import RSSFeed from '@/components/RSSFeed';
import { useLatestRutubeVideo } from '@/hooks/useLatestRutubeVideo';
import HeroSection from '@/components/home/HeroSection';
import AdvantagesSection from '@/components/home/AdvantagesSection';
import RegionsMapSection from '@/components/home/RegionsMapSection';
import SeoContentSection from '@/components/home/SeoContentSection';
import FaqSchema from '@/components/home/FaqSchema';

export default function HomeTab() {
  const { video } = useLatestRutubeVideo();

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <FaqSchema />
      <HeroSection video={video} />
      <AdvantagesSection />
      <SeoContentSection />
      <RSSFeed />
      <RegionsMapSection />
    </div>
  );
}