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
    title: 'Ипотека Крым | Семейная, IT, Сельская, Военная, Базовая ипотека от 0.1%',
    description: 'Специалист по ипотеке в Крыму. Семейная 6%, IT 6%, Военная, Сельская 0.1-3%, Базовая 17%. Помощь в подборе программы, оформлении документов и сопровождении сделки. ☎️ +7 978 128-18-50',
    keywords: 'ипотека крым, семейная ипотека, IT ипотека, военная ипотека, сельская ипотека, базовая ипотека, ипотека симферополь, ипотека севастополь, ипотека ялта, ипотека феодосия, льготная ипотека, ипотека с господдержкой, ипотека под низкий процент, ипотечный кредит, ипотека на квартиру, ипотека на дом, ипотека новостройка, ипотека вторичка, первоначальный взнос, ипотечный калькулятор, рефинансирование ипотеки, одобрение ипотеки, оформление ипотеки, документы на ипотеку, специалист по ипотеке, ипотечный брокер крым, консультация по ипотеке, помощь в получении ипотеки, ипотека молодая семья, материнский капитал ипотека, ипотека многодетным, дальневосточная ипотека крым, программы ипотеки РФ, ставки по ипотеке, условия ипотеки, банки ипотека крым'
  },
  '/register': {
    title: 'Регистрация на ипотеку | Ипотека Крым',
    description: 'Заполните онлайн-заявку на ипотеку в Крыму. Быстрое оформление документов, помощь специалиста на каждом этапе. ☎️ +7 978 128-18-50'
  },
  '/privacy-policy': {
    title: 'Политика конфиденциальности | Ипотека Крым',
    description: 'Политика обработки персональных данных ИП Николаев Д.Ю. - правила и условия работы с вашими данными'
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
