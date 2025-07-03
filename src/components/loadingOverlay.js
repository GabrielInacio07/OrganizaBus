"use client";

import { useState, useEffect } from "react";

export default function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Pequeno delay para evitar flashes
      setTimeout(() => setIsLoading(false), 300);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <div
  className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
    isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  } bg-white dark:bg-gray-900`}
  style={{ transition: "opacity 0.5s ease",
    backgroundColor: '#ffffff',
    color: '#333',
    pointerEvents: isLoading ? 'auto' : 'none',
   }}
>
  <img
    src="/img/onibus_animado.gif"
    alt="Carregando..."
    className="w-36 h-36 object-contain "
  />
  <h1 className="text-black dark:text-black text-lg font-medium">Carregando...</h1>
</div>

  );
}
