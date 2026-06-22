"use client";

import { useEffect, useRef } from "react";

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
    const scriptId = "cf-turnstile-script";

    // Ne charger le script qu'une seule fois
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      
      // Callback global pour render quand le script est prêt
      (window as any).onTurnstileLoad = () => {
        if (containerRef.current && window.turnstile) {
          window.turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          });
        }
      };

      document.head.appendChild(script);
    } else {
      // Le script est déjà chargé, on render directement
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
        });
      }
    }

    // Nettoyer si le composant est démonté
    return () => {
      if (containerRef.current && window.turnstile) {
        window.turnstile.remove(containerRef.current);
      }
    };
  }, []);

  return <div ref={containerRef} suppressHydrationWarning />;
}