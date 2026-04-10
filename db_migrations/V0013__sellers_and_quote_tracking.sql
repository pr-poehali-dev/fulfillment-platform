-- Добавляем поля к quote_requests:
-- seller_id — ссылка на пользователя-селлера (создаётся автоматически при запросе КП)
-- viewed_by_fulfillment — фулфилмент просмотрел заявку
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS seller_id INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS viewed_by_fulfillment BOOLEAN NOT NULL DEFAULT FALSE;

-- Индекс для быстрой выборки заявок по селлеру
CREATE INDEX IF NOT EXISTS idx_quote_requests_seller_id ON quote_requests(seller_id);

-- Таблица sellers — профиль продавца/селлера
CREATE TABLE IF NOT EXISTS sellers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  name VARCHAR(255) NOT NULL DEFAULT '',
  company VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);