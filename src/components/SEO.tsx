import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const seoConfig: Record<string, { title: string; description: string; keywords?: string }> = {
  '/': {
    title: 'Ипотека в Крыму от 0.1% | Арендодатель - Агентство Недвижимости Севастополь',
    description: '⭐ Ипотека в Крыму от 0.1% годовых! Семейная, IT, Военная, Сельская ипотека. Продажа и аренда квартир, домов, участков. Полное сопровождение. ☎️ +7 978 128-18-50',
    keywords: 'ипотека крым, ипотека севастополь, семейная ипотека, it ипотека, военная ипотека, сельская ипотека, купить квартиру крым, недвижимость крым, агентство недвижимости севастополь, аренда квартир крым, риэлтор севастополь, ипотека 0.1 процента, ипотечный брокер крым, купить дом крым, продажа недвижимости севастополь, квартиры в новостройках крым, вторичное жилье крым, ипотека с господдержкой, участки под ижс крым, коммерческая недвижимость крым'
  },
  '/register': {
    title: 'Заявка на ипотеку | Ипотека в Крыму от 0.1% | Арендодатель',
    description: '📝 Оставьте заявку на ипотеку в Крыму! Семейная 6%, IT 6%, Сельская 0.1%, Военная ипотека. Консультация и подбор программы бесплатно. ☎️ +7 978 128-18-50',
    keywords: 'заявка на ипотеку, оформить ипотеку крым, ипотечный калькулятор, консультация по ипотеке, ипотека онлайн заявка'
  },
  '/add-property': {
    title: 'Разместить объявление | Продать или сдать недвижимость в Крыму | Арендодатель',
    description: '🏠 Разместите объявление о продаже или аренде недвижимости в Крыму бесплатно! Квартиры, дома, участки, коммерческая недвижимость. ☎️ +7 978 128-18-50',
    keywords: 'продать квартиру крым, сдать квартиру севастополь, разместить объявление недвижимость, продать дом крым, сдать в аренду'
  },
  '/privacy-policy': {
    title: 'Политика конфиденциальности | Арендодатель',
    description: 'Политика обработки персональных данных агентства недвижимости Арендодатель - правила и условия работы с вашими данными'
  },
  '/terms-of-service': {
    title: 'Пользовательское соглашение | Арендодатель',
    description: 'Условия предоставления услуг агентства недвижимости Арендодатель в Крыму и Севастополе'
  }
};

export default function SEO({
  title,
  description,
  keywords,
  ogImage = 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg',
  canonicalUrl
}: SEOProps) {
  const location = useLocation();
  
  const pageConfig = seoConfig[location.pathname] || seoConfig['/'];
  const finalTitle = title || pageConfig.title;
  const finalDescription = description || pageConfig.description;
  const finalKeywords = keywords || pageConfig.keywords || '';
  const finalCanonicalUrl = canonicalUrl || `https://ипотекакрым.рф${location.pathname}`;

  useEffect(() => {
    document.title = finalTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDescription);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && finalKeywords) {
      metaKeywords.setAttribute('content', finalKeywords);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', finalTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', finalDescription);
    }
    
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', finalCanonicalUrl);
    }
  }, [finalTitle, finalDescription, finalKeywords, ogImage, finalCanonicalUrl, location.pathname]);

  return null;
}