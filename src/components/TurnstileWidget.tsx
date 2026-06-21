"use client";

import { useEffect, useRef } from "react";

// Déclaration pour TypeScript
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string }) => void;
      remove: (element: HTMLElement) => void;
      ready: (callback: () => void) => void;
    };
  }
}

export default function TurnstileWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger dynamiquement le script Turnstile (une seule fois)
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Attendre que le script soit chargé puis rendre le widget
    const checkTurnstile = () => {
      if (window.turnstile) {
        if (containerRef.current) {
          window.turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          });
        }
      } else {
        setTimeout(checkTurnstile, 200);
      }
    };
    checkTurnstile();

    // Nettoyer le widget si le composant est démonté
    return () => {
      if (containerRef.current && window.turnstile) {
        window.turnstile.remove(containerRef.current);
      }
    };
  }, []);

  return <div ref={containerRef} suppressHydrationWarning />;
}