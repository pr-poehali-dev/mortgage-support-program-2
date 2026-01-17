import { useEffect, useState } from 'react';

const images = [
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/68d6c5ff-d99f-4e9f-a29c-674a4743e077.jpg',
    alt: 'Панорама Севастополя с видом на бухту',
    title: 'Севастополь — город-герой у моря'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/619f0b65-2d55-479f-a06e-35e0937adaa7.jpg',
    alt: 'Набережная Севастополя на закате',
    title: 'Жизнь у Черного моря в Крыму'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/36a03ba1-7dbb-4775-a463-74656e0be2ca.jpg',
    alt: 'Крымские горы и побережье',
    title: 'Крым — жемчужина у моря'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/2a691af1-d7c1-4e8f-b760-aa7d9cb5e211.jpg',
    alt: 'Южный берег Крыма',
    title: 'Недвижимость на ЮБК'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/619f0b65-2d55-479f-a06e-35e0937adaa7.jpg',
    alt: 'Современные дома в Севастополе',
    title: 'Современное жильё в Севастополе'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/36a03ba1-7dbb-4775-a463-74656e0be2ca.jpg',
    alt: 'Морской вид на побережье Крыма',
    title: 'Дом с видом на море в Крыму'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/68d6c5ff-d99f-4e9f-a29c-674a4743e077.jpg',
    alt: 'Уютный дом на побережье',
    title: 'Жильё вашей мечты в Крыму'
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