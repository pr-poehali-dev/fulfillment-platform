-- Таблица для rate limiting (попытки логина, регистрации и др.)
CREATE TABLE IF NOT EXISTS t_p18520385_fulfillment_platform.rate_limits (
  id SERIAL PRIMARY KEY,
  bucket VARCHAR(64) NOT NULL,        -- 'login', 'register', 'forgot', etc.
  identifier VARCHAR(255) NOT NULL,   -- IP или email
  attempted_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_bucket_id_time
  ON t_p18520385_fulfillment_platform.rate_limits (bucket, identifier, attempted_at);
