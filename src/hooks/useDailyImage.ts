import { useEffect, useState } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1586276393635-5ecd8a851acc?w=1600&q=80',
    alt: 'Панорама Севастополя с видом на бухту',
    title: 'Севастополь — город-герой у моря'
  },
  {
    url: 'https://images.unsplash.com/photo-1598894116651-29f7b3fc4f2d?w=1600&q=80',
    alt: 'Набережная Севастополя на закате',
    title: 'Жизнь у Черного моря в Крыму'
  },
  {
    url: 'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=1600&q=80',
    alt: 'Крымские горы и побережье',
    title: 'Крым — жемчужина у моря'
  },
  {
    url: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=1600&q=80',
    alt: 'Южный берег Крыма',
    title: 'Недвижимость на ЮБК'
  },
  {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
    alt: 'Современные дома в Севастополе',
    title: 'Современное жильё в Севастополе'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
    alt: 'Морской вид на побережье Крыма',
    title: 'Дом с видом на море в Крыму'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
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