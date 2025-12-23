import { useEffect } from 'react';
import { notifyCurrentPage } from '@/services/indexnow';

export function useAutoIndexNow() {
  useEffect(() => {
    const notifyPage = async () => {
      const currentPath = window.location.pathname;
      const storageKey = `indexnow_notified_${currentPath}`;
      const lastNotified = localStorage.getItem(storageKey);
      
      if (!lastNotified) {
        try {
          await notifyCurrentPage();
          localStorage.setItem(storageKey, new Date().toISOString());
          console.log('IndexNow: Page automatically notified to search engines');
        } catch (error) {
          console.error('IndexNow auto-notification failed:', error);
        }
      }
    };

    const timer = setTimeout(notifyPage, 5000);
    
    return () => clearTimeout(timer);
  }, []);
}
