-- Добавление полей для координат объектов недвижимости
ALTER TABLE t_p26758318_mortgage_support_pro.manual_properties 
ADD COLUMN latitude NUMERIC(10, 8),
ADD COLUMN longitude NUMERIC(11, 8);

-- Добавление комментариев к полям
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.latitude IS 'Широта объекта';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.manual_properties.longitude IS 'Долгота объекта';