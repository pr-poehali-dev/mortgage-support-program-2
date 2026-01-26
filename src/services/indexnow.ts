const INDEXNOW_API = 'https://functions.poehali.dev/e96cd64b-29a1-4638-a5e1-b57be7f496c9';
const SITE_HOST = window.location.hostname;
const INDEXNOW_KEY = '8f3e9d2a1c5b4e6f7a8d9c1b2e3f4a5b';

const NOTIFICATION_CACHE_KEY = 'indexnow_notifications';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

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

interface NotificationCache {
  [url: string]: number;
}

function getNotificationCache(): NotificationCache {
  try {
    const cache = localStorage.getItem(NOTIFICATION_CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch {
    return {};
  }
}

function setNotificationCache(cache: NotificationCache): void {
  try {
    localStorage.setItem(NOTIFICATION_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save IndexNow cache:', error);
  }
}

function cleanExpiredCache(cache: NotificationCache): NotificationCache {
  const now = Date.now();
  const cleaned: NotificationCache = {};
  
  Object.entries(cache).forEach(([url, timestamp]) => {
    if (now - timestamp < CACHE_DURATION) {
      cleaned[url] = timestamp;
    }
  });
  
  return cleaned;
}

function shouldNotify(url: string): boolean {
  const cache = cleanExpiredCache(getNotificationCache());
  const lastNotification = cache[url];
  
  if (!lastNotification) return true;
  
  const timeSince = Date.now() - lastNotification;
  return timeSince > CACHE_DURATION;
}

function markAsNotified(urls: string[]): void {
  const cache = cleanExpiredCache(getNotificationCache());
  const now = Date.now();
  
  urls.forEach(url => {
    cache[url] = now;
  });
  
  setNotificationCache(cache);
}

export async function notifyIndexNow(urls: string[], force = false): Promise<IndexNowResponse> {
  const fullUrls = urls.map(url => {
    if (url.startsWith('http')) return url;
    const baseUrl = `${window.location.protocol}//${SITE_HOST}`;
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  });

  const urlsToNotify = force ? fullUrls : fullUrls.filter(shouldNotify);
  
  if (urlsToNotify.length === 0) {
    console.log('IndexNow: All URLs recently notified, skipping');
    return {
      success: true,
      results: [],
      timestamp: new Date().toISOString(),
      urls_submitted: 0
    };
  }

  const response = await fetch(INDEXNOW_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls: urlsToNotify,
      host: SITE_HOST,
      key: INDEXNOW_KEY,
    }),
  });

  if (!response.ok) {
    throw new Error(`IndexNow API error: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.success) {
    markAsNotified(urlsToNotify);
    console.log(`IndexNow: Successfully notified ${urlsToNotify.length} URLs to search engines`);
  }

  return result;
}

export async function notifyCurrentPage(force = false): Promise<IndexNowResponse> {
  const currentUrl = window.location.href;
  return notifyIndexNow([currentUrl], force);
}

export async function notifyMultiplePages(paths: string[], force = false): Promise<IndexNowResponse> {
  return notifyIndexNow(paths, force);
}

export async function notifyAllMainPages(force = false): Promise<IndexNowResponse> {
  const mainPages = [
    '/',
    '/register',
    '/add-property',
    '/privacy-policy',
    '/terms-of-service',
    '/services',
    '/catalog',
    '/calculator',
    '/programs',
    '/online-services',
    '/contact',
    '/faq',
    '/blog',
    '/rent-help',
    '/sell-help'
  ];
  
  return notifyIndexNow(mainPages, force);
}

export async function notifyPropertyPage(propertyId: number, force = false): Promise<IndexNowResponse> {
  return notifyIndexNow([`/property/${propertyId}`], force);
}

export async function notifySitemap(force = false): Promise<IndexNowResponse> {
  const baseUrl = `${window.location.protocol}//${SITE_HOST}`;
  return notifyIndexNow([`${baseUrl}/sitemap.xml`], force);
}

export function clearNotificationCache(): void {
  try {
    localStorage.removeItem(NOTIFICATION_CACHE_KEY);
    console.log('IndexNow: Cache cleared');
  } catch (error) {
    console.warn('Failed to clear IndexNow cache:', error);
  }
}

export function getNotificationStats(): { total: number; recent: number } {
  const cache = getNotificationCache();
  const cleanedCache = cleanExpiredCache(cache);
  
  return {
    total: Object.keys(cache).length,
    recent: Object.keys(cleanedCache).length
  };
}