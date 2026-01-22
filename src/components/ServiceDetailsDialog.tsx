import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Service } from '@/data/servicesData';

interface ServiceDetailsDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestClick: () => void;
}

export default function ServiceDetailsDialog({ 
  service, 
  open, 
  onOpenChange, 
  onRequestClick 
}: ServiceDetailsDialogProps) {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-2.5">
                <Icon name={service.icon} size={28} className="text-white" />
              </div>
              <DialogTitle className="text-2xl">{service.title}</DialogTitle>
            </div>
            <DialogDescription className="text-base">
              {service.detailedInfo.fullDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Стоимость услуги</span>
                <span className="text-xl font-bold text-primary">
                  {service.detailedInfo.price}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Icon name="ListChecks" size={20} className="text-primary" />
                Этапы работы
              </h4>
              <div className="space-y-2">
                {service.detailedInfo.process.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Icon name="Star" size={20} className="text-primary" />
                Преимущества работы с нами
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.detailedInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Icon name="CheckCircle2" size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Icon name="Package" size={20} className="text-primary" />
                Что входит в услугу
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.detailedInfo.included.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg">
                    <Icon name="Check" size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={onRequestClick}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                size="lg"
              >
                <Icon name="FileText" className="mr-2" size={20} />
                Оставить заявку
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                size="lg"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
