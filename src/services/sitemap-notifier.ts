const SITE_URL = window.location.origin;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

interface SitemapNotificationResult {
  google: { success: boolean; message: string };
  yandex: { success: boolean; message: string };
  bing: { success: boolean; message: string };
}

export async function notifySitemapToSearchEngines(): Promise<SitemapNotificationResult> {
  const results: SitemapNotificationResult = {
    google: { success: false, message: '' },
    yandex: { success: false, message: '' },
    bing: { success: false, message: '' }
  };

  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const googleResponse = await fetch(googlePingUrl, { 
      method: 'GET',
      mode: 'no-cors'
    });
    results.google = {
      success: true,
      message: 'Sitemap отправлен в Google'
    };
  } catch (error) {
    results.google = {
      success: false,
      message: `Ошибка отправки в Google: ${error}`
    };
  }

  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const bingResponse = await fetch(bingPingUrl, {
      method: 'GET', 
      mode: 'no-cors'
    });
    results.bing = {
      success: true,
      message: 'Sitemap отправлен в Bing'
    };
  } catch (error) {
    results.bing = {
      success: false,
      message: `Ошибка отправки в Bing: ${error}`
    };
  }

  try {
    const yandexPingUrl = `https://webmaster.yandex.ru/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const yandexResponse = await fetch(yandexPingUrl, {
      method: 'GET',
      mode: 'no-cors'
    });
    results.yandex = {
      success: true,
      message: 'Sitemap отправлен в Яндекс'
    };
  } catch (error) {
    results.yandex = {
      success: false,
      message: `Ошибка отправки в Яндекс: ${error}`
    };
  }

  const lastNotification = new Date().toISOString();
  localStorage.setItem('sitemap_last_notification', lastNotification);

  return results;
}

export function getLastSitemapNotification(): string | null {
  return localStorage.getItem('sitemap_last_notification');
}

export function shouldNotifySitemap(): boolean {
  const lastNotif = getLastSitemapNotification();
  if (!lastNotif) return true;
  
  const daysSinceLastNotif = (Date.now() - new Date(lastNotif).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceLastNotif >= 7;
}
