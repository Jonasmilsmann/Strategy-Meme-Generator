# Strategy Meme Generator - Full Stack Setup

## Overview

Die App wurde zu einer Full-Stack-Anwendung mit InstantDB erweitert. Features:
- ✅ Email/Passwort-Authentifizierung
- ✅ Invite-Code System (nur zugelassene Nutzer)
- ✅ Öffentlicher Meme-Feed
- ✅ Up/Down-Voting mit Score-Anzeige
- ✅ Real-time Updates
- ✅ Cloudinary Image-Hosting (optional)

## Setup Instructions

### 1. InstantDB Account erstellen

1. Gehe zu [https://instantdb.com](https://instantdb.com)
2. Erstelle einen Account
3. Erstelle eine neue App in der InstantDB Console
4. Kopiere deine App ID

### 2. Umgebungsvariablen konfigurieren

Erstelle/aktualisiere die `.env` Datei im Root-Verzeichnis:

```bash
# InstantDB Configuration
VITE_INSTANTDB_APP_ID=your_instantdb_app_id_here

# Cloudinary Configuration (optional, aber empfohlen)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 3. Cloudinary Setup (Optional, aber empfohlen)

Ohne Cloudinary werden Bilder als Base64 in InstantDB gespeichert (nicht empfohlen für Produktion).

1. Gehe zu [https://cloudinary.com](https://cloudinary.com)
2. Erstelle einen kostenlosen Account (25 GB Speicher)
3. Gehe zu Settings → Upload
4. Erstelle einen Upload Preset:
   - Name: z.B. "meme-generator"
   - Signing Mode: "Unsigned"
   - Folder: "strategy-memes" (optional)
5. Kopiere Cloud Name und Upload Preset Name in die `.env`

### 4. InstantDB Schema definieren

In der InstantDB Console, definiere folgendes Schema:

```javascript
{
  "entities": {
    "users": {
      "email": "string",
      "approved": "boolean",
      "inviteCode": "string",
      "createdAt": "number"
    },
    "inviteCodes": {
      "code": "string",
      "used": "boolean",
      "usedBy": "string?",
      "createdBy": "string",
      "createdAt": "number"
    },
    "memes": {
      "title": "string",
      "imageUrl": "string",
      "thumbnailUrl": "string",
      "userId": "string",
      "userEmail": "string",
      "createdAt": "number"
    },
    "votes": {
      "memeId": "string",
      "userId": "string",
      "value": "number"
    }
  }
}
```

### 5. Permissions konfigurieren (wichtig!)

In der InstantDB Console, setze folgende Permissions:

```javascript
{
  "memes": {
    "allow": {
      "create": "auth != null",
      "view": "auth != null",
      "delete": "data.userId == auth.id"
    }
  },
  "votes": {
    "allow": {
      "create": "auth != null",
      "update": "data.userId == auth.id",
      "delete": "data.userId == auth.id",
      "view": "auth != null"
    }
  },
  "inviteCodes": {
    "allow": {
      "read": "auth != null",
      "create": "auth != null"
    }
  },
  "users": {
    "allow": {
      "create": "auth != null",
      "view": "auth != null"
    }
  }
}
```

### 6. Installation und Start

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

## Erste Schritte

### Ersten Invite-Code erstellen

Da die App ein Invite-System hat, musst du zuerst einen Invite-Code manuell in InstantDB erstellen:

1. Gehe zur InstantDB Console
2. Öffne die "Data" Sektion
3. Erstelle einen neuen Eintrag in `inviteCodes`:
   ```json
   {
     "code": "WELCOME1",
     "used": false,
     "usedBy": null,
     "createdBy": "admin",
     "createdAt": 1702893600000
   }
   ```
4. Nutze diesen Code für die erste Registrierung

### App nutzen

1. **Registrierung**: Nutze den Invite-Code um einen Account zu erstellen
2. **Login**: Melde dich mit deiner Email an
3. **Meme erstellen**: 
   - Wähle ein Template oder lade ein eigenes Bild hoch
   - Füge Text hinzu
   - Klicke auf "Speichern" um das Meme zu veröffentlichen
4. **Feed**: Sieh alle Memes und vote mit Up/Down
5. **Invite-Codes**: Erstelle neue Codes für weitere Nutzer

## Features im Detail

### Authentifizierung
- InstantDB Magic Code Auth (Email-basiert)
- Nur zugelassene Nutzer mit gültigem Invite-Code
- Protected Routes - kein Zugriff ohne Login

### Meme Generator
- Canvas-basierter Editor mit Fabric.js
- Template-Bibliothek
- Bild-Upload
- Text mit verschiedenen Stilen
- Download als PNG

### Öffentlicher Feed
- Alle Memes von allen Nutzern
- Sortierung: Top, Neu, Trending
- Real-time Updates bei neuen Memes/Votes

### Voting System
- Upvote/Downvote wie Reddit
- Score-Anzeige (Upvotes - Downvotes)
- Separate Anzeige von Upvote- und Downvote-Zahlen
- User kann Vote ändern oder entfernen

### Invite-Code Management
- Codes generieren (8-stellig alphanumerisch)
- Status-Übersicht (verfügbar/verwendet)
- Copy-to-Clipboard Funktion

## Troubleshooting

### "InstantDB nicht konfiguriert"
- Prüfe ob `VITE_INSTANTDB_APP_ID` in `.env` gesetzt ist
- Stelle sicher dass die `.env` Datei im Root-Verzeichnis ist
- Restart den Dev-Server nach `.env` Änderungen

### "Cloudinary nicht konfiguriert"
- Optional: Füge Cloudinary Credentials hinzu
- Ohne Cloudinary: Bilder werden als Base64 gespeichert (größere DB)

### "Auth error"
- Prüfe InstantDB Permissions
- Stelle sicher dass User eingeloggt ist
- Check Browser Console für Details

### Bilder laden nicht
- Prüfe Cloudinary URL in der Console
- Bei Base64: Prüfe ob Bilder zu groß sind (max ~1MB empfohlen)
- CORS-Probleme: Cloudinary konfigurieren

## Produktion

Für Production Deployment:

1. ✅ Cloudinary aktivieren (Base64 nicht für Produktion)
2. ✅ InstantDB Permissions richtig konfigurieren
3. ✅ Environment Variables in Hosting-Platform setzen
4. ✅ Build erstellen: `npm run build`
5. ✅ `dist/` Ordner deployen

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS
- **Canvas**: Fabric.js
- **Database**: InstantDB (real-time)
- **Image Storage**: Cloudinary (optional)
- **Auth**: InstantDB Auth

## Support

Bei Fragen oder Problemen:
- InstantDB Docs: https://instantdb.com/docs
- Cloudinary Docs: https://cloudinary.com/documentation

