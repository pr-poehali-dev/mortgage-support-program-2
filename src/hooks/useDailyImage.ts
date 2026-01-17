import { useEffect, useState } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80&fit=crop',
    alt: 'Панорама Севастополя с видом на бухту',
    title: 'Севастополь — город-герой у моря'
  },
  {
    url: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1600&q=80&fit=crop',
    alt: 'Набережная Севастополя на закате',
    title: 'Жизнь у Черного моря в Крыму'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80&fit=crop',
    alt: 'Крымские горы и побережье',
    title: 'Крым — жемчужина у моря'
  },
  {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80&fit=crop',
    alt: 'Южный берег Крыма',
    title: 'Недвижимость на ЮБК'
  },
  {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&fit=crop',
    alt: 'Современные дома в Севастополе',
    title: 'Современное жильё в Севастополе'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&fit=crop',
    alt: 'Морской вид на побережье Крыма',
    title: 'Дом с видом на море в Крыму'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&fit=crop',
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