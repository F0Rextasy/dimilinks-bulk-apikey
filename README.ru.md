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

**Массовое создание аккаунтов DimiLinks с автоматически сгенерированными API-ключами — вывод, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-35-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

DimiLinks — это панель семейства New API, где регистрационный бонус **крошечный (5 000 единиц ≈ $0.01)**, а настоящие деньги — это **ежедневная отметка (check-in)**: у аккаунтов замерено **+18k…+98k единиц квоты в день** (19 живых аккаунтов после первой отметки оказались в диапазоне от 15 307 до 103 660). Панель **отказалась от своей группы `default`** (`403 分组 default 已被弃用`), и её рабочие каналы живут в семействе **`Open ai 特价`** — именно там этот инструмент создаёт ключ и где живой шлюз прогоняет `gpt-6-sol`.

## 🎁 Бесплатный тариф — сколько вы получаете

**На этой панели бонус начисляется только за отметку:** новый аккаунт стартует с 5 000 единиц, а баланс растёт от ежедневной отметки.

| Что | Значение |
| --- | --- |
| Регистрационный бонус (`quotaStart`) | **5 000** единиц (qpu=500 000 → ≈ $0.01 — считайте регистрационный бонус шумом) |
| **Ежедневная отметка** | **+18 000 … +98 000 единиц/день** (замерено на 19 аккаунтах: quotaAfter 15 307…103 660) |
| Рабочая группа | **`Open ai 特价`** (+ родственные `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` отвечает `403 分组 default 已被弃用` |
| Каталог | 35 записей моделей в живом прайс-листе |
| Регистрация | e-mail + 6-символьный код — **без капчи** (`turnstile_check: false`) |
| Единица масштабирования | **один аккаунт = один ключ**, отметка выполняется один раз до сохранения ключа |

> 💡 Бесплатный тариф задаётся DimiLinks и может измениться. Смотрите актуальные цифры на [dimilinks.com](https://dimilinks.com) — и пусть собственный шлюз инструмента решает:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 35

Живой каталог содержит **35 записей моделей**; проверенная строка ключа — `gpt-6-sol`, маршрутизируемая через семейство групп `Open ai 特价`:

| Model ID | Group | Verified |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **chat-200** during the mint; independent re-check (proxy exit) (`GET /v1/models` + real completion) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Как использовать API

Базовый URL **`https://dimilinks.com/v1`** — совместим с OpenAI.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

Группа привязывается к ключу в момент создания — ключ, созданный в `Open ai 特价`, обслуживает каналы этой группы; параметры CLI `--group`/`--alt-groups` по умолчанию указывают на рабочее семейство.

## 🛠 Быстрый старт

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Ключ записывается в `keys.txt` **только** после того, как `/v1/chat/completions` ответит 200 с реальным содержимым; `accounts.json` хранит username / e-mail / quotaStart → quotaAfterCheckin / group.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси и количество, запоминает их и запускает CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — регистрация включена, подтверждение e-mail включено, капча выключена, отметка включена |
| `POST /api/user/checkin` | **200** — баланс растёт с 5 000 до 15k–104k (бонус, который имеет значение) |
| `POST /api/token/` (+ reveal) в `Open ai 特价` | **200** — материал ключа возвращается один раз (родственные группы ловят пустые возвраты токена) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — для **каждого** ключа до его записи | **200** с реальным содержимым — **100/100 ключей** |
| независимая перепроверка (свежий выход, выборка) | **3/3** ключа `GET /v1/models` 200 + completion 200 |
| ключ, не прошедший свою чат-проверку | никогда не записывается — аккаунт остаётся в `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| status | `GET /api/status` | шлюзы регистрации/e-mail/отметки (капча выключена) |
| mailbox | Emailnator `POST /api/generate-email` | Mailtrap упёрся в лимит флота из 300 ящиков; gmail работает везде |
| send code | `GET /api/verification?email=…` | 6-символьный код из ящика |
| register | `POST /api/user/register` | e-mail + код + пароль |
| login | `POST /api/user/login` | токен сессии |
| **check-in** | `POST /api/user/checkin` | ежедневный бонус — это и есть реальный бесплатный тариф панели |
| key | `POST /api/token/` в `Open ai 特价` (fallback: pro siblings) | пустые возвраты на основной группе переходят к родственным |
| proof | `POST /v1/chat/completions` `gpt-6-sol` | 200 с содержимым = ключ живой |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | По умолчанию | Значение |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | пул выходов, одна строка на прокси |
| `DIMILINKS_MODEL` | `gpt-6-sol` | модель для живой проверки |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабе (лимиты на IP, баны).** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `DIMILINKS_PROXIES`), и каждый запрос идёт через выход из этого списка — мёртвая линия проваливает эту попытку, и инструмент переходит к следующей (fail-closed, пока пул предоставлен; пул перепроверяется при использовании).
- **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую. Ничего в регистрации, отметке, создании ключей или проверке не меняется — меняется только то, откуда уходят пакеты.
- Запустите `--screen` в любом из режимов: он тестирует имеющиеся у вас выходы (или прямой маршрут) против провайдера перед реальным запуском.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один живой проверенный ключ на строку — игнорируется git |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | ваши выходы — игнорируется git |
| `outputs/` | логи запусков — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый, совместимый с OpenAI роутер:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

По умолчанию: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Модели подаются как `dimilinks/<model id>`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Что даёт провайдер | бонус за отметку: **+18k…+98k единиц/день** на аккаунт |
| 🔑 Что даёт один ключ | один ключ на своём аккаунте, созданный в `Open ai 特价`, проверенный чатом на `gpt-6-sol` |
| 🌐 Форма API | совместим с OpenAI: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Ваши данные | контакт только с `dimilinks.com` и вашим бэкендом ящика |

## 🐞 Проблемы

Если DimiLinks изменит свои группы, награду за отметку или шлюзы регистрации, инструмент остановится на этом и сообщит об этом. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>