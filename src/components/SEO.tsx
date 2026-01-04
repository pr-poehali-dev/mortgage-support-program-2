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
    title: 'Арендодатель - Агентство недвижимости Крым и Севастополь | Аренда, Продажа, Ипотека',
    description: 'Агентство недвижимости Арендодатель в Крыму и Севастополе. Аренда квартир и домов, продажа недвижимости, помощь с ипотекой. Семейная 6%, IT 6%, Сельская 0.1-3%, Базовая 17%. ☎️ +7 978 128-18-50',
    keywords: 'арендодатель, агентство недвижимости крым, агентство недвижимости севастополь, аренда квартир крым, аренда домов севастополь, продажа недвижимости крым, купить квартиру севастополь, ипотека крым, ипотека севастополь, семейная ипотека, IT ипотека, военная ипотека, сельская ипотека, аренда жилья крым, снять квартиру севастополь, недвижимость симферополь, недвижимость ялта, риэлтор крым, риэлторские услуги севастополь, посуточная аренда, долгосрочная аренда, вторичное жилье, новостройки крым'
  },
  '/register': {
    title: 'Регистрация заявки | Арендодатель - Агентство недвижимости',
    description: 'Оставьте заявку на подбор недвижимости или консультацию по ипотеке в Крыму и Севастополе. Быстрая обработка заявок. ☎️ +7 978 128-18-50'
  },
  '/privacy-policy': {
    title: 'Политика конфиденциальности | Арендодатель',
    description: 'Политика обработки персональных данных агентства недвижимости Арендодатель - правила и условия работы с вашими данными'
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