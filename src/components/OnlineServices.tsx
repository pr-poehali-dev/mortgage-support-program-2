import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { onlineServices } from '@/data/onlineServices';
import { PaymentButton } from '@/components/extensions/yookassa/PaymentButton';
import { cartService } from '@/services/cart';

export default function OnlineServices() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (service: typeof onlineServices[0]) => {
    cartService.addItem({
      id: service.id,
      name: service.title,
      price: `${service.price.toLocaleString('ru-RU')} ₽`,
      description: service.description,
      icon: service.icon
    });
    setAddedToCart(service.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Онлайн-услуги</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Полный спектр услуг по недвижимости дистанционно — безопасно, быстро и удобно
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {onlineServices.map((service) => (
          <Card 
            key={service.id} 
            className="hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <CardHeader>
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Icon name={service.icon} className="text-white" size={28} />
              </div>
              <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <ul className="space-y-2 mb-6 flex-grow">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Icon name="Check" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="border-t pt-4 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {service.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleAddToCart(service)}
                    className={`transition-all ${
                      addedToCart === service.id
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                    size="sm"
                  >
                    {addedToCart === service.id ? (
                      <>
                        <Icon name="CheckCircle" size={16} className="mr-1" />
                        Добавлено
                      </>
                    ) : (
                      <>
                        <Icon name="ShoppingCart" size={16} className="mr-1" />
                        В корзину
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setSelectedService(service.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="CreditCard" size={16} className="mr-1" />
                    Оплатить
                  </Button>
                </div>
                
                {selectedService === service.id && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <PaymentButton
                      apiUrl="https://functions.poehali.dev/72d9915f-4d87-4e17-9854-dba7c8bae060"
                      amount={service.price}
                      userEmail="customer@example.com"
                      returnUrl={`${window.location.origin}/`}
                      description={service.title}
                      cartItems={[{
                        id: service.id,
                        name: service.title,
                        price: service.price,
                        quantity: 1
                      }]}
                      onSuccess={(orderNumber) => {
                        alert(`Заказ ${orderNumber} создан! Переходим к оплате...`);
                        setSelectedService(null);
                      }}
                      onError={(error) => {
                        alert(`Ошибка создания платежа: ${error.message}`);
                        setSelectedService(null);
                      }}
                      className="w-full"
                      buttonText="Перейти к оплате"
                    />
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedService(null)}
                      className="w-full"
                      size="sm"
                    >
                      Отмена
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Icon name="Info" className="mx-auto mb-4 text-blue-600" size={40} />
          <h3 className="text-2xl font-bold mb-4">Как это работает?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h4 className="font-semibold">Выберите услугу</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Определитесь с нужной услугой и нажмите "Оплатить"
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h4 className="font-semibold">Оплатите онлайн</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Безопасная оплата через ЮКассу любой картой
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h4 className="font-semibold">Получите услугу</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Мы свяжемся с вами и начнём работу дистанционно
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}