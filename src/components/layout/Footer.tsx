import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">KhedmaPro</h3>
          <p className="text-sm leading-relaxed">
            La marketplace qui connecte directement les particuliers et les artisans qualifiés au Maroc. Sans inscription, en toute simplicité.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-red-400 transition">Accueil</Link></li>
            <li><Link href="/demander" className="hover:text-red-400 transition">Publier une demande</Link></li>
            <li><Link href="/demandes" className="hover:text-red-400 transition">Voir les demandes</Link></li>
            <li><Link href="/contact" className="hover:text-red-400 transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-400" /> Rabat, Maroc</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-400" /> <a href="tel:+212658048369" className="hover:text-red-400">+212 658 04 83 69</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-400" /> <a href="mailto:houssem241@outlook.fr" className="hover:text-red-400">houssem241@outlook.fr</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
        © 2026 KhedmaPro. Tous droits réservés.
      </div>
      {/* Ligne SEO locale discrète */}
      <p className="text-center text-[10px] text-gray-600/50 mt-1">
        Khedmapro : La plateforme pour trouver un snay3i, m3alem aw khaddam fi l'Maroc (معلم، صنايعي، خدمة).
      </p>
    </footer>
  );
}