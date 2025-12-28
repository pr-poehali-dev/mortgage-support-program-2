import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { crimeaCities } from '@/data/crimea-cities';
import { trackApplicationSent, trackCitySelected, trackFormSubmitted } from '@/services/analytics';
import CityFilterAndSearch from '@/components/home/regions/CityFilterAndSearch';
import CrimeaMapSVG from '@/components/home/regions/CrimeaMapSVG';
import DistrictsGrid from '@/components/home/regions/DistrictsGrid';
import ApplicationForm from '@/components/home/regions/ApplicationForm';

export default function RegionsMapSection() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'city' | 'town'>('all');

  const filteredCities = useMemo(() => {
    let cities = crimeaCities;
    
    if (filterType !== 'all') {
      cities = cities.filter(city => city.type === filterType);
    }
    
    if (searchQuery) {
      cities = cities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return cities;
  }, [searchQuery, filterType]);

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setFormData({ ...formData, city });
    setShowForm(true);
    trackCitySelected(city);
    
    setTimeout(() => {
      document.getElementById('region-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/927c8f65-0024-4ded-8d22-24987e241c4e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        trackApplicationSent('region_map', 0);
        trackFormSubmitted(formData.city, 'region_map');
        
        toast({
          title: '✅ Заявка отправлена!',
          description: `${formData.name}, мы свяжемся с вами по номеру ${formData.phone}`,
        });
        setShowForm(false);
        setFormData({ name: '', phone: '', city: '' });
      } else {
        toast({
          title: '❌ Ошибка',
          description: 'Не удалось отправить заявку. Позвоните нам: +7 978 128-18-50',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заявку. Позвоните нам: +7 978 128-18-50',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
        Работаю во всех районах Крыма
      </h2>
      
      <CityFilterAndSearch
        filterType={filterType}
        setFilterType={setFilterType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCities={filteredCities}
        onCityClick={handleCityClick}
      />
      
      <CrimeaMapSVG
        filteredCities={filteredCities}
        onCityClick={handleCityClick}
      />

      <DistrictsGrid
        onCityClick={handleCityClick}
        filteredCitiesCount={filteredCities.length}
      />
      
      <ApplicationForm
        showForm={showForm}
        selectedCity={selectedCity}
        formData={formData}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        onFormDataChange={setFormData}
      />
    </div>
  );
}