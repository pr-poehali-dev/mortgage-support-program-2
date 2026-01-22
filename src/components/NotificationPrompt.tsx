import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        const hasSeenPrompt = localStorage.getItem('notification-prompt-seen');
        if (!hasSeenPrompt) {
          setTimeout(() => {
            setShowPrompt(true);
          }, 5000);
        }
      }
    }
  }, []);

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          new Notification('Уведомления включены!', {
            body: 'Теперь вы будете получать информацию о новых ипотечных программах',
            icon: 'https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png',
            tag: 'welcome-notification'
          });

          console.log('Push subscription ready:', registration);
        }
      }
      
      localStorage.setItem('notification-prompt-seen', 'true');
      setShowPrompt(false);
    } catch (error) {
      console.error('Notification permission error:', error);
      setShowPrompt(false);
    }
  };

  const handleDeny = () => {
    localStorage.setItem('notification-prompt-seen', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-5">
        <button
          onClick={handleDeny}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              Получать уведомления?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Узнавайте первыми о новых ипотечных программах и выгодных предложениях
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Button
            onClick={handleAllow}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Разрешить
          </Button>
          <Button
            onClick={handleDeny}
            variant="outline"
            className="flex-1"
          >
            Не сейчас
          </Button>
        </div>
      </div>
    </div>
  );
}
