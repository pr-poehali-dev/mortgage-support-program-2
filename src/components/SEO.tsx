import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = 'Ипотека Крым 2025-2026 | Семейная, IT, Сельская, Военная, Базовая ипотека от 0.1%',
  description = 'Специалист по ипотеке в Крыму. Семейная 6%, IT 6%, Военная, Сельская 0.1-3%, Базовая 17%. Помощь в подборе программы, оформлении документов и сопровождении сделки. ☎️ +7 978 128-18-50',
  keywords = 'ипотека крым, семейная ипотека, IT ипотека, военная ипотека, сельская ипотека, базовая ипотека, ипотека 2025',
  ogImage = 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/f370c3f9-abf4-4e5f-928a-9cde6c4a8ee0.jpg',
  canonicalUrl = 'https://ипотекакрым.рф/'
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
}
