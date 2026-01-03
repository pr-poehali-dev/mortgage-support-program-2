-- Добавляем расширенные поля для объектов недвижимости по примеру Avito

ALTER TABLE t_p26758318_mortgage_support_pro.manual_properties
ADD COLUMN IF NOT EXISTS operation VARCHAR(20) DEFAULT 'sale',
ADD COLUMN IF NOT EXISTS property_category VARCHAR(50) DEFAULT 'apartment',
ADD COLUMN IF NOT EXISTS building_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS renovation VARCHAR(50),
ADD COLUMN IF NOT EXISTS bathroom VARCHAR(50),
ADD COLUMN IF NOT EXISTS balcony VARCHAR(50),
ADD COLUMN IF NOT EXISTS furniture BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pets_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS children_allowed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS utilities_included BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS prepayment VARCHAR(50),
ADD COLUMN IF NOT EXISTS commission VARCHAR(100),
ADD COLUMN IF NOT EXISTS house_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS wall_material VARCHAR(50),
ADD COLUMN IF NOT EXISTS year_built INTEGER,
ADD COLUMN IF NOT EXISTS ceiling_height NUMERIC(4,2),
ADD COLUMN IF NOT EXISTS cadastral_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS electricity BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS water BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gas BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sewerage BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS land_category VARCHAR(100),
ADD COLUMN IF NOT EXISTS contact_method VARCHAR(50) DEFAULT 'phone';

COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.operation IS 'Операция: sale, rent, daily';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.property_category IS 'Категория: apartment, room, house, land, commercial, garage';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.building_type IS 'Тип здания: secondary, new, old';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.renovation IS 'Ремонт: euro, modern, cosmetic, design, none';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.bathroom IS 'Санузел: combined, separate, multiple';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.balcony IS 'Балкон: balcony, loggia, multiple, none';
