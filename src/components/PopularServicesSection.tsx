import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { services } from '@/data/servicesData';
import { cartService } from '@/services/cart';

export default function PopularServicesSection() {
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const popularServices = services.slice(0, 3);

  const handleAddToCart = (service: typeof services[0]) => {
    cartService.addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      description: service.description,
      icon: service.icon
    });
    setAddedToCart(service.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <section className="mb-8 sm:mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
              <Icon name="Star" size={28} className="text-yellow-500" />
              Популярные услуги
            </h2>
            <p className="text-gray-600">Самые востребованные услуги наших клиентов</p>
          </div>
          <Button
            onClick={() => navigate('/services')}
            variant="outline"
            className="hidden sm:flex"
          >
            Все услуги
            <Icon name="ArrowRight" size={18} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4">
          {popularServices.map((service) => (
            <div 
              key={service.id}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 flex-shrink-0">
                  <Icon name={service.icon} size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{service.title}</h3>
                  <p className="text-xl font-bold text-blue-600">{service.price}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="space-y-2">
                {service.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon 
                      name="CheckCircle2" 
                      size={14} 
                      className="text-green-600 mt-0.5 flex-shrink-0" 
                    />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleAddToCart(service)}
                className={`w-full mt-4 transition-all ${
                  addedToCart === service.id
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
                size="sm"
              >
                {addedToCart === service.id ? (
                  <>
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Добавлено в корзину
                  </>
                ) : (
                  <>
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    Добавить в корзину
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate('/services')}
          variant="outline"
          className="w-full sm:hidden"
        >
          Смотреть все услуги
          <Icon name="ArrowRight" size={18} className="ml-2" />
        </Button>
      </div>
    </section>
  );
}
