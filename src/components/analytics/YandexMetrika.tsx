import { useEffect } from 'react';

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

interface YandexMetrikaProps {
  counterId?: string;
}

export default function YandexMetrika({ counterId }: YandexMetrikaProps) {
  useEffect(() => {
    if (!counterId || counterId === 'YOUR_METRIKA_ID') {
      console.log('Yandex Metrika: ID not configured');
      return;
    }

    const id = parseInt(counterId, 10);
    if (isNaN(id)) {
      console.error('Yandex Metrika: Invalid counter ID');
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${id}, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        accurateTrackBounce: true,
        trackLinks: true,
        trackHash: true
      });
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`;
    document.body.appendChild(noscript);

    console.log('Yandex Metrika initialized:', id);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, [counterId]);

  return null;
}

export function ymReachGoal(goalName: string, params?: Record<string, any>) {
  if (window.ym) {
    const counterId = parseInt(
      document.querySelector('[data-ym-counter]')?.getAttribute('data-ym-counter') || '0',
      10
    );
    if (counterId) {
      window.ym(counterId, 'reachGoal', goalName, params);
    }
  }
}

export function ymHit(url: string, options?: Record<string, any>) {
  if (window.ym) {
    const counterId = parseInt(
      document.querySelector('[data-ym-counter]')?.getAttribute('data-ym-counter') || '0',
      10
    );
    if (counterId) {
      window.ym(counterId, 'hit', url, options);
    }
  }
}