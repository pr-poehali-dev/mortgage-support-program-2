import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';

interface PropertyActionsProps {
  isLand: boolean;
  phone?: string;
  contactName?: string;
  title: string;
  price: number;
}

export default function PropertyActions({ isLand, phone, contactName, title, price }: PropertyActionsProps) {
  return (
    <>
      {/* Кнопки действий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Button size="lg" className="gap-2">
          <Icon name="CreditCard" size={20} />
          Купить в ипотеку
        </Button>
        
        {isLand ? (
          <Button size="lg" variant="outline" className="gap-2">
            <Icon name="HardHat" size={20} />
            Строительство под ключ
          </Button>
        ) : (
          <Button size="lg" variant="outline" className="gap-2">
            <Icon name="Paintbrush" size={20} />
            Отделочные работы
          </Button>
        )}
        
        <Button size="lg" variant="secondary" className="gap-2" asChild>
          <a href={`tel:${phone || '+79781281850'}`}>
            <Icon name="Phone" size={20} />
            {contactName ? `Позвонить ${contactName}` : 'Позвонить'}
          </a>
        </Button>
      </div>
      
      {/* Кнопки репоста */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-3">Поделиться объявлением</h3>
        <ShareButton
          variant="buttons"
          title={title}
          text={`${title} - ${price.toLocaleString('ru-RU')} ₽`}
        />
      </div>
    </>
  );
}
