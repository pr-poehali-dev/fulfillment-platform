
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'fulfillment',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE email_codes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) NOT NULL DEFAULT 'verify',
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE fulfillments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL DEFAULT '',
    inn VARCHAR(20) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    warehouse_area INTEGER DEFAULT 0,
    founded_year INTEGER DEFAULT 0,
    description TEXT DEFAULT '',
    detailed_description TEXT DEFAULT '',
    logo VARCHAR(500) DEFAULT '',
    photos TEXT[] DEFAULT '{}',
    contact_name VARCHAR(255) DEFAULT '',
    contact_email VARCHAR(255) DEFAULT '',
    contact_phone VARCHAR(100) DEFAULT '',
    contact_tg VARCHAR(100) DEFAULT '',
    work_schemes TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    packaging_types TEXT[] DEFAULT '{}',
    marketplaces TEXT[] DEFAULT '{}',
    storage_price VARCHAR(100) DEFAULT '',
    assembly_price VARCHAR(100) DEFAULT '',
    delivery_price VARCHAR(100) DEFAULT '',
    storage_rate NUMERIC(10,2) DEFAULT 0,
    assembly_rate NUMERIC(10,2) DEFAULT 0,
    delivery_rate NUMERIC(10,2) DEFAULT 0,
    min_volume VARCHAR(100) DEFAULT '',
    has_trial BOOLEAN DEFAULT FALSE,
    team_size INTEGER DEFAULT 0,
    working_hours VARCHAR(100) DEFAULT '',
    certificates TEXT[] DEFAULT '{}',
    services JSONB DEFAULT '[]',
    badge VARCHAR(100) DEFAULT '',
    badge_color VARCHAR(20) DEFAULT 'blue',
    rating NUMERIC(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    moderation_comment TEXT DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE quote_requests (
    id SERIAL PRIMARY KEY,
    fulfillment_id INTEGER NOT NULL REFERENCES fulfillments(id),
    sender_name VARCHAR(255) NOT NULL,
    sender_company VARCHAR(255) DEFAULT '',
    sender_email VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(100) NOT NULL,
    sku_count INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    message TEXT DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_email_codes_user ON email_codes(user_id);
CREATE INDEX idx_fulfillments_user ON fulfillments(user_id);
CREATE INDEX idx_fulfillments_status ON fulfillments(status);
CREATE INDEX idx_quote_requests_fulfillment ON quote_requests(fulfillment_id);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
