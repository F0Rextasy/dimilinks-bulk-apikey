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

**Créez en masse des comptes DimiLinks avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-35-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

DimiLinks est un panneau de la famille New API où le crédit d'inscription est **minuscule (5 000 unités ≈ 0,01 $)** et où le véritable argent se trouve dans le **check-in quotidien** : les comptes ont mesuré **+18k…+98k unités de quota par jour** (19 comptes actifs ont atterri entre 15 307 et 103 660 après leur premier check-in). Le panneau a **abandonné son groupe `default`** (`403 分组 default 已被弃用`) et ses canaux fonctionnels vivent dans la famille **`Open ai 特价`** — c'est exactement là que cet outil crée la clé et où la porte de vérification en direct exécute `gpt-6-sol`.

## 🎁 Offre gratuite — combien vous obtenez

**Le crédit est uniquement lié au check-in sur ce panneau :** un nouveau compte démarre avec 5 000 unités et le solde augmente grâce au check-in quotidien.

| Quoi | Valeur |
| --- | --- |
| Crédit d'inscription (`quotaStart`) | **5 000** unités (qpu=500 000 → ≈ 0,01 $ — considérez le crédit d'inscription comme négligeable) |
| **Check-in quotidien** | **+18 000 … +98 000 unités/jour** (mesuré sur 19 comptes : quotaAfter 15 307…103 660) |
| Groupe fonctionnel | **`Open ai 特价`** (+ les frères `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` répond `403 分组 default 已被弃用` |
| Catalogue | 35 entrées de modèles sur la feuille de tarification en direct |
| Inscription | e-mail + code à 6 caractères — **pas de captcha** (`turnstile_check: false`) |
| L'unité qui compte | **un compte = une clé**, check-in effectué une fois avant que la clé ne soit conservée |

> 💡 L'offre gratuite est définie par DimiLinks et peut changer. Consultez les chiffres en direct sur [dimilinks.com](https://dimilinks.com) — et laissez la porte de vérification de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 35 au complet

Le catalogue en direct contient **35 entrées de modèles** ; la ligne de clé vérifiée est `gpt-6-sol`, routée via la famille de groupes `Open ai 特价` :

| ID du modèle | Groupe | Vérifié |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **100/100 clés chat-200** pendant la création ; re-vérification indépendante **3/3** (`GET /v1/models` + complétion réelle) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Comment utiliser l'API

URL de base **`https://dimilinks.com/v1`** — compatible OpenAI.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

Le groupe est lié à la clé au moment de la création — une clé créée dans `Open ai 特价` sert les canaux de ce groupe ; les options `--group`/`--alt-groups` du CLI utilisent par défaut la famille fonctionnelle.

## 🛠 Démarrage rapide

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Une clé n'est écrite dans `keys.txt` **qu'après** que `/v1/chat/completions` ait répondu 200 avec du contenu réel ; `accounts.json` conserve username / e-mail / quotaStart → quotaAfterCheckin / groupe.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxies et le nombre, les mémorise, et exécute le CLI — création, vérification, test des sorties, paramètres, aide, connexion à 9Router.

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET /api/status` | **200** — inscription activée, vérification e-mail activée, captcha désactivé, check-in activé |
| `POST /api/user/checkin` | **200** — le solde passe de 5 000 à 15k–104k (le crédit qui compte) |
| `POST /api/token/` (+ révélation) dans `Open ai 特价` | **200** — le matériel de clé est renvoyé une fois (les groupes frères rattrapent les tirages à token vide) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — pour **chaque** clé avant son écriture | **200** avec du contenu réel — **100/100 clés** |
| re-vérification indépendante (sortie fraîche, échantillon) | **3/3** clés `GET /v1/models` 200 + complétion 200 |
| une clé qui échoue à sa vérification de chat | jamais écrite — le compte reste dans `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| statut | `GET /api/status` | portes inscription/e-mail/check-in (captcha désactivé) |
| boîte mail | Emailnator `POST /api/generate-email` | Mailtrap a atteint sa limite de 300 boîtes ; gmail fonctionne partout |
| envoi du code | `GET /api/verification?email=…` | code à 6 caractères depuis la boîte mail |
| inscription | `POST /api/user/register` | e-mail + code + mot de passe |
| connexion | `POST /api/user/login` | jeton de session |
| **check-in** | `POST /api/user/checkin` | le bonus quotidien — c'est la véritable offre gratuite du panneau |
| clé | `POST /api/token/` dans `Open ai 特价` (repli : frères pro) | les retours vides sur le groupe principal basculent vers les frères |
| preuve | `POST /v1/chat/completions` `gpt-6-sol` | 200 avec contenu = la clé est active |

## ⚙️ Options du CLI

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Défaut | Signification |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | pool de sorties, une ligne par proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | modèle pour la vérification en direct |

## 🛰️ Derrière un proxy

**Optionnel — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--pool <file>` (ou définissez `DIMILINKS_PROXIES`) et chaque requête passe par une sortie de cette liste — une ligne morte fait échouer cette tentative et l'outil passe à la suivante (fail-closed tant qu'un pool est fourni ; le pool est re-testé à l'usage).
- **Sans pool :** le CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement. Rien ne change pour l'inscription, le check-in, la création de clé ou la vérification — seul le point de sortie des paquets change.
- Lancez `--screen` dans l'un ou l'autre mode : il teste les sorties dont vous disposez (ou la route directe) contre le fournisseur avant une exécution réelle.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / groupe |
| `proxies.txt` | vos sorties — ignoré par git |
| `outputs/` | journaux d'exécution — ignorés par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Valeurs par défaut : `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Les modèles sont servis sous `dimilinks/<model id>`.

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI :

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Valeurs par défaut : `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Les modèles sont servis sous `dimilinks/<model id>`.
## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Ce que le fournisseur offre | crédit de check-in : **+18k…+98k unités/jour** par compte |
| 🔑 Ce qu'une clé vous apporte | une clé sur son propre compte, créée dans `Open ai 特价`, vérifiée par chat sur `gpt-6-sol` |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Vos données | seuls `dimilinks.com` et votre backend de boîte mail sont contactés |

## 🐞 Problèmes

Si DimiLinks change ses groupes, la récompense de check-in ou les portes d'inscription, l'outil s'arrête là et le signale. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>