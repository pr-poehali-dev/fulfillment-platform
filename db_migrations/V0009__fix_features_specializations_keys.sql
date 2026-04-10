UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','temp_control','returns'],
  specializations = ARRAY['electronics','clothing'],
  packaging_types = ARRAY['Короба','Паллеты','Пакеты']
WHERE contact_email = 'test_msk_logistics@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['honest_mark','cameras'],
  specializations = ARRAY['cosmetics','small_goods'],
  packaging_types = ARRAY['Короб','Пузырчатая плёнка','Стрейч']
WHERE contact_email = 'test_spb_sklad@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','returns','shipment_prep'],
  specializations = ARRAY['construction','appliances'],
  packaging_types = ARRAY['Паллеты','Короб']
WHERE contact_email = 'test_ekb_express@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['honest_mark','returns'],
  specializations = ARRAY['small_goods','clothing'],
  packaging_types = ARRAY['Пакеты','Короб','Пузырчатая плёнка']
WHERE contact_email = 'test_kzn_fulf@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','temp_control','defect_check','shipment_prep'],
  specializations = ARRAY['electronics','small_goods'],
  packaging_types = ARRAY['Паллеты','Короб','Пакеты','Стрейч']
WHERE contact_email = 'test_nsk_store@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['returns','shipment_prep'],
  specializations = ARRAY['clothing','small_goods'],
  packaging_types = ARRAY['Пакеты','Короб']
WHERE contact_email = 'test_rnd_pack@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','barcode_check','shipment_prep'],
  specializations = ARRAY['electronics','appliances'],
  packaging_types = ARRAY['Короб','Паллеты']
WHERE contact_email = 'test_smr_wms@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['seller_packaging','defect_check'],
  specializations = ARRAY['small_goods','cosmetics'],
  packaging_types = ARRAY['Пакеты','Пузырчатая плёнка','Короб']
WHERE contact_email = 'test_ufa_cargo@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','temp_control','returns','same_day','dangerous','honest_mark'],
  specializations = ARRAY['electronics','clothing','cosmetics','small_goods'],
  packaging_types = ARRAY['Паллеты','Короб','Пакеты','Стрейч','Пузырчатая плёнка']
WHERE contact_email = 'test_msk_mega@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['honest_mark','defect_check','barcode_check'],
  specializations = ARRAY['clothing','small_goods'],
  packaging_types = ARRAY['Короб','Пакеты']
WHERE contact_email = 'test_spb_wildpack@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['temp_control','returns','shipment_prep'],
  specializations = ARRAY['small_goods','construction'],
  packaging_types = ARRAY['Паллеты','Короб','Стрейч']
WHERE contact_email = 'test_krd_south@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','cargo_receive','defect_check'],
  specializations = ARRAY['electronics','appliances'],
  packaging_types = ARRAY['Паллеты','Деревянная обрешётка','Стрейч']
WHERE contact_email = 'test_msk_ozon_pro@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['seller_packaging','defect_check','honest_mark'],
  specializations = ARRAY['cosmetics','small_goods'],
  packaging_types = ARRAY['Подарочные коробки','Пакеты','Пузырчатая плёнка']
WHERE contact_email = 'test_spb_premium@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['returns','shipment_prep'],
  specializations = ARRAY['small_goods','appliances'],
  packaging_types = ARRAY['Пакеты','Короб']
WHERE contact_email = 'test_nsk_economy@example.com';

UPDATE t_p18520385_fulfillment_platform.fulfillments SET
  features = ARRAY['cameras','honest_mark','barcode_check','shipment_prep'],
  specializations = ARRAY['electronics','appliances','small_goods'],
  packaging_types = ARRAY['Паллеты','Короб','Пакеты']
WHERE contact_email = 'test_ekb_fullstock@example.com';
