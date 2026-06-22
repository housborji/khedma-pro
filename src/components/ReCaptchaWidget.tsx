"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (element: HTMLElement, options: { sitekey: string }) => void;
      reset: () => void;
      getResponse: () => string;
    };
  }
}

export default function ReCaptchaWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "recaptcha-script";
    
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (containerRef.current && window.grecaptcha) {
          window.grecaptcha.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          });
        }
      };
      document.head.appendChild(script);
    } else if (window.grecaptcha && containerRef.current) {
      window.grecaptcha.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
      });
    }
  }, []);

  return <div ref={containerRef} suppressHydrationWarning />;
}