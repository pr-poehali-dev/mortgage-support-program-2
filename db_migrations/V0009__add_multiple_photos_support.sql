-- Добавление поддержки множественных фотографий для объектов недвижимости
ALTER TABLE t_p26758318_mortgage_support_pro.manual_properties 
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Копируем существующие photo_url в массив photos (если есть данные)
UPDATE t_p26758318_mortgage_support_pro.manual_properties 
SET photos = ARRAY[photo_url]
WHERE photo_url IS NOT NULL AND photo_url != '' AND (photos IS NULL OR array_length(photos, 1) IS NULL);