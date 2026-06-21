import Link from "next/link";

interface AdBannerProps {
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

export default function AdBanner({ imageUrl, linkUrl, altText }: AdBannerProps) {
  return (
    <div className="my-6">
      <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
        <div className="relative overflow-hidden rounded-lg border bg-gray-100 hover:shadow-md transition-shadow">
          {/* Remplacer par une vraie image plus tard */}
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-24 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-gray-600">
              Votre publicité ici
            </span>
          </div>
        </div>
      </Link>
      <p className="text-xs text-gray-400 mt-1 text-center">Annonce</p>
    </div>
  );
}