CREATE TABLE IF NOT EXISTS article_stats (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL UNIQUE,
    views_count INTEGER DEFAULT 0,
    shares_telegram INTEGER DEFAULT 0,
    shares_whatsapp INTEGER DEFAULT 0,
    shares_vk INTEGER DEFAULT 0,
    shares_facebook INTEGER DEFAULT 0,
    shares_ok INTEGER DEFAULT 0,
    shares_total INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_stats_article_id ON article_stats(article_id);
CREATE INDEX IF NOT EXISTS idx_article_stats_views ON article_stats(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_article_stats_shares ON article_stats(shares_total DESC);

INSERT INTO article_stats (article_id, views_count, shares_total)
SELECT generate_series, 0, 0 FROM generate_series(1, 12)
ON CONFLICT (article_id) DO NOTHING;
