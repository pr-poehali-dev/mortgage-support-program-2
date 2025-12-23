import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!measurementId || measurementId === 'YOUR_GA_ID') {
      console.log('Google Analytics: ID not configured');
      return;
    }

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
        page_title: document.title,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    console.log('Google Analytics initialized:', measurementId);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  return null;
}

export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

export function trackPageView(path: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title
    });
  }
}
