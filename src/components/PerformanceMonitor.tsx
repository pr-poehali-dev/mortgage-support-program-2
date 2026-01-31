import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', Math.round(entry.startTime), 'ms');
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value);
        }
      }
    });

    try {
      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (e) {
      console.warn('PerformanceObserver not fully supported');
    }

    const logNavigationTiming = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.log('Performance Metrics:', {
          'DNS': Math.round(perfData.domainLookupEnd - perfData.domainLookupStart) + 'ms',
          'TCP': Math.round(perfData.connectEnd - perfData.connectStart) + 'ms',
          'TTFB': Math.round(perfData.responseStart - perfData.requestStart) + 'ms',
          'Download': Math.round(perfData.responseEnd - perfData.responseStart) + 'ms',
          'DOM Ready': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
          'Load Complete': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
        });
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(logNavigationTiming, 0);
    } else {
      window.addEventListener('load', () => setTimeout(logNavigationTiming, 0));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
