"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdBanner() {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("ads")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setAd(data);
      });
  }, []);

  // Si une pub active existe, on l'affiche avec un alt optimisé
  if (ad) {
    return (
      <div className="my-6">
        <Link href={ad.link_url} target="_blank" rel="noopener noreferrer">
          <img
            src={ad.image_url}
            alt={ad.alt_text || "Publicité - snay3i, m3alem, artisan, services au Maroc"}
            className="w-full h-24 object-cover rounded-lg shadow hover:shadow-md transition-shadow"
          />
        </Link>
        <p className="text-xs text-gray-400 mt-1 text-center">Annonce</p>
      </div>
    );
  }

  // Sinon, le placeholder professionnel
  return (
    <div className="my-6">
      <Link href="/contact">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 gap-4">
            <div className="text-white">
              <p className="text-lg font-bold">📢 Votre espace publicitaire ici</p>
              <p className="text-sm text-red-100 mt-1">
                Touchez des centaines d&apos;artisans et de clients chaque jour
              </p>
            </div>
            <div className="bg-white text-red-600 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition whitespace-nowrap">
              Contactez-nous
            </div>
          </div>
        </div>
      </Link>
      <p className="text-xs text-gray-400 mt-1 text-center">Annonce</p>
    </div>
  );
}