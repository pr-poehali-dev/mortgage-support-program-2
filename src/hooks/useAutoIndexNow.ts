import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { notifyCurrentPage } from '@/services/indexnow';

export function useAutoIndexNow(delay = 3000) {
  const location = useLocation();

  useEffect(() => {
    const notifyPage = async () => {
      try {
        const result = await notifyCurrentPage();
        
        if (result.urls_submitted > 0) {
          console.log('✅ IndexNow: Page indexed', {
            url: window.location.href,
            engines: result.results.map(r => r.engine).join(', '),
            timestamp: result.timestamp
          });
        }
      } catch (error) {
        console.warn('⚠️ IndexNow notification failed:', error);
      }
    };

    const skipPaths = ['/admin', '/admin/'];
    const currentPath = location.pathname;
    
    if (!skipPaths.some(path => currentPath.startsWith(path))) {
      const timer = setTimeout(notifyPage, delay);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, delay]);
}
