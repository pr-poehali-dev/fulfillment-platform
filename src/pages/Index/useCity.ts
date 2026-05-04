import { useState, useEffect } from "react";

const DEFAULT_CITY = "Москва";
const STORAGE_KEY = "fulfillhub_city";

const IP_CITY_MAP: Record<string, string> = {
  "москв": "Москва",
  "moscow": "Москва",
  "санкт-петербург": "Санкт-Петербург",
  "saint-petersburg": "Санкт-Петербург",
  "st. petersburg": "Санкт-Петербург",
  "spb": "Санкт-Петербург",
  "екатеринбург": "Екатеринбург",
  "yekaterinburg": "Екатеринбург",
  "новосибирск": "Новосибирск",
  "novosibirsk": "Новосибирск",
  "казань": "Казань",
  "kazan": "Казань",
  "нижний новгород": "Нижний Новгород",
  "nizhny novgorod": "Нижний Новгород",
  "ростов": "Ростов-на-Дону",
  "rostov": "Ростов-на-Дону",
  "самара": "Самара",
  "samara": "Самара",
  "краснодар": "Краснодар",
  "krasnodar": "Краснодар",
  "воронеж": "Воронеж",
  "voronezh": "Воронеж",
  "уфа": "Уфа",
  "ufa": "Уфа",
  "пермь": "Пермь",
  "perm": "Пермь",
  "волгоград": "Волгоград",
  "volgograd": "Волгоград",
};

function normalizeCity(raw: string): string | null {
  const lower = raw.toLowerCase().trim();
  for (const [key, val] of Object.entries(IP_CITY_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

async function detectCityByIp(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const cityRaw: string = data.city || data.region || "";
    return normalizeCity(cityRaw) ?? cityRaw || null;
  } catch {
    return null;
  }
}

function getStoredCity(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function saveCity(city: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, city);
  } catch {
    // ignore
  }
}

export function useCity(availableCities: string[]) {
  const [city, setCity] = useState<string>(getStoredCity);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (getStoredCity()) return;
    let cancelled = false;
    setDetecting(true);
    detectCityByIp()
      .then((detected) => {
        if (cancelled) return;
        const found = detected
          ? availableCities.find(
              (c) =>
                c.toLowerCase().includes(detected.toLowerCase()) ||
                detected.toLowerCase().includes(c.toLowerCase())
            )
          : undefined;
        const resolved = found || DEFAULT_CITY;
        setCity(resolved);
        saveCity(resolved);
      })
      .finally(() => {
        if (!cancelled) setDetecting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [availableCities.length]);

  const changeCity = (c: string) => {
    setCity(c);
    saveCity(c);
  };

  return { city, changeCity, detecting };
}