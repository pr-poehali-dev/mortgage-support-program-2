import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    
    if (!hasConsent) {
      // Показываем баннер через 1 секунду после загрузки
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Согласие на обработку персональных данных
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Мы используем файлы cookie и обрабатываем персональные данные для улучшения работы 
                сайта, предоставления персонализированных услуг и анализа посещаемости. 
                Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
                <button
                  onClick={() => {
                    navigate('/privacy-policy');
                    setIsVisible(false);
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  Политикой конфиденциальности
                </button>
                .
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Какие данные мы собираем:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Имя, телефон, email (при заполнении форм)</li>
              <li>IP-адрес и данные о браузере</li>
              <li>Статистика посещений (Яндекс.Метрика, Google Analytics)</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              className="flex-1 h-12 text-base font-semibold"
            >
              <Icon name="Check" size={20} className="mr-2" />
              Принять и продолжить
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              <Icon name="X" size={20} className="mr-2" />
              Отклонить
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Вы можете изменить настройки в любое время в разделе{' '}
            <button
              onClick={() => {
                navigate('/privacy-policy');
                setIsVisible(false);
              }}
              className="text-primary hover:underline"
            >
              Политика конфиденциальности
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
