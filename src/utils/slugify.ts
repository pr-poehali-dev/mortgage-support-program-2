/**
 * Преобразует текст в SEO-friendly URL slug
 * Пример: "Квартира в Ялте" -> "kvartira-v-yalte"
 */
export function slugify(text: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  return text
    .toLowerCase()
    .trim()
    .split('')
    .map(char => cyrillicToLatin[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Генерирует уникальный slug с ID на конце
 * Пример: "Квартира в Ялте" + id:123 -> "kvartira-v-yalte-123"
 */
export function generatePropertySlug(title: string, id: number): string {
  const baseSlug = slugify(title);
  return `${baseSlug}-${id}`;
}
