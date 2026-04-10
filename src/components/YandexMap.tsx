import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  address: string;
  className?: string;
}

export default function YandexMap({ address, className = "w-full h-64 rounded-xl overflow-hidden" }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!address?.trim()) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon name="MapPin" size={24} className="text-gray-300" />
            <span className="text-xs font-ibm">Адрес не указан</span>
          </div>
        </div>
      </div>
    );
  }

  const encoded = encodeURIComponent(address);
  const src = `https://yandex.ru/map-widget/v1/?text=${encoded}&z=15&l=map`;

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon name="Loader2" size={24} className="animate-spin" />
            <span className="text-xs font-ibm">Загрузка карты...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 z-10">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon name="MapPin" size={24} className="text-gray-300" />
            <span className="text-xs font-ibm">Не удалось загрузить карту</span>
          </div>
        </div>
      )}

      <iframe
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        style={{ border: 0, display: "block" }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
