# Vercel Deployment Guide

## Voraussetzungen

1. ✅ Code wurde zu GitHub gepusht
2. ✅ Vercel CLI installiert (`npm install -g vercel` oder bereits installiert)
3. ✅ InstantDB App ID vorhanden

## Deployment über Vercel Dashboard (Empfohlen)

1. **Gehe zu [vercel.com](https://vercel.com)** und logge dich ein

2. **Importiere das Projekt:**
   - Klicke auf "Add New..." → "Project"
   - Wähle das GitHub Repository: `luca826/Strategy-Meme-Generator`
   - Klicke auf "Import"

3. **Konfiguriere das Projekt:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (sollte automatisch erkannt werden)
   - Output Directory: `dist` (sollte automatisch erkannt werden)
   - Install Command: `npm install`

4. **Setze Environment Variables:**
   Klicke auf "Environment Variables" und füge hinzu:
   
   ```
   VITE_INSTANTDB_APP_ID=93d96cc8-b601-49f2-88d2-d64745c7ba16
   ```
   
   Optional (für Cloudinary):
   ```
   VITE_CLOUDINARY_CLOUD_NAME=dein_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=dein_upload_preset
   ```
   
   **Wichtig:** Stelle sicher, dass diese Variablen für alle Environments gesetzt sind (Production, Preview, Development)

5. **Deploy:**
   - Klicke auf "Deploy"
   - Warte bis der Build fertig ist
   - Deine App ist jetzt live! 🎉

## Deployment über CLI

Alternativ kannst du auch über die CLI deployen:

```bash
# Login zu Vercel (falls noch nicht eingeloggt)
vercel login

# Deploy zum ersten Mal
vercel

# Für Production Deployment
vercel --prod
```

**Environment Variables über CLI setzen:**

```bash
vercel env add VITE_INSTANTDB_APP_ID
# Gib ein: 93d96cc8-b601-49f2-88d2-d64745c7ba16
# Wähle: Production, Preview, Development

# Optional: Cloudinary
vercel env add VITE_CLOUDINARY_CLOUD_NAME
vercel env add VITE_CLOUDINARY_UPLOAD_PRESET
```

## Nach dem Deployment

1. **Teste die App:**
   - Öffne die bereitgestellte URL
   - Teste die Registrierung mit einem Invite-Code
   - Teste die Meme-Erstellung

2. **Custom Domain (Optional):**
   - Gehe zu Project Settings → Domains
   - Füge deine Domain hinzu

## Troubleshooting

**Problem: "InstantDB App ID not configured"**
- Lösung: Prüfe ob `VITE_INSTANTDB_APP_ID` in Vercel Environment Variables gesetzt ist
- Stelle sicher, dass die Variable für alle Environments gesetzt ist

**Problem: Build fehlgeschlagen**
- Lösung: Prüfe die Build-Logs in Vercel
- Stelle sicher, dass alle Dependencies in `package.json` korrekt sind

**Problem: App lädt nicht**
- Lösung: Prüfe die Browser Console auf Fehler
- Stelle sicher, dass InstantDB Permissions korrekt gesetzt sind

## Wichtige Hinweise

- ⚠️ Die `.env` Datei wird **nicht** zu GitHub gepusht (ist in `.gitignore`)
- ✅ Environment Variables müssen in Vercel manuell gesetzt werden
- ✅ Nach Änderungen an Environment Variables muss ein neuer Build erstellt werden
- ✅ Die App verwendet InstantDB für Backend und Auth
