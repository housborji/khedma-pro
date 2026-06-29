// generate-qr.js
const QRCode = require("qrcode");
const fs = require("fs");

const clients = [
  { id: "x7G9kL2m", nom: "Ahmed" },
  { id: "K8mR3vLp", nom: "Fatima" },
  // ajoute d'autres clients ici
];

const baseUrl = "https://www.khedmapro.com/c/"; // ou http://localhost:3000/c/ pour les tests

clients.forEach((client) => {
  const url = baseUrl + client.id;
  const filePath = `qr-${client.nom.toLowerCase()}.png`;

  QRCode.toFile(filePath, url, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  })
    .then(() => console.log(`✅ QR code pour ${client.nom} créé : ${filePath}`))
    .catch((err) => console.error(`❌ Erreur ${client.nom} :`, err));
});