import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function StructuredData() {
  const location = useLocation();

  useEffect(() => {
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]');
    existingScripts.forEach(script => script.remove());

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Арендодатель - Агентство недвижимости",
      "alternateName": "Ипотека Крым",
      "url": "https://ипотекакрым.рф",
      "logo": "https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png",
      "image": "https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/og-image-1767959127046.png",
      "description": "Профессиональное агентство недвижимости в Крыму и Севастополе. Помощь в получении ипотеки от 0.1%, продажа и аренда квартир, домов, участков.",
      "telephone": "+7-978-128-18-50",
      "email": "ipoteka_krym@mail.ru",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Крым",
        "addressLocality": "Севастополь",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "44.952116",
        "longitude": "34.102417"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Севастополь"
        },
        {
          "@type": "City",
          "name": "Симферополь"
        },
        {
          "@type": "City",
          "name": "Ялта"
        },
        {
          "@type": "City",
          "name": "Евпатория"
        },
        {
          "@type": "City",
          "name": "Феодосия"
        }
      ],
      "priceRange": "₽₽",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      "sameAs": [
        "https://t.me/ipoteka_krym_rf",
        "https://vk.com/arendodatel",
        "https://wa.me/79781281850"
      ],
      "founder": {
        "@type": "Person",
        "name": "Николаев Дмитрий Юрьевич",
        "jobTitle": "Специалист по ипотеке",
        "telephone": "+7-978-128-18-50",
        "email": "ipoteka_krym@mail.ru"
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": "https://ипотекакрым.рф/"
        }
      ]
    };

    if (location.pathname === '/register') {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Заявка на ипотеку",
        "item": "https://ипотекакрым.рф/register"
      });
    } else if (location.pathname === '/add-property') {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Разместить объявление",
        "item": "https://ипотекакрым.рф/add-property"
      });
    }

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Ипотечное кредитование",
      "provider": {
        "@type": "RealEstateAgent",
        "name": "Арендодатель"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Крым"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Семейная ипотека",
          "description": "Ипотека для семей с детьми по ставке от 6% годовых",
          "price": "6",
          "priceCurrency": "RUB",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "IT ипотека",
          "description": "Ипотека для IT специалистов по ставке от 6% годовых",
          "price": "6",
          "priceCurrency": "RUB",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Сельская ипотека",
          "description": "Льготная ипотека для покупки жилья в сельской местности от 0.1%",
          "price": "0.1",
          "priceCurrency": "RUB",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Военная ипотека",
          "description": "Ипотека для военнослужащих с господдержкой",
          "availability": "https://schema.org/InStock"
        }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Какие программы ипотеки доступны в Крыму?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "В Крыму доступны: Семейная ипотека 6%, IT ипотека 6%, Военная ипотека, Сельская ипотека 0.1-3%, Базовая ипотека 17%."
          }
        },
        {
          "@type": "Question",
          "name": "Какой минимальный первоначальный взнос?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Минимальный первоначальный взнос зависит от программы: для семейной и IT ипотеки - от 15%, для базовой - от 20%, для сельской - от 10%."
          }
        },
        {
          "@type": "Question",
          "name": "Как долго рассматривается заявка?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Предварительное решение по заявке банки выдают в течение 1-3 дней. Полное оформление ипотеки занимает от 7 до 30 дней в зависимости от банка и программы."
          }
        }
      ]
    };

    const scripts = [organizationSchema, breadcrumbSchema, serviceSchema, faqSchema];
    
    scripts.forEach(schemaData => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

    return () => {
      const dynamicScripts = document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]');
      dynamicScripts.forEach(script => script.remove());
    };
  }, [location.pathname]);

  return null;
}
