interface SendNewsletterParams {
  articleId: number;
  articleTitle: string;
  articleExcerpt: string;
}

const SEND_NEWSLETTER_URL = 'https://functions.poehali.dev/bf3c5f7a-e853-430a-9af7-a2c075039947';

export async function sendNewsletter(params: SendNewsletterParams): Promise<{ success: boolean; sent_count?: number; error?: string }> {
  try {
    const response = await fetch(SEND_NEWSLETTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article_id: params.articleId,
        article_title: params.articleTitle,
        article_excerpt: params.articleExcerpt
      })
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.error || 'Ошибка отправки рассылки' };
    }

    const data = await response.json();
    return { success: true, sent_count: data.sent_count };
  } catch (error) {
    console.error('Newsletter send error:', error);
    return { success: false, error: 'Сетевая ошибка при отправке рассылки' };
  }
}
