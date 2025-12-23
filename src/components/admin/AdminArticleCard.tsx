import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Article {
  id: number;
  title: string;
  publishDate?: string;
  published?: boolean;
  category: string;
  excerpt: string;
  content?: string;
  date?: string;
  readTime?: string;
  icon?: string;
  color?: string;
  image?: string;
}

interface AdminArticleCardProps {
  article: Article;
  isEditing: boolean;
  newDate: string;
  onSetNewDate: (date: string) => void;
  onStartEditDate: (articleId: number, currentDate?: string) => void;
  onSaveDate: (articleId: number) => void;
  onCancelEditDate: () => void;
  onTogglePublished: (articleId: number, currentStatus: boolean) => void;
  onOpenContentEditor: (article: Article) => void;
  onSendNewsletter: (article: Article) => void;
  formatDate: (dateString?: string) => string;
  isPublishDatePassed: (dateString?: string) => boolean;
}

export default function AdminArticleCard({
  article,
  isEditing,
  newDate,
  onSetNewDate,
  onStartEditDate,
  onSaveDate,
  onCancelEditDate,
  onTogglePublished,
  onOpenContentEditor,
  onSendNewsletter,
  formatDate,
  isPublishDatePassed
}: AdminArticleCardProps) {
  const isPassed = isPublishDatePassed(article.publishDate);

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <Badge variant="secondary" className="mt-1">
                ID {article.id}
              </Badge>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-700">
                    {article.category}
                  </Badge>
                  {article.published ? (
                    <Badge className="bg-green-100 text-green-700">
                      <Icon name="CheckCircle" size={14} className="mr-1" />
                      Опубликовано
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700">
                      <Icon name="Clock" size={14} className="mr-1" />
                      Ожидает
                    </Badge>
                  )}
                  {isPassed && !article.published && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      <Icon name="AlertTriangle" size={14} className="mr-1" />
                      Дата прошла
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2 mt-4">
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => onSetNewDate(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => onSaveDate(article.id)} size="sm">
                  <Icon name="Save" size={16} className="mr-1" />
                  Сохранить
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onCancelEditDate}
                  size="sm"
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Дата публикации:</span> {formatDate(article.publishDate)}
              </div>
            )}
          </div>

          <div className="flex lg:flex-col gap-2 lg:min-w-[200px]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStartEditDate(article.id, article.publishDate)}
              className="flex-1"
            >
              <Icon name="Calendar" size={16} className="mr-1" />
              Изменить дату
            </Button>
            
            <Button
              variant={article.published ? "secondary" : "default"}
              size="sm"
              onClick={() => onTogglePublished(article.id, article.published || false)}
              className="flex-1"
            >
              <Icon name={article.published ? "EyeOff" : "Eye"} size={16} className="mr-1" />
              {article.published ? 'Скрыть' : 'Опубликовать'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenContentEditor(article)}
              className="flex-1"
            >
              <Icon name="Edit" size={16} className="mr-1" />
              Редактировать текст
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendNewsletter(article)}
              className="flex-1"
            >
              <Icon name="Send" size={16} className="mr-1" />
              Отправить рассылку
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
