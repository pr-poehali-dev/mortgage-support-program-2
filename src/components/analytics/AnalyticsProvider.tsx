import { ReactNode } from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import YandexMetrika from './YandexMetrika';

interface AnalyticsProviderProps {
  children: ReactNode;
  googleAnalyticsId?: string;
  yandexMetrikaId?: string;
}

export default function AnalyticsProvider({
  children,
  googleAnalyticsId,
  yandexMetrikaId,
}: AnalyticsProviderProps) {
  return (
    <>
      {googleAnalyticsId && <GoogleAnalytics measurementId={googleAnalyticsId} />}
      {yandexMetrikaId && <YandexMetrika counterId={yandexMetrikaId} />}
      {children}
    </>
  );
}
