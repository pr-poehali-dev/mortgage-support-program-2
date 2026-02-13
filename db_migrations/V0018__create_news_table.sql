
CREATE TABLE t_p26758318_mortgage_support_pro.news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    photo_url TEXT,
    photos TEXT[] DEFAULT '{}',
    source VARCHAR(200),
    source_url TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_published BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_news_slug ON t_p26758318_mortgage_support_pro.news(slug);
CREATE INDEX idx_news_published ON t_p26758318_mortgage_support_pro.news(is_published, created_at DESC);
CREATE INDEX idx_news_category ON t_p26758318_mortgage_support_pro.news(category);
