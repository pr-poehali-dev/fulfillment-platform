
ALTER TABLE fulfillments ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}';
