-- Таблица для ручного добавления объектов недвижимости
CREATE TABLE IF NOT EXISTS t_p26758318_mortgage_support_pro.manual_properties (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- apartment, house, land, commercial
    price BIGINT NOT NULL,
    location TEXT NOT NULL,
    area NUMERIC(10,2),
    rooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    land_area NUMERIC(10,2),
    photo_url TEXT,
    description TEXT,
    features TEXT[], -- массив особенностей
    property_link TEXT, -- ссылка на объявление
    price_type VARCHAR(20) DEFAULT 'total',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manual_properties_type ON t_p26758318_mortgage_support_pro.manual_properties(type);
CREATE INDEX idx_manual_properties_active ON t_p26758318_mortgage_support_pro.manual_properties(is_active);

COMMENT ON TABLE t_p26758318_mortgage_support_pro.manual_properties IS 'Объекты недвижимости добавленные вручную';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.type IS 'Тип: apartment, house, land, commercial';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.features IS 'Массив особенностей объекта';