import { useState, useEffect } from "react";

const DEFAULT_CITY = "Москва";
const STORAGE_KEY = "fulfillhub_city";
const DETECT_CITY_URL = "https://functions.poehali.dev/d3a3ee7d-18ba-4e21-8c6f-a13d8a60051c";

function getStoredCity(): string {
  if (typeof window === "undefined") return DEFAULT_CITY;
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_CITY;
  } catch {
    return DEFAULT_CITY;
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

async function detectCityFromBackend(): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(DETECT_CITY_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return DEFAULT_CITY;
    const data = await res.json();
    return (data.city as string) || DEFAULT_CITY;
  } catch {
    return DEFAULT_CITY;
  }
}

export function useCity(_availableCities: string[]) {
  const [city, setCity] = useState<string>(getStoredCity);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (getStoredCity()) return;
    let cancelled = false;
    setDetecting(true);
    detectCityFromBackend()
      .then((detected) => {
        if (cancelled) return;
        setCity(detected);
        saveCity(detected);
      })
      .finally(() => {
        if (!cancelled) setDetecting(false);
      });
    return () => { cancelled = true; };
  }, []);

  const changeCity = (c: string) => {
    setCity(c);
    saveCity(c);
  };

  return { city, changeCity, detecting };
}