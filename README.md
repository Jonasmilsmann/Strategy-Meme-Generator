# Strategy& Meme Generator

Eine moderne, professionelle Web-Anwendung zum Erstellen von Memes mit Strategy& Branding für dein Team.

![Strategy& Meme Generator](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Intuitive Benutzeroberfläche
- **Drag & Drop Interface** - Verschiebe Text und Icons frei auf dem Canvas
- **Strategy& Branding** - Professionelles Design in Strategy& Farben (Orange #FF6600)
- **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobile

### 📝 Text-Bearbeitung
- **10 Schriftarten** - Von klassisch bis modern
- **Flexible Größen** - 12px bis 120px
- **Farbauswahl** - Farbwähler mit Vorlagen-Farben
- **Text-Effekte** - Umrandung (Stroke), Schatten, Ausrichtung
- **Styling** - Fett, Kursiv, Links/Mitte/Rechts

### 🖼️ Bild-Verwaltung
- **Vorlagen-Bibliothek** - Beliebte Meme-Templates vorinstalliert
- **Eigene Uploads** - PNG, JPG, GIF unterstützt
- **Automatische Skalierung** - Bilder werden optimal angepasst
- **Kategorie-Filter** - Classic, Modern, Business

### 💾 Export & Speicherung
- **Lokaler Download** - Als PNG (hohe Qualität) oder JPG (komprimiert)
- **Cloud-Speicherung** - Memes in Firebase speichern (optional)
- **Galerie** - Gespeicherte Memes ansehen und laden
- **Teilen** - Share-Links für Team-Mitglieder

### ⌨️ Keyboard-Shortcuts
- `Delete` / `Backspace` - Ausgewähltes Objekt löschen
- `Ctrl/Cmd + C` - Kopieren
- `Ctrl/Cmd + V` - Einfügen

## 🚀 Schnellstart

### Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann verfügbar unter `http://localhost:5173`

### Optional: Firebase einrichten

Für Cloud-Features (Speichern & Teilen):

1. Erstelle ein Firebase-Projekt auf [console.firebase.google.com](https://console.firebase.google.com)
2. Aktiviere Authentication, Firestore und Storage
3. Füge deine Credentials in `src/services/firebase.ts` ein

Siehe [INSTALLATION.md](INSTALLATION.md) für Details.

## 📦 Build für Produktion

```bash
npm run build
```

Die fertigen Dateien befinden sich im `dist/` Ordner.

## 🛠️ Technologie-Stack

| Technologie | Verwendung |
|------------|-----------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **Fabric.js** | Canvas-Manipulation |
| **Firebase** | Backend (Auth, Firestore, Storage) |
| **React Icons** | Icon-Bibliothek |

## 📂 Projekt-Struktur

```
meme-generator/
├── src/
│   ├── components/
│   │   ├── Canvas/          # Canvas & Toolbar
│   │   ├── Header/          # App-Header
│   │   ├── Sidebar/         # Sidebar-Tabs
│   │   ├── Modals/          # Save & Download Modals
│   │   └── Common/          # Gemeinsame Komponenten
│   ├── contexts/            # React Context (Auth, Meme)
│   ├── services/            # Firebase & Storage
│   ├── constants/           # Branding & Templates
│   ├── hooks/               # Custom Hooks
│   └── App.tsx
├── public/
├── index.html
└── package.json
```

## 🎨 Strategy& Branding

Die App verwendet das offizielle Strategy& Branding von [strategyand.pwc.com](https://www.strategyand.pwc.com):

- **Primärfarbe:** PwC Orange `#D04A02`
- **Sekundärfarbe:** Schwarz `#000000`
- **Akzentfarbe:** Hellgrau `#F6F6F6`
- **Schriftart:** Inter (leicht) / Helvetica
- **Design:** Minimalistisch, professionell, clean

## 🤝 Contributing

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## 📝 License

MIT License - siehe [LICENSE](LICENSE) für Details.

## 👥 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue
- Kontaktiere das Entwicklerteam
- Siehe [INSTALLATION.md](INSTALLATION.md) für häufige Probleme

---

Entwickelt mit ❤️ für Strategy& Teams

