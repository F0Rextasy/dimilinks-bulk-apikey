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

**Массовое создание аккаунтов DimiLinks с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-35-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

DimiLinks — это панель семейства New API, где регистрационный бонус **крошечный (5 000 единиц ≈ $0.01)**, а реальные деньги приносит **ежедневная отметка (check-in)**: у аккаунтов замерено **+18k…+98k единиц квоты в день** (19 живых аккаунтов показали от 15 307 до 103 660 после первой отметки). Панель **отказалась от группы `default`** (`403 分组 default 已被弃用`), а её рабочие каналы живут в семействе **`Open ai 特价`** — именно там этот инструмент создаёт ключ и где живой шлюз запускает `gpt-6-sol`.

## 🎁 Бесплатный тариф — сколько вы получаете

**На этой панели кредит начисляется только за отметку:** новый аккаунт начинает с 5 000 единиц, а баланс растёт за счёт ежедневной отметки.

| Что | Значение |
| --- | --- |
| Регистрационный кредит (`quotaStart`) | **5 000** единиц (qpu=500 000 → ≈ $0.01 — считайте регистрационный бонус шумом) |
| **Ежедневная отметка** | **+18 000 … +98 000 единиц/день** (замерено на 19 аккаунтах: quotaAfter 15 307…103 660) |
| Рабочая группа | **`Open ai 特价`** (+ родственные `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` отвечает `403 分组 default 已被弃用` |
| Каталог | 35 записей моделей в живом прайс-листе |
| Регистрация | e-mail + 6-символьный код — **без капчи** (`turnstile_check: false`) |
| Единица масштабирования | **один аккаунт = один ключ**, отметка выполняется один раз перед сохранением ключа |

> 💡 Бесплатный тариф устанавливается DimiLinks и может измениться. Проверяйте актуальные цифры на [dimilinks.com](https://dimilinks.com) — и пусть собственный шлюз инструмента решает:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 35

Живой каталог содержит **35 записей моделей**; проверенная строка ключа — `gpt-6-sol`, маршрутизируемая через семейство групп `Open ai 特价`:

| Model ID | Group | Verified |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **каждый ключ, chat-200** во время создания; независимая перепроверка **3/3** (`GET /v1/models` + реальное завершение) |

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

Группа привязывается к ключу в момент создания — ключ, созданный в `Open ai 特价`, обслуживает каналы этой группы; параметры CLI `--group`/`--alt-groups` по умолчанию используют рабочее семейство.

## 🛠 Быстрый старт

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Ключ записывается в `keys.txt` **только** после того, как `/v1/chat/completions` ответит 200 с реальным содержимым; `accounts.json` хранит username / e-mail / quotaStart → quotaAfterCheckin / group.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси и количество, запоминает их и запускает CLI — создание, проверка, отсев выходов, настройки, справка, подключение к 9Router.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — регистрация включена, проверка e-mail включена, капча выключена, отметка включена |
| `POST /api/user/checkin` | **200** — баланс растёт с 5 000 до 15k–104k (кредит, который имеет значение) |
| `POST /api/token/` (+ reveal) в `Open ai 特价` | **200** — материал ключа возвращается один раз (родственные группы ловят пустые попытки получения токена) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — для **каждого** ключа перед записью | **200** с реальным содержимым — каждый ключ |
| независимая перепроверка (свежий выход, выборка) | **3/3** ключей `GET /v1/models` 200 + завершение 200 |
| ключ, не прошедший проверку чата | никогда не записывается — аккаунт остаётся в `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` до того, как был записан в `keys.txt`
> (мёртвые ключи никогда не поставляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Перезапускайте шаг проверки в любое время;
> сбои сообщаются, а не скрываются.

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
| статус | `GET /api/status` | шлюзы регистрации/e-mail/отметки (капча выключена) |
| почтовый ящик | Emailnator `POST /api/generate-email` | Mailtrap достиг лимита в 300 ящиков; gmail работает везде |
| отправка кода | `GET /api/verification?email=…` | 6-символьный код из ящика |
| регистрация | `POST /api/user/register` | e-mail + код + пароль |
| вход | `POST /api/user/login` | токен сессии |
| **отметка** | `POST /api/user/checkin` | ежедневный бонус — это и есть реальный бесплатный тариф панели |
| ключ | `POST /api/token/` в `Open ai 特价` (запасной вариант: родственные pro) | пустые ответы на основной группе переходят к родственным |
| доказательство | `POST /v1/chat/completions` `gpt-6-sol` | 200 с содержимым = ключ живой |

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
| `DIMILINKS_PROXIES` | `proxies.txt` | пул выходов, по одной строке на прокси |
| `DIMILINKS_MODEL` | `gpt-6-sol` | модель для живой проверки |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабировании (лимиты на IP, блокировки).** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `DIMILINKS_PROXIES`), и каждый запрос пойдёт через выход из этого списка — мёртвая линия проваливает эту попытку, и инструмент переходит к следующей (fail-closed, пока предоставлен пул; пул перепроверяется при использовании).
- **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую. Ничего в регистрации, отметке, создании ключей или проверке не меняется — только то, откуда уходят пакеты.
- Запустите `--screen` в любом режиме: он тестирует имеющиеся выходы (или прямой маршрут) против провайдера перед реальным запуском.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный в работе ключ на строку — игнорируется git |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | ваши выходы — игнорируется git |
| `outputs/` | логи запусков — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

По умолчанию: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Модели подаются как `dimilinks/<model id>`.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

По умолчанию: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Модели подаются как `dimilinks/<model id>`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Что даёт провайдер | кредит за отметку: **+18k…+98k единиц/день** на аккаунт |
| 🔑 Что даёт один ключ | один ключ на собственном аккаунте, созданный в `Open ai 特价`, проверенный чатом на `gpt-6-sol` |
| 🌐 Форма API | совместим с OpenAI: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Ваши данные | связь только с `dimilinks.com` и вашим почтовым бэкендом |

## 🐞 Проблемы

Если DimiLinks изменит свои группы, награду за отметку или шлюзы регистрации, инструмент остановится там и сообщит об этом. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>