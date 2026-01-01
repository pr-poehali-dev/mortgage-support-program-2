-- Добавление полей для полной регистрации клиентов
ALTER TABLE t_p26758318_mortgage_support_pro.clients
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS birth_place VARCHAR(255),
  ADD COLUMN IF NOT EXISTS passport_series VARCHAR(10),
  ADD COLUMN IF NOT EXISTS passport_number VARCHAR(10),
  ADD COLUMN IF NOT EXISTS passport_issue_date DATE,
  ADD COLUMN IF NOT EXISTS passport_issuer TEXT,
  ADD COLUMN IF NOT EXISTS registration_address TEXT,
  ADD COLUMN IF NOT EXISTS inn VARCHAR(20),
  ADD COLUMN IF NOT EXISTS snils VARCHAR(20),
  ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50),
  ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employment_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS employer VARCHAR(255),
  ADD COLUMN IF NOT EXISTS position VARCHAR(255),
  ADD COLUMN IF NOT EXISTS work_experience VARCHAR(100),
  ADD COLUMN IF NOT EXISTS monthly_income DECIMAL(15, 2),
  ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN DEFAULT FALSE;

-- Добавление полей для заявок с данными имущества
ALTER TABLE t_p26758318_mortgage_support_pro.requests
  ADD COLUMN IF NOT EXISTS property_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS property_address TEXT,
  ADD COLUMN IF NOT EXISTS property_cost DECIMAL(15, 2),
  ADD COLUMN IF NOT EXISTS initial_payment DECIMAL(15, 2),
  ADD COLUMN IF NOT EXISTS credit_term INTEGER,
  ADD COLUMN IF NOT EXISTS additional_info TEXT;

-- Создание таблицы для результатов опроса/квиза
CREATE TABLE IF NOT EXISTS t_p26758318_mortgage_support_pro.quiz_results (
  id SERIAL PRIMARY KEY,
  client_id INTEGER,
  session_id VARCHAR(100),
  category VARCHAR(50),
  region VARCHAR(50),
  loan_amount_range VARCHAR(50),
  recommended_program VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_quiz_results_client_id ON t_p26758318_mortgage_support_pro.quiz_results(client_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON t_p26758318_mortgage_support_pro.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_clients_registration_completed ON t_p26758318_mortgage_support_pro.clients(registration_completed);