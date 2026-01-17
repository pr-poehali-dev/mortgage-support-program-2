export interface Property {
  id: number;
  title: string;
  type: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  land_area?: number;
  photo_url?: string;
  photos?: string[];
  description?: string;
  property_link?: string;
  phone?: string;
  contact_name?: string;
  rutube_link?: string;
  operation?: string;
  property_category?: string;
  building_type?: string;
  renovation?: string;
  bathroom?: string;
  balcony?: string;
  furniture?: boolean;
  pets_allowed?: boolean;
  children_allowed?: boolean;
  utilities_included?: boolean;
  wall_material?: string;
  contact_method?: string;
  documents?: string[];
}

export interface PropertyFormData {
  title: string;
  type: string;
  property_category: string;
  operation: string;
  price: string;
  location: string;
  area: string;
  rooms: string;
  floor: string;
  total_floors: string;
  land_area: string;
  photo_url: string;
  photos: string[];
  documents: string[];
  description: string;
  property_link: string;
  phone: string;
  contact_name: string;
  rutube_link: string;
  building_type: string;
  renovation: string;
  bathroom: string;
  balcony: string;
  furniture: boolean;
  pets_allowed: boolean;
  children_allowed: boolean;
  utilities_included: boolean;
  wall_material: string;
  contact_method: string;
}

export const PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';
