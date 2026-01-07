-- Добавляем поля для ФИО контакта и ссылки на Rutube
ALTER TABLE t_p26758318_mortgage_support_pro.manual_properties
ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS rutube_link TEXT;