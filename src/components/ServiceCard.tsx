import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Service } from '@/data/servicesData';

interface ServiceCardProps {
  service: Service;
  onDetailsClick: (service: Service) => void;
  onRequestClick: () => void;
}

export default function ServiceCard({ service, onDetailsClick, onRequestClick }: ServiceCardProps) {
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

      <div className="flex gap-2 mt-5">
        <Button
          onClick={() => onDetailsClick(service)}
          variant="outline"
          className="flex-1"
        >
          Подробнее
        </Button>
        <Button
          onClick={onRequestClick}
          className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        >
          Заявка
        </Button>
      </div>
    </div>
  );
}
