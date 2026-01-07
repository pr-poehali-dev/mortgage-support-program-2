/**
 * Сжимает изображение до указанного размера без потери качества
 * @param file - исходный файл изображения
 * @param maxSizeMB - максимальный размер в МБ (по умолчанию 1)
 * @param maxWidthOrHeight - максимальная ширина/высота (по умолчанию 1920)
 * @returns Promise с сжатым файлом
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Вычисляем новые размеры с сохранением пропорций
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Рисуем изображение с улучшенным качеством
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Функция для сжатия с динамическим качеством
        const compressWithQuality = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const maxSize = maxSizeMB * 1024 * 1024; // МБ в байты
              
              // Если размер больше лимита и качество можно снизить - пробуем снова
              if (blob.size > maxSize && quality > 0.1) {
                compressWithQuality(quality - 0.1);
                return;
              }
              
              // Создаём новый файл с сжатым содержимым
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.\w+$/, '.jpg'), // Конвертируем в JPG
                { type: 'image/jpeg', lastModified: Date.now() }
              );
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        
        // Начинаем с качества 0.9
        compressWithQuality(0.9);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Конвертирует сжатый файл в base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to convert file to base64'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Форматирует размер файла в читаемый вид
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
