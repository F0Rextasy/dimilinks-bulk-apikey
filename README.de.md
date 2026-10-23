<div align="center">

```
██████╗ ██╗███╗   ███╗██╗██╗     ██╗███╗   ██╗██╗  ██╗███████╗
██╔══██╗██║████╗ ████║██║██║     ██║████╗  ██║██║ ██╔╝██╔════╝
██║  ██║██║██╔████╔██║██║██║     ██║██╔██╗ ██║█████╔╝ ███████╗
██║  ██║██║██║╚██╔╝██║██║██║     ██║██║╚██╗██║██╔═██╗ ╚════██║
██████╔╝██║██║ ╚═╝ ██║██║███████╗██║██║ ╚████║██║  ██╗███████║
╚═════╝ ╚═╝╚═╝     ╚═╝╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
```

# dimilinks-bulk-apikey

**DimiLinks-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-35-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

DimiLinks ist ein Panel der New-API-Familie, bei dem das Registrierungsguthaben **winzig ist (5.000 Einheiten ≈ $0.01)** und das echte Geld im **täglichen Check-in** steckt: Konten erreichten **+18k…+98k Quota-Einheiten pro Tag** (19 aktive Konten landeten nach ihrem ersten Check-in zwischen 15.307 und 103.660). Das Panel hat seine **`default`-Gruppe aufgegeben** (`403 分组 default 已被弃用`) und seine funktionierenden Kanäle leben in der **`Open ai 特价`**-Familie — genau dort erstellt dieses Tool den Schlüssel und dort läuft das Live-Gate `gpt-6-sol`.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Guthaben gibt es auf diesem Panel nur per Check-in:** ein frisches Konto startet mit 5.000 Einheiten und das Guthaben wächst durch den täglichen Check-in.

