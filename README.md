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

**Bulk-create DimiLinks accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-35-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

DimiLinks is a New API family panel where the registration credit is **tiny (5,000 units ≈ $0.01)** and the real money is the **daily check-in**: accounts measured **+18k…+98k quota units per day** (19 live accounts landed between 15,307 and 103,660 after their first check-in). The panel has **abandoned its `default` group** (`403 分组 default 已被弃用`) and its working channels live in the **`Open ai 特价`** family — which is exactly where this tool creates the key and where the live gate runs `gpt-6-sol`.

## 🎁 Free tier — how much you get

**Credit is check-in-only on this panel:** a fresh account starts with 5,000 units and the balance grows from the daily check-in.

| What | Value |
| --- | --- |
| Registration credit (`quotaStart`) | **5,000** units (qpu=500,000 → ≈ $0.01 — treat the sign-up credit as noise) |
| **Daily check-in** | **+18,000 … +98,000 units/day** (measured on 19 accounts: quotaAfter 15,307…103,660) |
| Working group | **`Open ai 特价`** (+ siblings `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` answers `403 分组 default 已被弃用` |
| Catalogue | 35 model entries on the live pricing sheet |
| Signup | e-mail + 6-char code — **no captcha** (`turnstile_check: false`) |
| The unit that scales | **one account = one key**, check-in'd once before the key is kept |

> 💡 The free tier is set by DimiLinks and can change. Check the live numbers at [dimilinks.com](https://dimilinks.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 35 of them

The live catalogue carries **35 model entries**; the verified key line is `gpt-6-sol`, routed through the `Open ai 特价` group family:

| Model ID | Group | Verified |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **100/100 keys chat-200** during the mint; independent re-check **3/3** (`GET /v1/models` + real completion) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 How to use the API

Base URL **`https://dimilinks.com/v1`** — OpenAI-compatible.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

The group is bound to the key at creation time — a key made in `Open ai 特价` serves that group's channels; the CLI's `--group`/`--alt-groups` default to the working family.

## 🛠 Quick start

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

A key is written to `keys.txt` **only** after `/v1/chat/completions` answers 200 with real content; `accounts.json` keeps username / e-mail / quotaStart → quotaAfterCheckin / group.

### 🖱️ The launcher

The launcher asks for the proxy list and count, remembers them, and runs the CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `GET /api/status` | **200** — register on, e-mail verification on, captcha off, check-in on |
| `POST /api/user/checkin` | **200** — balance moves from 5,000 to 15k–104k (the credit that matters) |
| `POST /api/token/` (+ reveal) in `Open ai 特价` | **200** — key material returned once (sibling groups catch the empty-token rolls) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — for **every** key before it is written | **200** with real content — **100/100 keys** |
| independent re-check (fresh exit, sample) | **3/3** keys `GET /v1/models` 200 + completion 200 |
| a key that fails its chat check | never written — account stays in `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| status | `GET /api/status` | register/e-mail/check-in gates (captcha off) |
| mailbox | Emailnator `POST /api/generate-email` | Mailtrap hit its 300-inbox fleet cap; gmail works everywhere |
| send code | `GET /api/verification?email=…` | 6-char code from the inbox |
| register | `POST /api/user/register` | e-mail + code + password |
| login | `POST /api/user/login` | session token |
| **check-in** | `POST /api/user/checkin` | the daily bonus — this is the panel's real free tier |
| key | `POST /api/token/` in `Open ai 特价` (fallback: pro siblings) | empty returns on the primary group fall through to siblings |
| proof | `POST /v1/chat/completions` `gpt-6-sol` | 200 with content = the key is live |

## ⚙️ CLI options

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Default | Meaning |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | exit pool, one line per proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | model for the live verification |

## 🛰️ Behind a proxy

**Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too.

- **With a pool:** pass `--pool <file>` (or set `DIMILINKS_PROXIES`) and every request goes through an exit from that list — a dead line fails that attempt and the tool moves to the next one (fail-closed while a pool is provided; the pool is re-probed at use).
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly. Nothing about sign-up, check-in, key minting or verification changes — only where the packets leave from.
- Run `--screen` against either mode: it tests the exits you have (or the direct route) against the provider before a real run.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | your exits — git-ignored |
| `outputs/` | run logs — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Defaults: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Models are served as `dimilinks/<model id>`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 What the provider gives | check-in credit: **+18k…+98k units/day** per account |
| 🔑 What one key gets you | one key on its own account, created in `Open ai 特价`, chat-verified on `gpt-6-sol` |
| 🌐 API shape | OpenAI-compatible: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Your data | only `dimilinks.com` and your inbox backend are contacted |

## 🐞 Issues

If DimiLinks changes its groups, the check-in reward or the register gates, the tool stops there and says so. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>
