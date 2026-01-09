-- Создание таблицы для отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) DEFAULT 'website',
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрой выборки одобренных отзывов
CREATE INDEX idx_reviews_approved ON reviews(is_approved, review_date DESC);

-- Комментарии к таблице
COMMENT ON TABLE reviews IS 'Таблица для хранения отзывов клиентов';
COMMENT ON COLUMN reviews.source IS 'Источник отзыва: website, yandex, google и т.д.';
COMMENT ON COLUMN reviews.is_approved IS 'Флаг модерации отзыва администратором';