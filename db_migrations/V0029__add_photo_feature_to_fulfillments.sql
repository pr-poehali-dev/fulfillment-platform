-- Фотосъёмка товаров для новых СПб фулфилментов (партия V0028)
-- ТКМ, ПЭК, Е-логистик, BG Logistic, Полки, Операторофф, Тотал Терминал, FFService
UPDATE fulfillments
SET features = array_append(features, 'photo')
WHERE id IN (71, 72, 73, 74, 75, 76, 77, 78)
  AND NOT ('photo' = ANY(features));

-- Минисклад (id=85), Saint Pack (id=88), КоллПлекс (id=97)
UPDATE fulfillments
SET features = array_append(features, 'photo')
WHERE id IN (85, 88, 97)
  AND NOT ('photo' = ANY(features));
