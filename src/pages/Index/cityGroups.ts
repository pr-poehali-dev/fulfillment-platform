// Группировка городов: главный город → набор городов из базы, которые относятся к этому региону
export const CITY_GROUPS: Record<string, { label: string; matches: string[] }> = {
  "Москва": {
    label: "Москва и Московская область",
    matches: [
      "Москва",
      "Москва и Московская область",
      "Москва / Подольск",
      "Москва, Ховрино",
      "Москва, Чертаново Северное",
      "Подольск",
      "Люберцы",
      "Красногорск",
      "Быково",
      "Домодедово",
      "Реутов",
      "Дмитровский",
      "Видное",
      "Дзержинский",
      "Горки Ленинские",
      "Растуново",
      "Новосёлки",
      "Богородский",
    ],
  },
  "Санкт-Петербург": {
    label: "Санкт-Петербург и Ленинградская область",
    matches: [
      "Санкт-Петербург",
      "СПб",
      "Ленинградская область",
      "Ленобласть",
    ],
  },
};

export function getCityGroup(selectedCity: string): { label: string; matches: string[] } {
  return CITY_GROUPS[selectedCity] ?? { label: selectedCity, matches: [selectedCity] };
}

export function partnerMatchesCity(partnerCity: string, selectedCity: string): boolean {
  const group = getCityGroup(selectedCity);
  const lower = partnerCity.toLowerCase();
  return group.matches.some((m) => lower.includes(m.toLowerCase()));
}

// Главные города для выбора в выпадающем меню (фиксированный список)
export const PRIMARY_CITIES = ["Москва", "Санкт-Петербург"];
