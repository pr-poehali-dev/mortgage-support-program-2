CREATE TABLE IF NOT EXISTS t_p26758318_mortgage_support_pro.client_properties (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES t_p26758318_mortgage_support_pro.clients(id),
    title VARCHAR(255) NOT NULL,
    property_type VARCHAR(100),
    address TEXT,
    area NUMERIC(10,2),
    rooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    price NUMERIC(15,2),
    description TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);