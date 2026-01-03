-- Таблица для хранения фото к объявлениям Avito
CREATE TABLE IF NOT EXISTS t_p26758318_mortgage_support_pro.avito_listing_photos (
    id SERIAL PRIMARY KEY,
    avito_id BIGINT NOT NULL UNIQUE,
    photo_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_avito_listing_photos_avito_id ON t_p26758318_mortgage_support_pro.avito_listing_photos(avito_id);

COMMENT ON TABLE t_p26758318_mortgage_support_pro.avito_listing_photos IS 'Фотографии для объявлений Avito';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.avito_listing_photos.avito_id IS 'ID объявления на Avito';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.avito_listing_photos.photo_url IS 'URL фотографии в S3';
COMMENT ON COLUMN t_p26758318_mortgage_support_pro.avito_listing_photos.description IS 'Описание объявления';