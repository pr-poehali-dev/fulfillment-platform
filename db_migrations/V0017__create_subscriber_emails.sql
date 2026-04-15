CREATE TABLE t_p18520385_fulfillment_platform.subscriber_emails (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);