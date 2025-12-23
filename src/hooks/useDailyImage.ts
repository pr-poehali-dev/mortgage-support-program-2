import { useEffect, useState } from 'react';

const images = [
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/31597f26-2abe-48c6-949c-e47169e4f980.jpg',
    alt: 'Счастливая семья с ключами от нового дома',
    title: 'Ваша мечта об идеальном доме'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/a9b2b7d3-08f2-4654-8846-305e6e4e4a72.jpg',
    alt: 'Современный интерьер квартиры',
    title: 'Комфортное пространство для жизни'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/8976bf92-c0d9-4853-9e1c-47f1952c59d1.jpg',
    alt: 'Красивый загородный дом',
    title: 'Собственный дом вашей мечты'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/bc4b1b3e-67f2-494f-8372-c623ca361322.jpg',
    alt: 'Подписание ипотечных документов',
    title: 'Профессиональное сопровождение сделки'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/1a3d4d0e-d793-46f3-b868-e1af25dbd70b.jpg',
    alt: 'Новый жилой комплекс',
    title: 'Современные жилые комплексы'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/886057d5-d836-4f1c-a498-6804269c9d75.jpg',
    alt: 'Ключи и ипотечные документы',
    title: 'Простое оформление ипотеки'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/c837d9b9-ac83-44cb-a474-f4147ea5dce3.jpg',
    alt: 'Недвижимость в Крыму у моря',
    title: 'Жильё в Крыму у моря'
  }
];

export function useDailyImage() {
  const [image, setImage] = useState(images[0]);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const imageIndex = dayOfYear % images.length;
    
    setImage(images[imageIndex]);
  }, []);

  return image;
}
