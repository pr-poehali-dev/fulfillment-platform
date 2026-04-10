UPDATE fulfillments
SET work_schemes = array_replace(work_schemes, 'Crossdocking', 'Кросс-докинг')
WHERE 'Crossdocking' = ANY(work_schemes);