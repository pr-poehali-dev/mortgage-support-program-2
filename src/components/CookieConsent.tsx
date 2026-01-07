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
      setIsVisible(true);
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
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="bg-white shadow-lg border-2">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" className="text-primary" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Файлы cookie
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Мы используем cookie для улучшения работы сайта.{' '}
                <button
                  onClick={() => {
                    navigate('/privacy-policy');
                    setIsVisible(false);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Подробнее
                </button>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              className="flex-1 h-9 text-xs"
            >
              Принять
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="h-9 px-3 text-xs"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}