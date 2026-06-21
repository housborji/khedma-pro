// scripts/hash-password-sha256.js
const crypto = require("crypto");

// Prend le mot de passe en argument, ou utilise une valeur par défaut
const plainPassword = process.argv[2] || "monSuperMotDePasse123";
const hash = crypto.createHash("sha256").update(plainPassword).digest("hex");
console.log("Hash SHA-256 :", hash);