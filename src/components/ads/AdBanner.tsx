import Link from "next/link";

interface AdBannerProps {
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  placeholder?: boolean; // mode "espace disponible"
}

export default function AdBanner({ imageUrl, linkUrl, altText = "Publicité", placeholder = false }: AdBannerProps) {
  // Mode placeholder pro
  if (placeholder) {
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

  // Mode image existante
  return (
    <div className="my-6">
      <Link href={linkUrl || "#"} target="_blank" rel="noopener noreferrer">
        <div className="relative overflow-hidden rounded-lg border bg-gray-100 hover:shadow-md transition-shadow">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-24 object-cover"
          />
        </div>
      </Link>
      <p className="text-xs text-gray-400 mt-1 text-center">Annonce</p>
    </div>
  );
}