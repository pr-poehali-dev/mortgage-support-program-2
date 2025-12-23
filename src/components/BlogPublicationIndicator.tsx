import { useDailyBlogPost } from '@/hooks/useDailyBlogPost';
import { blogArticles } from '@/data/mortgageData';
import Icon from '@/components/ui/icon';

export default function BlogPublicationIndicator() {
  const visibleArticles = useDailyBlogPost();
  const totalArticles = blogArticles.length;
  const nextPublicationDays = totalArticles - visibleArticles.length;

  if (nextPublicationDays === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-36 left-4 z-40 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-2 animate-pulse">
      <Icon name="Sparkles" size={18} />
      <div className="text-sm font-medium">
        <span>Новые статьи через {nextPublicationDays} {nextPublicationDays === 1 ? 'день' : 'дня'}</span>
      </div>
    </div>
  );
}
