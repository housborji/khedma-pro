"use client";

import { Phone, Globe } from "lucide-react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface Client {
  nom: string;
  metier: string;
  photo: string;
  telephone: string;
  email: string;
  site?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  bio?: string;
}

export default function CarteVisite({ client }: { client: Client }) {
  const tel = client.whatsapp || client.telephone;
  const whatsapp = tel.replace(/^0/, "212");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fond rouge avec photo carrée aux coins arrondis */}
      <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-red-500 to-red-700">
        <img
          src={client.photo}
          alt={client.nom}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-white absolute left-1/2 -translate-x-1/2 -bottom-12 sm:-bottom-16 shadow-lg"
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 flex flex-col items-center px-6 pt-20 sm:pt-24 pb-10">
        <div className="w-full max-w-md space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{client.nom}</h1>
            <p className="text-lg text-red-500 font-medium">{client.metier}</p>
          </div>

          {client.bio && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-400 uppercase mb-2">À propos</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{client.bio}</p>
            </div>
          )}

          <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-red-500" />
              <a href={`tel:${client.telephone}`} className="text-lg font-semibold tracking-wide hover:text-red-600 transition-colors">
                {client.telephone}
              </a>
            </div>
            {client.email && (
              <a href={`mailto:${client.email}`} className="block text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ✉️ {client.email}
              </a>
            )}
            {client.site && (
              <a href={client.site} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors">
                <Globe className="w-4 h-4" />
                {client.site}
              </a>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-2">
            {client.instagram && (
              <a href={`https://instagram.com/${client.instagram}`} target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                <InstagramIcon />
              </a>
            )}
            {client.facebook && (
              <a href={client.facebook} target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                <FacebookIcon />
              </a>
            )}
          </div>

          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white w-full py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition shadow-md mt-4">
            <Phone className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}