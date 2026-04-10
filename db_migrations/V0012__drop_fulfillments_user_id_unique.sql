-- Убираем UNIQUE constraint на user_id в таблице fulfillments
-- Один пользователь теперь может иметь несколько фулфилментов
ALTER TABLE fulfillments DROP CONSTRAINT IF EXISTS fulfillments_user_id_key;