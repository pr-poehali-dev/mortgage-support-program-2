import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ShareButton from '@/components/ShareButton';
import { useNavigate } from 'react-router-dom';

interface PropertyActionsProps {
  isLand: boolean;
  phone?: string;
  contactName?: string;
  title: string;
  price: number;
}

export default function PropertyActions({ isLand, phone, contactName, title, price }: PropertyActionsProps) {
  const navigate = useNavigate();
  
  const cleanPhone = (phoneNumber?: string) => {
    if (!phoneNumber) return '79781281850';
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    return cleaned.startsWith('7') ? cleaned : '7' + cleaned;
  };

  const phoneNumber = cleanPhone(phone);
  const displayName = contactName || 'Николаеву Дмитрию Юрьевичу';

  return (
    <>
      {/* Кнопки действий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Button size="lg" className="gap-2" onClick={() => navigate('/programs')}>
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
        
        <Button size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700" asChild>
          <a href={`tel:+${phoneNumber}`}>
            <Icon name="Phone" size={20} />
            Позвонить {displayName}
          </a>
        </Button>
      </div>

      {/* Кнопки мессенджеров */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <Button size="lg" variant="outline" className="gap-2 text-blue-600 hover:bg-blue-50" asChild>
          <a href={`https://t.me/+${phoneNumber}`} target="_blank" rel="noopener noreferrer">
            <Icon name="Send" size={20} />
            Написать в Telegram
          </a>
        </Button>
        
        <Button size="lg" variant="outline" className="gap-2 text-red-600 hover:bg-red-50" asChild>
          <a href={`https://maxim.chat/${phoneNumber}`} target="_blank" rel="noopener noreferrer">
            <Icon name="MessageSquare" size={20} />
            Написать в Max
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