| Was | Wert |
| --- | --- |
| Registrierungsguthaben (`quotaStart`) | **5.000** Einheiten (qpu=500.000 → ≈ $0.01 — betrachte das Anmeldeguthaben als Rauschen) |
| **Täglicher Check-in** | **+18.000 … +98.000 Einheiten/Tag** (gemessen an 19 Konten: quotaAfter 15.307…103.660) |
| Funktionierende Gruppe | **`Open ai 特价`** (+ Geschwister `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` antwortet mit `403 分组 default 已被弃用` |
| Katalog | 35 Modelleinträge auf dem Live-Preisblatt |
| Anmeldung | E-Mail + 6-stelliger Code — **kein Captcha** (`turnstile_check: false`) |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel**, einmal eingecheckt, bevor der Schlüssel behalten wird |

> 💡 Die kostenlose Stufe wird von DimiLinks festgelegt und kann sich ändern. Prüfe die Live-Zahlen auf [dimilinks.com](https://dimilinks.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 35

Der Live-Katalog enthält **35 Modelleinträge**; die verifizierte Schlüsselzeile ist `gpt-6-sol`, geroutet über die `Open ai 特价`-Gruppenfamilie:

| Modell-ID | Gruppe | Verifiziert |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **jeder Schlüssel, chat-200** während der Erstellung; unabhängige Nachprüfung **3/3** (`GET /v1/models` + echte Completion) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 So verwendest du die API

Basis-URL **`https://dimilinks.com/v1`** — OpenAI-kompatibel.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

Die Gruppe wird bei der Erstellung an den Schlüssel gebunden — ein in `Open ai 特价` erstellter Schlüssel bedient die Kanäle dieser Gruppe; die `--group`/`--alt-groups` der CLI verwenden standardmäßig die funktionierende Familie.

## 🛠 Schnellstart

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Ein Schlüssel wird **nur** dann in `keys.txt` geschrieben, wenn `/v1/chat/completions` mit 200 und echtem Inhalt antwortet; `accounts.json` speichert Benutzername / E-Mail / quotaStart → quotaAfterCheckin / Gruppe.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste und der Anzahl, merkt sie sich und führt die CLI aus — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — Registrierung an, E-Mail-Verifizierung an, Captcha aus, Check-in an |
| `POST /api/user/checkin` | **200** — Guthaben steigt von 5.000 auf 15k–104k (das Guthaben, das zählt) |
| `POST /api/token/` (+ reveal) in `Open ai 特价` | **200** — Schlüsselmaterial wird einmal zurückgegeben (Geschwistergruppen fangen die leeren Token-Ausgaben ab) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — für **jeden** Schlüssel, bevor er geschrieben wird | **200** mit echtem Inhalt — jeder Schlüssel |
| unabhängige Nachprüfung (frischer Exit, Stichprobe) | **3/3** Schlüssel `GET /v1/models` 200 + Completion 200 |
| ein Schlüssel, der seine Chat-Prüfung nicht besteht | wird nie geschrieben — das Konto bleibt in `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

> **Qualitätsgates.** Jeder Schlüssel hier hat ein Live-`chat-200` bestanden, bevor er in `keys.txt`
> geschrieben wurde (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben
> Regel auf Modellebene: ein Eintrag wird **nur hinzugefügt, wenn das Modell `chat-200` antwortet und
> Tools aufrufen kann** — ein Modell ohne Tool-Unterstützung, ein toter Schlüssel oder ein toter
> Anbieter wird verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus;
> Fehler werden gemeldet, nie versteckt.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| status | `GET /api/status` | Register-/E-Mail-/Check-in-Gates (Captcha aus) |
| Mailbox | Emailnator `POST /api/generate-email` | Mailtrap erreichte sein Flottenlimit von 300 Postfächern; gmail funktioniert überall |
| Code senden | `GET /api/verification?email=…` | 6-stelliger Code aus der Mailbox |
| registrieren | `POST /api/user/register` | E-Mail + Code + Passwort |
| anmelden | `POST /api/user/login` | Session-Token |
| **Check-in** | `POST /api/user/checkin` | der Tagesbonus — das ist die echte kostenlose Stufe des Panels |
| Schlüssel | `POST /api/token/` in `Open ai 特价` (Fallback: pro-Geschwister) | leere Rückgaben in der primären Gruppe fallen auf Geschwister durch |
| Nachweis | `POST /v1/chat/completions` `gpt-6-sol` | 200 mit Inhalt = der Schlüssel ist live |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Standard | Bedeutung |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | Exit-Pool, eine Zeile pro Proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | Modell für die Live-Verifizierung |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Sperren).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `DIMILINKS_PROXIES`) und jede Anfrage geht über einen Exit aus dieser Liste — eine tote Zeile lässt diesen Versuch fehlschlagen und das Tool wechselt zur nächsten (fail-closed, solange ein Pool angegeben ist; der Pool wird bei der Verwendung erneut geprüft).
- **Ohne Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt. An Registrierung, Check-in, Schlüsselerstellung oder Verifizierung ändert sich nichts — nur daran, wo die Pakete das System verlassen.
- Führe `--screen` in beiden Modi aus: es testet die Exits, die du hast (oder die direkte Route), gegen den Anbieter, bevor ein echter Lauf startet.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von git ignoriert |
| `accounts.json` | Benutzername / E-Mail / quotaStart / quotaAfterCheckin / Gruppe |
| `proxies.txt` | deine Exits — von git ignoriert |
| `outputs/` | Lauf-Logs — von git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Standardwerte: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Modelle werden als `dimilinks/<model id>` bereitgestellt.

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Standardwerte: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Modelle werden als `dimilinks/<model id>` bereitgestellt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Was der Anbieter gibt | Check-in-Guthaben: **+18k…+98k Einheiten/Tag** pro Konto |
| 🔑 Was ein Schlüssel dir bringt | ein Schlüssel auf seinem eigenen Konto, erstellt in `Open ai 特价`, chat-verifiziert auf `gpt-6-sol` |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Deine Daten | nur `dimilinks.com` und dein Mailbox-Backend werden kontaktiert |

## 🐞 Probleme

Wenn DimiLinks seine Gruppen, die Check-in-Belohnung oder die Registrierungs-Gates ändert, stoppt das Tool dort und sagt es dir. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>