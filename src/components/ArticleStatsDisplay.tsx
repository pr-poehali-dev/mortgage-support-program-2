import { useArticleStats } from '@/hooks/useArticleStats';
import Icon from '@/components/ui/icon';

interface ArticleStatsDisplayProps {
  articleId: number;
}

export default function ArticleStatsDisplay({ articleId }: ArticleStatsDisplayProps) {
  const { stats, loading } = useArticleStats(articleId);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Icon name="Eye" size={14} />
          <span>...</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Share2" size={14} />
          <span>...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <div className="flex items-center gap-1" title="Просмотры">
        <Icon name="Eye" size={14} />
        <span className="font-medium">{stats.views_count}</span>
      </div>
      <div className="flex items-center gap-1" title="Репосты">
        <Icon name="Share2" size={14} />
        <span className="font-medium">{stats.shares.total}</span>
      </div>
    </div>
  );
}
