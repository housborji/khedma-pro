/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autorise l'accès depuis ton téléphone sur le réseau local en mode développement
  allowedDevOrigins: ['192.168.11.106'],
};

module.exports = nextConfig;