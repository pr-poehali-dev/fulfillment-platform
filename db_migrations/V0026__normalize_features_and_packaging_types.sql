-- Нормализация features: текстовые метки → ключи, дедупликация

UPDATE t_p18520385_fulfillment_platform.fulfillments
SET features = (
  SELECT array_agg(DISTINCT mapped) FROM (
    SELECT
      CASE unnested
        WHEN 'Видеонаблюдение'       THEN 'cameras'
        WHEN 'Обработка возвратов'   THEN 'returns'
        WHEN 'Температурный режим'   THEN 'temp_control'
        WHEN 'Опасные грузы'         THEN 'dangerous'
        WHEN 'Фотосъёмка товаров'    THEN 'cameras'
        WHEN 'Маркировка Честный Знак' THEN 'honest_mark'
        WHEN 'Сборка день в день'    THEN 'same_day'
        WHEN 'Упаковка под ключ'     THEN 'packaging'
        WHEN 'marking'               THEN 'honest_mark'
        WHEN 'assembly_kits'         THEN 'shipment_prep'
        ELSE unnested
      END AS mapped
    FROM unnest(features) AS unnested
    WHERE unnested IS NOT NULL AND unnested != ''
  ) sub
  WHERE mapped IN (
    'cameras','dangerous','returns','same_day','temp_control',
    'honest_mark','defect_check','seller_packaging','shipment_prep',
    'barcode_check','cargo_receive','packaging'
  )
)
WHERE features IS NOT NULL AND array_length(features, 1) > 0;

-- Нормализация packaging_types: сокращения и варианты → полные названия, дедупликация

UPDATE t_p18520385_fulfillment_platform.fulfillments
SET packaging_types = (
  SELECT array_agg(DISTINCT mapped) FROM (
    SELECT
      CASE unnested
        WHEN 'ВПП'                          THEN 'Воздушно-пузырьковая плёнка (ВПП)'
        WHEN 'Пузырчатая плёнка'            THEN 'Воздушно-пузырьковая плёнка (ВПП)'
        WHEN 'ПОФ'                          THEN 'Термоусадочная плёнка (ПОФ)'
        WHEN 'Полиэтилен'                   THEN 'Полиэтилен (ПВД)'
        WHEN 'Короб'                        THEN 'Коробка (картон)'
        WHEN 'Короба'                       THEN 'Коробка (картон)'
        WHEN 'Пакеты'                       THEN 'Фирменные пакеты'
        WHEN 'Стрейч'                       THEN 'Термоусадочная плёнка (ПОФ)'
        WHEN 'Паллеты'                      THEN 'Деревянная обрешётка'
        WHEN 'Подарочные коробки'           THEN 'Индивидуальная упаковка'
        ELSE unnested
      END AS mapped
    FROM unnest(packaging_types) AS unnested
    WHERE unnested IS NOT NULL AND unnested != ''
  ) sub
  WHERE mapped IN (
    'Полиэтилен (ПВД)','Коробка (картон)','Воздушно-пузырьковая плёнка (ВПП)',
    'Термоусадочная плёнка (ПОФ)','Деревянная обрешётка','Фирменные пакеты','Индивидуальная упаковка'
  )
)
WHERE packaging_types IS NOT NULL AND array_length(packaging_types, 1) > 0;
