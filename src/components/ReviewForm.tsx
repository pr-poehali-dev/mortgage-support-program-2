import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const REVIEWS_API = 'https://functions.poehali.dev/e9b4d624-81cd-46f6-b82b-59f9d89e033b';

export default function ReviewForm() {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName || rating === 0 || !reviewText) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(REVIEWS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author_name: authorName,
          rating: rating,
          review_text: reviewText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: data.message || 'Спасибо за отзыв!',
        });
        
        setAuthorName('');
        setRating(0);
        setReviewText('');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить отзыв',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке отзыва',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              starValue <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Оставьте свой отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ваше имя
            </label>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Оценка
            </label>
            <div className="flex gap-2">{renderStars()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ваш отзыв
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Расскажите о вашем опыте работы с нами..."
              rows={5}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Отзыв появится на сайте после проверки модератором
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
