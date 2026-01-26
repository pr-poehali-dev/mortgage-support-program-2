import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { cartService } from '@/services/cart';

interface CartOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartOrderForm({ isOpen, onClose }: CartOrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const cartItems = cartService.getCart();
  const totalPrice = cartService.getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderDetails = cartItems.map(item => 
      `${item.name} x${item.quantity} - ${item.price}`
    ).join('\n');

    const message = `
=== ЗАКАЗ УСЛУГ ===

Услуги:
${orderDetails}

Итого: ${totalPrice.toLocaleString('ru-RU')} ₽

Клиент: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email}
${formData.comment ? `\nКомментарий: ${formData.comment}` : ''}
    `.trim();

    try {
      const response = await fetch('https://api.telegram.org/bot7936167332:AAGZwZaBbsE4vIvPD69QoN1J-0K91lq_Vns/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: '906301734',
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        cartService.clearCart();
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ name: '', phone: '', email: '', comment: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Оформление заявки</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={48} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Заявка отправлена!</h3>
              <p className="text-gray-600">Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Icon name="ShoppingCart" size={20} />
                  Ваш заказ:
                </h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm">
                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-blue-600">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between items-center">
                  <span className="font-bold">Итого:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ваше имя <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Комментарий
                  </label>
                  <Textarea
                    placeholder="Дополнительная информация..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={20} className="mr-2" />
                      Отправить заявку
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
