# InstantDB Setup - Schritt für Schritt

## Schema einrichten (3 Minuten)

### Option 1: Über InstantDB Dashboard (Empfohlen)

1. **Öffne die InstantDB Console:**
   - Gehe zu: https://instantdb.com/dash
   - Wähle deine App: `93d96cc8-b601-49f2-88d2-d64745c7ba16`

2. **Schema definieren:**
   - Klicke auf den Tab **"Schema"** in der linken Seitenleiste
   - Kopiere den Inhalt aus der Datei: `instantdb-schema.json`
   - Füge ihn in das Schema-Feld ein
   - Klicke auf **"Save Schema"** oder **"Update Schema"**

### Option 2: Über CLI (für Entwickler)

Wenn du die InstantDB CLI installiert hast:

```bash
# CLI installieren
npm install -g instant-cli

# Login
instant login

# Schema hochladen
instant push-schema instantdb-schema.json
```

## Ersten Invite-Code erstellen

### Über InstantDB Explorer:

1. **Öffne den Explorer:**
   - In der InstantDB Console
   - Klicke auf **"Explorer"** Tab

2. **Neuen Eintrag erstellen:**
   - Wähle die Collection: **`inviteCodes`**
   - Klicke auf **"Add Row"** oder **"+"**
   - Kopiere den Inhalt aus: `first-invite-code.json`
   - Füge die Werte ein:
     ```
     code: WELCOME1
     used: false
     usedBy: (leer lassen / null)
     createdBy: admin
     createdAt: 1734192000000
     ```
   - Klicke auf **"Save"**

### Alternative: Mehrere Codes auf einmal erstellen

Wenn du direkt mehrere Codes brauchst, kannst du in der Console mehrere Rows hinzufügen:

```json
// Code 1
{"code": "WELCOME1", "used": false, "usedBy": null, "createdBy": "admin", "createdAt": 1734192000000}

// Code 2
{"code": "STRATEGY1", "used": false, "usedBy": null, "createdBy": "admin", "createdAt": 1734192000000}

// Code 3
{"code": "MEME2024", "used": false, "usedBy": null, "createdBy": "admin", "createdAt": 1734192000000}
```

## Permissions setzen (wichtig!)

1. **Gehe zum "Permissions" Tab** in der InstantDB Console

2. **Füge folgende Rules ein:**

   **WICHTIG:** Kopiere den Inhalt aus der Datei `instantdb-permissions.json` (im Root-Verzeichnis) und füge ihn **genau so** in das Permissions-Feld ein. Stelle sicher, dass es valides JSON ist (keine Kommentare, korrekte Anführungszeichen).

   Oder kopiere diesen JSON-Code:

```json
{
  "memes": {
    "allow": {
      "create": "auth.id != null",
      "view": "auth.id != null",
      "delete": "data.userId == auth.id"
    }
  },
  "votes": {
    "allow": {
      "create": "auth.id != null",
      "update": "data.userId == auth.id",
      "delete": "data.userId == auth.id",
      "view": "auth.id != null"
    }
  },
  "inviteCodes": {
    "allow": {
      "view": "auth.id != null",
      "create": "auth.id != null"
    }
  },
  "users": {
    "allow": {
      "create": "auth.id != null",
      "view": "auth.id != null"
    }
  }
}
```

   **Tipp:** Falls du einen "invalid JSON" Fehler bekommst:
   - Stelle sicher, dass du den Codeblock komplett kopierst (von `{` bis `}`)
   - Entferne alle Kommentare (z.B. `// Code 1`)
   - Verwende die Datei `instantdb-permissions.json` direkt

3. **Klicke auf "Save Permissions"**

## Fertig! 🎉

Jetzt kannst du die App nutzen:

1. Öffne: http://localhost:5174/
2. Klicke auf **"Noch kein Account? Jetzt registrieren"**
3. Gib eine Email ein (kann Test-Email sein)
4. Gib ein Passwort ein (mind. 6 Zeichen)
5. Gib den Invite-Code ein: **WELCOME1**
6. Klicke auf **"Registrieren"**

## Troubleshooting

**Problem: "Schema validation error"**
- Lösung: Stelle sicher dass du das komplette JSON aus `instantdb-schema.json` kopiert hast
- Das JSON muss valid sein (keine fehlenden Kommas, Klammern)

**Problem: "Invite-Code ungültig"**
- Lösung: Prüfe in der InstantDB Console ob der Code existiert und `used: false` ist
- Code muss genau geschrieben werden: `WELCOME1` (Großbuchstaben)

**Problem: "Auth error"**
- Lösung: Prüfe die Permissions im "Permissions" Tab
- Stelle sicher dass alle Rules korrekt gesetzt sind

## Next Steps

Nach erfolgreicher Registrierung kannst du:
- ✅ Memes erstellen im **Generator**
- ✅ Alle Memes sehen im **Feed**  
- ✅ Memes up/downvoten
- ✅ Neue Invite-Codes generieren unter **Invite-Codes**

