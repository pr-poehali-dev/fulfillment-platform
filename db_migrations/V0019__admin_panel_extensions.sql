
CREATE TABLE IF NOT EXISTS moderator_notes (
    id SERIAL PRIMARY KEY,
    fulfillment_id INTEGER NOT NULL REFERENCES fulfillments(id),
    admin_email VARCHAR(255) NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS block_reason TEXT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP NULL;

CREATE TABLE IF NOT EXISTS fulfillment_reviews (
    id SERIAL PRIMARY KEY,
    fulfillment_id INTEGER NOT NULL REFERENCES fulfillments(id),
    author_name VARCHAR(255) NOT NULL DEFAULT '',
    author_company VARCHAR(255) NOT NULL DEFAULT '',
    rating INTEGER NOT NULL DEFAULT 5,
    text TEXT NOT NULL DEFAULT '',
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS balance_transactions (
    id SERIAL PRIMARY KEY,
    fulfillment_id INTEGER NOT NULL REFERENCES fulfillments(id),
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    type VARCHAR(20) NOT NULL DEFAULT 'credit',
    description TEXT NOT NULL DEFAULT '',
    admin_email VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
