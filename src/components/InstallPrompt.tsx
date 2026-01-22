import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const hasInstalled = localStorage.getItem('app-installed');
    const hasDismissed = localStorage.getItem('install-prompt-dismissed');
    
    if (hasInstalled || hasDismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (isIOSDevice && !window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    window.addEventListener('appinstalled', () => {
      localStorage.setItem('app-installed', 'true');
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('app-installed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('install-prompt-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-top-5">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-4 sm:p-5 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold mb-1">
              Установите приложение
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              {isIOS 
                ? 'Нажмите на кнопку "Поделиться" и выберите "На экран Домой"'
                : 'Добавьте на главный экран для быстрого доступа к ипотечным программам'
              }
            </p>
          </div>
        </div>

        {!isIOS && deferredPrompt && (
          <Button
            onClick={handleInstallClick}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Установить приложение
          </Button>
        )}

        {isIOS && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6a2 2 0 01-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3a2 2 0 012 2z"/>
                </svg>
              </div>
              <span className="font-medium">Как установить:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-white/90">
              <li>Нажмите на кнопку "Поделиться" в Safari</li>
              <li>Прокрутите и выберите "На экран Домой"</li>
              <li>Нажмите "Добавить"</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
