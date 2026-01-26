import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PropertyCatalog from '@/components/PropertyCatalog';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Catalog() {
  const theme = useDailyTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Каталог недвижимости - Арендодатель"
        description="Квартиры и дома в Севастополе и Крыму. Большой выбор объектов недвижимости для покупки и аренды."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <PropertyCatalog />
      </main>
      <Footer />
    </div>
  );
}
