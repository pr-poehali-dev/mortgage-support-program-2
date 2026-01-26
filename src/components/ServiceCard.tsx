import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Service } from '@/data/servicesData';
import { cartService } from '@/services/cart';

interface ServiceCardProps {
  service: Service;
  onDetailsClick: (service: Service) => void;
  onRequestClick: (serviceName: string) => void;
}

export default function ServiceCard({ service, onDetailsClick, onRequestClick }: ServiceCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    cartService.addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      description: service.description,
      icon: service.icon
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/50">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-3 flex-shrink-0">
          <Icon name={service.icon} size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            {service.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            {service.description}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {service.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Icon 
              name="CheckCircle2" 
              size={16} 
              className="text-green-600 mt-0.5 flex-shrink-0" 
            />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 mb-3 flex items-center justify-between bg-blue-50 rounded-lg p-3">
        <span className="text-sm text-gray-600">Цена:</span>
        <span className="text-xl font-bold text-blue-600">{service.price}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => onDetailsClick(service)}
          variant="outline"
          className="col-span-1"
          size="sm"
        >
          <Icon name="Info" size={16} />
        </Button>
        <Button
          onClick={handleAddToCart}
          className={`col-span-2 transition-all ${
            isAdded 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          }`}
          size="sm"
        >
          {isAdded ? (
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
      </div>

      <Button
        onClick={() => onRequestClick(service.title)}
        variant="outline"
        className="w-full mt-2"
        size="sm"
      >
        Быстрая заявка
      </Button>
    </div>
  );
}