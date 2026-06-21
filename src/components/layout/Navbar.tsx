"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/demandes", label: "Voir les demandes" },
  { href: "/comment-ca-marche", label: "Comment ça marche ?" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-2xl font-extrabold text-red-600">
          KhedmaPro
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/demander">
            <Button className="bg-red-600 hover:bg-red-700 text-sm">
              Publier une demande
            </Button>
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-700 relative z-[60] pointer-events-auto"
          aria-label="Menu principal"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pb-4 relative z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-gray-700 hover:text-red-600 border-b border-gray-100 last:border-none"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/demander" onClick={() => setOpen(false)}>
            <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-sm">
              Publier une demande
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}