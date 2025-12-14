# Installation und Setup

## Voraussetzungen

- Node.js (Version 16 oder höher)
- npm oder yarn
- Ein Firebase-Projekt (optional, für Cloud-Features)

## Installation

1. **Dependencies installieren**

```bash
npm install
```

2. **Firebase konfigurieren (optional)**

Wenn du Cloud-Speicherung nutzen möchtest:

a) Erstelle ein Firebase-Projekt auf [https://console.firebase.google.com](https://console.firebase.google.com)

b) Aktiviere folgende Services:
   - Authentication (Anonymous Auth)
   - Firestore Database
   - Storage

c) Kopiere deine Firebase-Konfiguration

d) Öffne `src/services/firebase.ts` und ersetze die Platzhalter-Werte mit deinen Firebase-Credentials:

```typescript
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJECT_ID.firebaseapp.com",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_PROJECT_ID.appspot.com",
  messagingSenderId: "DEINE_MESSAGING_SENDER_ID",
  appId: "DEINE_APP_ID"
};
```

Alternativ kannst du die `.env.example` Datei zu `.env` kopieren und dort deine Credentials eintragen.

## Entwicklung starten

```bash
npm run dev
```

Die App ist dann verfügbar unter `http://localhost:5173`

## Build für Produktion

```bash
npm run build
```

Die fertigen Dateien befinden sich im `dist/` Ordner.

## Deployment

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Verbinde dein Git-Repository mit Netlify und es wird automatisch deployed.

## Features ohne Firebase

Auch ohne Firebase-Konfiguration kannst du folgende Features nutzen:

- ✅ Meme-Vorlagen laden
- ✅ Eigene Bilder hochladen (lokal)
- ✅ Text hinzufügen und stylen
- ✅ Icons hinzufügen
- ✅ Memes als PNG/JPG herunterladen

Mit Firebase zusätzlich:

- ✅ Memes in der Cloud speichern
- ✅ Gespeicherte Memes ansehen und laden
- ✅ Memes mit anderen teilen

## Troubleshooting

### Port bereits belegt

Wenn Port 5173 bereits belegt ist:

```bash
npm run dev -- --port 3000
```

### Module nicht gefunden

```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase Fehler

Stelle sicher, dass:
- Alle Firebase-Services aktiviert sind
- Die Firestore-Regeln den anonymen Zugriff erlauben
- Storage-Regeln korrekt konfiguriert sind

## Support

Bei Fragen oder Problemen erstelle ein Issue im Repository oder kontaktiere das Entwicklerteam.

