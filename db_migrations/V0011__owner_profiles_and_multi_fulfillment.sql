-- Таблица профилей владельцев фулфилментов
CREATE TABLE IF NOT EXISTS owner_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    contact_name VARCHAR(255) NOT NULL DEFAULT '',
    contact_email VARCHAR(255) NOT NULL DEFAULT '',
    contact_phone VARCHAR(100) NOT NULL DEFAULT '',
    contact_tg VARCHAR(100) NOT NULL DEFAULT '',
    inn VARCHAR(20) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Добавляем поле owner_profile_id в fulfillments
ALTER TABLE fulfillments ADD COLUMN IF NOT EXISTS owner_profile_id INTEGER REFERENCES owner_profiles(id);

-- Заполняем owner_profiles для существующих пользователей из fulfillments
INSERT INTO owner_profiles (user_id, contact_name, contact_email, contact_phone, contact_tg, inn)
SELECT DISTINCT ON (f.user_id) f.user_id,
    COALESCE(f.contact_name, ''),
    COALESCE(f.contact_email, ''),
    COALESCE(f.contact_phone, ''),
    COALESCE(f.contact_tg, ''),
    COALESCE(f.inn, '')
FROM fulfillments f
ON CONFLICT (user_id) DO NOTHING;

-- Обновляем owner_profile_id в fulfillments
UPDATE fulfillments f
SET owner_profile_id = op.id
FROM owner_profiles op
WHERE op.user_id = f.user_id AND f.owner_profile_id IS NULL;

-- Индексы
CREATE INDEX IF NOT EXISTS idx_fulfillments_user_id ON fulfillments(user_id);
CREATE INDEX IF NOT EXISTS idx_owner_profiles_user_id ON owner_profiles(user_id);