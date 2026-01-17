import { useEffect, useState } from 'react';

const images = [
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/cbfb12b5-512b-406b-9a9c-953fd7c1ff88.jpg',
    alt: 'Панорама Севастополя с видом на бухту',
    title: 'Севастополь — город-герой у моря'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/63497d35-f23c-45c0-8316-e30d363e4019.jpg',
    alt: 'Набережная Севастополя на закате',
    title: 'Жизнь у Черного моря в Крыму'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4ccbf1e0-8ee1-407f-875f-8ad05d34a21d.jpg',
    alt: 'Крымские горы и побережье',
    title: 'Крым — жемчужина у моря'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/406f9572-1c39-447f-9ca3-0b659acad296.jpg',
    alt: 'Южный берег Крыма',
    title: 'Недвижимость на ЮБК'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/5d5f75a0-f04e-4bec-875d-a403ea7c0677.jpg',
    alt: 'Современные дома в Севастополе',
    title: 'Современное жильё в Севастополе'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/8afd8f01-3199-4571-82bc-bd99f03d5c36.jpg',
    alt: 'Морской вид на побережье Крыма',
    title: 'Дом с видом на море в Крыму'
  },
  {
    url: 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/3b02c0ed-4381-4210-be81-ade0255be679.jpg',
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