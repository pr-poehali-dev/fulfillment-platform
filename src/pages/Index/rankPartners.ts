import type { Partner } from "./data";

const PREMIUM_BADGE = "Premium Fulfilment";

/**
 * Приоритеты ранжирования:
 * 1 — бейдж "Premium Fulfilment"
 * 2 — есть фото или OG-изображение (photos.length > 0)
 * 3 — есть хотя бы 2 доп. услуги (features.length >= 2)
 * 4 — все остальные в случайном порядке (shuffle по сессии)
 */
function getPriority(p: Partner): number {
  if (p.badge === PREMIUM_BADGE) return 1;
  if (p.hasRealPhoto) return 2;
  if (p.features.length >= 2) return 3;
  return 4;
}

// Стабильный shuffle для одной сессии — один seed на загрузку страницы
const SESSION_SEED = Math.random();

function seededRandom(id: number): number {
  // Детерминированный хэш на основе id и seed сессии
  const x = Math.sin(id + SESSION_SEED * 9301) * 49297;
  return x - Math.floor(x);
}

export function rankPartners(partners: Partner[]): Partner[] {
  return [...partners].sort((a, b) => {
    const pa = getPriority(a);
    const pb = getPriority(b);
    if (pa !== pb) return pa - pb;
    // Внутри одного приоритета — случайный стабильный порядок
    return seededRandom(a.id) - seededRandom(b.id);
  });
}