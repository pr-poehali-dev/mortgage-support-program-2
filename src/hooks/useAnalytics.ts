import { useEffect, useState } from 'react';

interface AnalyticsConfig {
  google_analytics_id: string | null;
  yandex_metrika_id: string | null;
  configured: boolean;
}

export function useAnalytics() {
  const [config, setConfig] = useState<AnalyticsConfig>({
    google_analytics_id: null,
    yandex_metrika_id: '105974763',
    configured: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('https://functions.poehali.dev/be14ce68-1655-468e-be45-ca3e59d65813')
        .then(res => res.json())
        .then(data => {
          setConfig(data);
        })
        .catch(err => {
          console.error('Failed to load analytics config:', err);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return config;
}