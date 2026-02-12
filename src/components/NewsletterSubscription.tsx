import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: 'Заполните все поля',
        description: 'Укажите имя и email для подписки',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/f0b8f2b5-0546-46eb-801e-b54d1dd4a41a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      if (response.ok) {
        toast({
          title: '✅ Вы подписались!',
          description: 'Теперь вы будете получать уведомления о новых статьях'
        });
        setEmail('');
        setName('');
      } else {
        const data = await response.json();
        toast({
          title: 'Ошибка подписки',
          description: data.error || 'Попробуйте позже',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Icon name="Mail" className="text-white" size={20} />
          </div>
          <div>
            <CardTitle>Подписка на новости</CardTitle>
            <CardDescription>Получайте уведомления о новых статьях</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white"
          />
          <Input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                Подписываемся...
              </>
            ) : (
              <>
                <Icon name="Bell" className="mr-2" size={16} />
                Подписаться
              </>
            )}
          </Button>
          <p className="text-xs text-gray-600 text-center">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </CardContent>
    </Card>
  );
}