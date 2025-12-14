# Schnellstart-Anleitung

## Sofort loslegen (ohne Firebase)

Du kannst die App sofort ohne Firebase-Konfiguration nutzen!

### 1. Installation

```bash
npm install
```

### 2. Starten

```bash
npm run dev
```

Die App läuft dann auf `http://localhost:5173`

### 3. Features nutzen

Ohne Firebase stehen dir zur Verfügung:

✅ **Vorlagen laden** - Wähle aus 8 vorinstallierten Meme-Templates
✅ **Eigene Bilder hochladen** - PNG, JPG, GIF
✅ **Text hinzufügen** - Mit 10 Schriftarten, Farben, Größen
✅ **Icons platzieren** - 50+ Icons in verschiedenen Farben
✅ **Download** - Als PNG oder JPG herunterladen

### 4. (Optional) Firebase für Cloud-Features

Wenn du Memes in der Cloud speichern möchtest:

1. Erstelle ein Firebase-Projekt: [console.firebase.google.com](https://console.firebase.google.com)

2. Aktiviere:
   - Authentication → Anonymous
   - Firestore Database
   - Storage

3. Öffne `src/services/firebase.ts` und ersetze:

```typescript
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",           // ← Hier eintragen
  authDomain: "DEIN_PROJECT.firebaseapp.com",
  projectId: "DEIN_PROJECT",
  storageBucket: "DEIN_PROJECT.appspot.com",
  messagingSenderId: "DEINE_ID",
  appId: "DEINE_APP_ID"
};
```

4. Firestore-Regeln (in Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /memes/{memeId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Storage-Regeln:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Bedienung

### Meme erstellen

1. **Bild auswählen**
   - Klicke auf "Vorlagen" für Templates
   - Oder "Upload" für eigene Bilder

2. **Text hinzufügen**
   - Tab "Text" → "Text hinzufügen"
   - Text direkt bearbeiten oder in Controls
   - Schriftart, Größe, Farbe anpassen

3. **Icons hinzufügen**
   - Tab "Icons" → Icon auswählen
   - Farbe und Größe anpassen
   - Auf Canvas platzieren

4. **Speichern**
   - "Download" für lokales Speichern
   - "Speichern" für Cloud (benötigt Firebase)

### Shortcuts

- `Delete` / `Backspace` - Löschen
- `Ctrl/Cmd + C` - Kopieren
- `Ctrl/Cmd + V` - Einfügen
- Drag & Drop - Verschieben

## Nächste Schritte

- Passe Farben in `src/constants/branding.ts` an
- Füge eigene Templates in `src/constants/templates.ts` hinzu
- Deploy auf Vercel, Netlify oder Firebase Hosting

## Hilfe benötigt?

Siehe [INSTALLATION.md](INSTALLATION.md) oder [README.md](README.md)

