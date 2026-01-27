import { useEffect, useRef } from 'react';

interface YandexMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap({ latitude, longitude, title, address, className = '' }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        controls: ['zoomControl', 'fullscreenControl']
      });

      const placemark = new window.ymaps.Placemark(
        [latitude, longitude],
        {
          balloonContentHeader: title,
          balloonContentBody: address,
          hintContent: title
        },
        {
          preset: 'islands#redHomeIcon'
        }
      );

      mapInstanceRef.current.geoObjects.add(placemark);
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title, address]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '300px', height: '400px' }}
    />
  );
}
