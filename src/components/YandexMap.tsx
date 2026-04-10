import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const YANDEX_API_KEY = "8af3ef1e-35cc-45d8-9e11-1528e618e5f4";

let ymapsPromise: Promise<void> | null = null;

function loadYmaps(): Promise<void> {
  if (ymapsPromise) return ymapsPromise;

  ymapsPromise = new Promise((resolve, reject) => {
    if (typeof window.ymaps !== "undefined") {
      window.ymaps.ready(resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(resolve);
    };
    script.onerror = () => {
      ymapsPromise = null;
      reject(new Error("Не удалось загрузить Яндекс Карты"));
    };
    document.head.appendChild(script);
  });

  return ymapsPromise;
}

interface Props {
  address: string;
  className?: string;
}

export default function YandexMap({ address, className = "w-full h-64 rounded-xl overflow-hidden" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!address?.trim()) {
      setStatus("error");
      setErrorMsg("Адрес не указан");
      return;
    }

    let cancelled = false;

    const init = () => {
      setStatus("loading");
      loadYmaps()
        .then(() => {
          if (cancelled || !containerRef.current) return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ym = window.ymaps as any;

          ym.geocode(address).then((result: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (cancelled || !containerRef.current) return;

            const geoObjects = result.geoObjects;
            if (!geoObjects || geoObjects.getLength() === 0) {
              setStatus("error");
              setErrorMsg("Адрес не найден. Уточните адрес.");
              return;
            }

            const coords = geoObjects.get(0).geometry.getCoordinates();

            if (mapInstanceRef.current) {
              try { (mapInstanceRef.current as any).destroy(); } catch { /* */ } // eslint-disable-line @typescript-eslint/no-explicit-any
              mapInstanceRef.current = null;
            }

            const map = new ym.Map(containerRef.current, {
              center: coords,
              zoom: 15,
              controls: ["zoomControl"],
            });

            const placemark = new ym.Placemark(coords, {
              balloonContent: address,
            }, {
              preset: "islands#darkBlueDotIconWithCaption",
            });

            map.geoObjects.add(placemark);
            mapInstanceRef.current = map;
            setStatus("ok");
          }, (err: unknown) => {
            console.error("[YandexMap] geocode error:", err);
            if (!cancelled) {
              setStatus("error");
              setErrorMsg("Ошибка геокодирования. Проверьте API-ключ Яндекс Карт.");
            }
          });
        })
        .catch((err) => {
          console.error("[YandexMap] load error:", err);
          if (!cancelled) {
            setStatus("error");
            setErrorMsg("Не удалось загрузить Яндекс Карты");
          }
        });
    };

    init();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (mapInstanceRef.current as any).destroy();
        } catch { /* ignore */ }
        mapInstanceRef.current = null;
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