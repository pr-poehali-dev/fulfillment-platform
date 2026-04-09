
ALTER TABLE fulfillments ADD COLUMN IF NOT EXISTS lead_price NUMERIC(10,2) DEFAULT 500;
ALTER TABLE fulfillments ADD COLUMN IF NOT EXISTS total_leads INTEGER DEFAULT 0;
ALTER TABLE fulfillments ADD COLUMN IF NOT EXISTS balance NUMERIC(10,2) DEFAULT 0;

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS lead_price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'unpaid';

UPDATE fulfillments SET status = 'draft' WHERE status IS NULL OR status = '';
