import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const YANDEX_API_KEY = "8af3ef1e-35cc-45d8-9e11-1528e618e5f4";

declare global {
  interface Window {
    ymaps: YMaps;
    ymapsReady?: boolean;
    ymapsCallbacks?: Array<() => void>;
  }
}

interface YGeoObjects {
  getLength: () => number;
  get: (i: number) => { geometry: { getCoordinates: () => [number, number] } };
}

interface YMaps {
  ready: (cb: () => void) => void;
  geocode: (address: string) => Promise<{ geoObjects: YGeoObjects }>;
  Map: new (el: HTMLElement, opts: object) => YMap;
  Placemark: new (coords: [number, number], props: object, opts: object) => YPlacemark;
}

interface YMap {
  geoObjects: { add: (o: YPlacemark) => void };
  destroy: () => void;
}

type YPlacemark = object;

interface Props {
  address: string;
  className?: string;
}

function loadYmaps(): Promise<void> {
  if (window.ymapsReady) return Promise.resolve();

  if (!window.ymapsCallbacks) window.ymapsCallbacks = [];

  return new Promise((resolve) => {
    window.ymapsCallbacks!.push(resolve);

    // Скрипт уже добавлен — просто ждём колбэк, не добавляем второй тег
    if (document.getElementById("ymaps-script")) return;

    const script = document.createElement("script");
    script.id = "ymaps-script";
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      // ymaps.ready гарантирует, что все модули готовы
      window.ymaps.ready(() => {
        window.ymapsReady = true;
        const cbs = window.ymapsCallbacks ?? [];
        window.ymapsCallbacks = [];
        cbs.forEach((cb) => cb());
      });
    };
    script.onerror = () => {
      // При ошибке загрузки сбрасываем очередь
      window.ymapsCallbacks?.forEach((cb) => cb());
      window.ymapsCallbacks = [];
    };
    document.head.appendChild(script);
  });
}

export default function YandexMap({ address, className = "w-full h-64 rounded-xl overflow-hidden" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<YMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!address?.trim()) {
      setStatus("error");
      setErrorMsg("Адрес не указан");
      return;
    }

    let cancelled = false;

    const init = async () => {
      setStatus("loading");
      try {
        await loadYmaps();
        if (cancelled || !containerRef.current) return;

        // Геокодируем внутри ymaps.ready чтобы все модули точно были готовы
        const res = await new Promise<{ geoObjects: YGeoObjects }>((resolve, reject) => {
          window.ymaps.ready(() => {
            window.ymaps.geocode(address).then(resolve).catch(reject);
          });
        });

        if (cancelled) return;

        if (!res.geoObjects || res.geoObjects.getLength() === 0) {
          setStatus("error");
          setErrorMsg("Адрес не найден на карте. Уточните адрес.");
          return;
        }

        const coords = res.geoObjects.get(0).geometry.getCoordinates();

        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
        }

        const map = new window.ymaps.Map(containerRef.current, {
          center: coords,
          zoom: 15,
          controls: ["zoomControl"],
        });

        const mark = new window.ymaps.Placemark(coords, {
          balloonContent: address,
        }, {
          preset: "islands#darkBlueDotIconWithCaption",
        });

        map.geoObjects.add(mark);
        mapRef.current = map;
        setStatus("ok");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Не удалось загрузить карту");
        }
      }
    };

    init();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [address]);

  return (
    <div className={`relative ${className}`}>
      {/* Map container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon name="Loader2" size={24} className="animate-spin" />
            <span className="text-xs font-ibm">Загрузка карты...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon name="MapPin" size={24} className="text-gray-300" />
            <span className="text-xs font-ibm text-center px-4">{errorMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}