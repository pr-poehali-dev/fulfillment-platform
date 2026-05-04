import { useState } from "react";

const DEFAULT_CITY = "Москва";
const STORAGE_KEY = "fulfillhub_city";

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

export function useCity(_availableCities: string[]) {
  const [city, setCity] = useState<string>(getStoredCity);

  const changeCity = (c: string) => {
    setCity(c);
    saveCity(c);
  };

  return { city, changeCity, detecting: false };
}
