const INDEXNOW_API = 'https://functions.poehali.dev/e96cd64b-29a1-4638-a5e1-b57be7f496c9';
const SITE_HOST = window.location.hostname;
const INDEXNOW_KEY = '8f3e9d2a1c5b4e6f7a8d9c1b2e3f4a5b';

interface IndexNowResponse {
  success: boolean;
  results: Array<{
    engine: string;
    status: string;
    statusCode?: number;
    urls_count?: number;
    error?: string;
  }>;
  timestamp: string;
  urls_submitted: number;
}

export async function notifyIndexNow(urls: string[]): Promise<IndexNowResponse> {
  const fullUrls = urls.map(url => {
    if (url.startsWith('http')) return url;
    const baseUrl = `${window.location.protocol}//${SITE_HOST}`;
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  });

  const response = await fetch(INDEXNOW_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls: fullUrls,
      host: SITE_HOST,
      key: INDEXNOW_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error(`IndexNow API error: ${response.status}`);
  }

  return response.json();
}

export async function notifyCurrentPage(): Promise<IndexNowResponse> {
  const currentUrl = window.location.href;
  return notifyIndexNow([currentUrl]);
}

export async function notifyMultiplePages(paths: string[]): Promise<IndexNowResponse> {
  return notifyIndexNow(paths);
}

export async function notifySitemap(): Promise<IndexNowResponse> {
  const commonPages = [
    '/',
    '/#programs',
    '/#comparison',
    '/#calculator',
    '/#catalog',
    '/#documents',
    '/#faq',
    '/#blog',
    '/#contact',
    '/admin',
  ];
  
  return notifyIndexNow(commonPages);
}

export async function notifySitemapXml(): Promise<IndexNowResponse> {
  const baseUrl = `${window.location.protocol}//${SITE_HOST}`;
  return notifyIndexNow([`${baseUrl}/sitemap.xml`]);
}