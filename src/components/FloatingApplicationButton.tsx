import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { trackApplicationSent } from '@/services/metrika-goals';

export default function FloatingApplicationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    program: 'family',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/2ea2118e-5b11-45d1-8e9d-bd90ba41a588', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Track application only in Yandex Metrika (analytics functions disabled)
        try {
          trackApplicationSent(formData.program);
        } catch (err) {
          console.error('Failed to track application:', err);
        }

        toast({
          title: '✅ Заявка отправлена!',
          description: 'Мы свяжемся с вами в ближайшее время',
          className: 'bg-green-50 border-green-200'
        });
        setIsOpen(false);
        setFormData({ name: '', phone: '', program: 'family', message: '' });
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заявку. Позвоните нам: +7 978 128-18-50',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 px-6 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group"
        >
          <Icon name="FileEdit" className="mr-2 group-hover:scale-110 transition-transform" size={20} />
          <span className="font-semibold hidden sm:inline">Оставить заявку</span>
          <span className="font-semibold sm:hidden">Заявка</span>
        </Button>
      </div>

      {/* Dialog Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="FileEdit" className="text-white" size={24} />
              </div>
              <div>
                <DialogTitle className="text-2xl">Быстрая заявка</DialogTitle>
                <DialogDescription className="mt-1">
                  Оставьте контакты — перезвоним за 15 минут
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя *</Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 900 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Программа ипотеки</Label>
              <select
                id="program"
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full h-12 px-3 py-2 border rounded-lg bg-white hover:border-primary transition-colors cursor-pointer"
              >
                <option value="family">Семейная ипотека 6%</option>
                <option value="it">IT ипотека 6%</option>
                <option value="military">Военная ипотека</option>
                <option value="rural">Сельская ипотека 0.1-3%</option>
                <option value="basic">Базовая ипотека 17%</option>
                <option value="unknown">Не знаю, помогите подобрать</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Сообщение (необязательно)</Label>
              <Textarea
                id="message"
                placeholder="Расскажите о вашей ситуации..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-primary" />
                Ответим в течение 15 минут
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-green-600" />
                Ваши данные защищены и не передаются третьим лицам
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12"
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2" size={18} />
                    Отправить заявку
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}