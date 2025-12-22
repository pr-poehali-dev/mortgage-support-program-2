import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Ипотека Крым 2025",
      "description": "Профессиональная помощь в получении ипотеки в Крыму",
      "url": window.location.href,
      "mainEntity": {
        "@type": "FinancialService",
        "name": "Ипотечные услуги в Крыму",
        "provider": {
          "@type": "Person",
          "name": "Николаев Дмитрий Юрьевич",
          "telephone": "+7-978-128-18-50",
          "email": "ipoteka_krym@mail.ru"
        }
      }
    });
    
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}
