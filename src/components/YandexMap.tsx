import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const API_KEY = "8af3ef1e-35cc-45d8-9e11-1528e618e5f4";
const SCRIPT_URL = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;

function ensureYmaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).ymaps !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ymaps.ready(() => resolve());
      return;
    }

    const existing = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existing) {
      const wait = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (window as any).ymaps !== "undefined") {
          clearInterval(wait);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).ymaps.ready(() => resolve());
        }
      }, 100);
      setTimeout(() => { clearInterval(wait); reject(new Error("ymaps timeout")); }, 15000);
      return;
    }

    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any).ymaps === "undefined") {
        reject(new Error("script loaded but ymaps undefined"));
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ymaps.ready(() => resolve());
    };
    s.onerror = (e) => reject(new Error("script onerror: " + String(e)));
    document.head.appendChild(s);
  });
}

interface Props {
  address: string;
  className?: string;
}

export default function YandexMap({ address, className = "w-full h-64 rounded-xl overflow-hidden" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!address?.trim()) {
      setStatus("error");
      setErrorMsg("Адрес не указан");
      return;
    }

    let cancelled = false;

    ensureYmaps()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ym = (window as any).ymaps;

        ym.geocode(address).then(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res: any) => {
            if (cancelled || !containerRef.current) return;

            if (!res.geoObjects || res.geoObjects.getLength() === 0) {
              setStatus("error");
              setErrorMsg("Адрес не найден на карте");
              return;
            }

            const coords = res.geoObjects.get(0).geometry.getCoordinates();

            if (mapRef.current) {
              try { mapRef.current.destroy(); } catch { /* ok */ }
              mapRef.current = null;
            }

            const map = new ym.Map(containerRef.current, {
              center: coords,
              zoom: 15,
              controls: ["zoomControl"],
            });

            map.geoObjects.add(
              new ym.Placemark(coords, { balloonContent: address }, {
                preset: "islands#darkBlueDotIconWithCaption",
              })
            );

            mapRef.current = map;
            setStatus("ok");
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err: any) => {
            if (!cancelled) {
              setStatus("error");
              setErrorMsg("Геокодер: " + (err?.message || String(err)));
            }
          }
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("SDK: " + (err?.message || String(err)));
        }
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try { mapRef.current.destroy(); } catch { /* ok */ }
        mapRef.current = null;
      }
    };
  }, [address]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon name="Loader2" size={24} className="animate-spin" />
            <span className="text-xs font-ibm">Загрузка карты...</span>
          </div>
        </div>
      )}

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
