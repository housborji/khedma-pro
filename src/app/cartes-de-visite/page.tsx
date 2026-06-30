import { Button } from "@/components/ui/button";

export const metadata = {
  manifest: "/manifest.json",
  title: "Cartes de Visite Digitales avec QR Code - KhedmaPro",
  description:
    "Créez votre carte de visite digitale professionnelle avec QR code. Simple, rapide, et accessible partout. Idéal pour artisans et professionnels au Maroc.",
};

export default function CartesVisitePage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">📇 Cartes de Visite Digitales</h1>
        <p className="text-lg text-gray-600 mb-8">
          Ne perdez plus vos cartes papier. Créez votre carte de visite digitale professionnelle avec un QR code unique.
          Partagez-la en un clic, accessible partout, tout le temps.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">Toujours avec vous</h3>
            <p className="text-sm text-gray-600">
              Accessible sur tous les téléphones, sans application.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Lien privé</h3>
            <p className="text-sm text-gray-600">
              Chaque carte a un QR code unique et privé.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Mise à jour facile</h3>
            <p className="text-sm text-gray-600">
              Changez vos infos à tout moment, le QR code reste le même.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Ce que contient votre carte</h2>
        <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
          <li>✅ Photo de profil</li>
          <li>✅ Nom et métier</li>
          <li>✅ Numéro de téléphone</li>
          <li>✅ WhatsApp</li>
          <li>✅ Email</li>
          <li>✅ Instagram</li>
          <li>✅ LinkedIn</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Tarif</h2>
        <p className="text-3xl font-bold text-red-600 mb-8">150 MAD / an</p>

        <a
          href="https://wa.me/212658048369?text=Bonjour,%20je%20souhaite%20commander%20une%20carte%20de%20visite%20digitale."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6"
          >
            📲 Commander via WhatsApp
          </Button>
        </a>
      </div>
    </main>
  );
}