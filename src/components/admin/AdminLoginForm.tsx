import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginFormProps {
  onLogin: () => void;
  adminPassword: string;
}

export default function AdminLoginForm({ onLogin, adminPassword }: AdminLoginFormProps) {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      sessionStorage.setItem('admin_authenticated', 'true');
      onLogin();
      toast({
        title: '✅ Доступ разрешён',
        description: 'Добро пожаловать в панель управления'
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Попробуйте снова',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" className="text-white" size={32} />
          </div>
          <CardTitle className="text-center text-2xl">Панель администратора</CardTitle>
          <CardDescription className="text-center">
            Управление публикацией статей блога
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
            />
            <Button type="submit" className="w-full">
              <Icon name="LogIn" className="mr-2" size={18} />
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
