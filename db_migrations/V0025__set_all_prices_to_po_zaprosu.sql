UPDATE t_p18520385_fulfillment_platform.fulfillments
SET
  storage_price = 'по запросу',
  assembly_price = 'по запросу',
  delivery_price = 'по запросу',
  updated_at = now()
WHERE storage_price IS NOT NULL OR assembly_price IS NOT NULL OR delivery_price IS NOT NULL;