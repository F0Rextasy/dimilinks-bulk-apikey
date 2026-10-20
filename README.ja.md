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

**自動生成された API キーで DimiLinks アカウントを一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-35-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ なぜこれが存在するのか

DimiLinks は New API ファミリーのパネルで、登録クレジットは**ごくわずか（5,000 ユニット ≈ $0.01）**であり、本当の価値は**毎日のチェックイン**にあります。アカウントは**1日あたり +18k…+98k クォータユニット**を計測しました（19 の実アカウントが初回チェックイン後に 15,307 から 103,660 の間に到達）。このパネルは**`default` グループを廃止**しており（`403 分组 default 已被弃用`）、稼働中のチャネルは**`Open ai 特价`**ファミリーに存在します。まさにこのツールがキーを作成し、ライブゲートが `gpt-6-sol` を実行する場所です。

## 🎁 無料枠 — どれだけ得られるか

**このパネルではクレジットはチェックインのみです：** 新規アカウントは 5,000 ユニットで始まり、残高は毎日のチェックインで増えていきます。

| 項目 | 値 |
| --- | --- |
| 登録クレジット（`quotaStart`） | **5,000** ユニット（qpu=500,000 → ≈ $0.01 — 登録クレジットはノイズと考えてください） |
| **毎日のチェックイン** | **+18,000 … +98,000 ユニット/日**（19 アカウントで計測：quotaAfter 15,307…103,660） |
| 稼働グループ | **`Open ai 特价`**（+ 兄弟グループ `Open ai 特价 pro`、`Open ai 特价 pro 不降智`）— `default` は `403 分组 default 已被弃用` を返します |
| カタログ | ライブ価格表に 35 のモデルエントリ |
| サインアップ | メール + 6 文字コード — **キャプチャなし**（`turnstile_check: false`） |
| スケールする単位 | **1 アカウント = 1 キー**、キーが保持される前に一度チェックイン |

> 💡 無料枠は DimiLinks によって設定され、変更される可能性があります。最新の数値は [dimilinks.com](https://dimilinks.com) で確認してください — そしてツール自身のゲートに判断させてください：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — そのすべて 35 個

ライブカタログには **35 のモデルエントリ**があります。検証済みのキーラインは `gpt-6-sol` で、`Open ai 特价` グループファミリーを通じてルーティングされます：

| モデル ID | グループ | 検証済み |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | ミント中に **100/100 キーが chat-200**、独立した再チェック **3/3**（`GET /v1/models` + 実際の補完） |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API の使い方

ベース URL **`https://dimilinks.com/v1`** — OpenAI 互換。

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

グループは作成時にキーにバインドされます — `Open ai 特价` で作成されたキーはそのグループのチャネルにサービスを提供します。CLI の `--group`/`--alt-groups` はデフォルトで稼働ファミリーになります。

## 🛠 クイックスタート

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt
node src/launcher.js        # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

キーは `/v1/chat/completions` が実際のコンテンツで 200 を返した**後にのみ** `keys.txt` に書き込まれます。`accounts.json` は username / e-mail / quotaStart → quotaAfterCheckin / group を保持します。

### 🖱️ ランチャー

ランチャーはプロキシリストとカウントを要求し、それらを記憶して CLI を実行します — mint、verify、screen exits、settings、help、Connect to 9Router。

## ✅ 検証済みで動作 — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — 登録オン、メール認証オン、キャプチャオフ、チェックインオン |
| `POST /api/user/checkin` | **200** — 残高が 5,000 から 15k–104k に移動（重要なクレジット） |
| `Open ai 特价` での `POST /api/token/`（+ reveal） | **200** — キーマテリアルが一度返される（兄弟グループが空トークンのロールをキャッチ） |
| `POST /v1/chat/completions`（`gpt-6-sol`）— 書き込まれる前の**すべての**キーに対して | 実際のコンテンツで **200** — **100/100 キー** |
| 独立した再チェック（新しい出口、サンプル） | **3/3** キーが `GET /v1/models` 200 + 補完 200 |
| チャットチェックに失敗したキー | 書き込まれない — アカウントは `accounts.json` に残る |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| status | `GET /api/status` | 登録/メール/チェックインのゲート（キャプチャオフ） |
| mailbox | Emailnator `POST /api/generate-email` | Mailtrap は 300 インボックスのフリート上限に達した。gmail はどこでも動作する |
| send code | `GET /api/verification?email=…` | インボックスからの 6 文字コード |
| register | `POST /api/user/register` | メール + コード + パスワード |
| login | `POST /api/user/login` | セッショントークン |
| **check-in** | `POST /api/user/checkin` | 毎日のボーナス — これがパネルの本当の無料枠 |
| key | `Open ai 特价` での `POST /api/token/`（フォールバック：pro 兄弟） | プライマリグループでの空の戻りは兄弟にフォールスルーする |
| proof | `POST /v1/chat/completions` `gpt-6-sol` | コンテンツ付きの 200 = キーがライブ |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | 出口プール、1 行につき 1 プロキシ |
| `DIMILINKS_MODEL` | `gpt-6-sol` | ライブ検証用のモデル |

## 🛰️ プロキシの背後で

**必須 — 直接接続のフォールバックはありません。** すべてのリクエストは出口を通ります。登録はパネルでレート制限されています（バースト時に `register refused` — CLI は次の出口で再試行します）。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つのライブ検証済みキー — git で無視 |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | あなたの出口 — git で無視 |
| `outputs/` | 実行ログ — git で無視 |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

デフォルト：`--prefix dimilinks`、`--base-url https://dimilinks.com/v1`、`--model gpt-6-sol`。モデルは `dimilinks/<model id>` として提供されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 プロバイダーが提供するもの | チェックインクレジット：アカウントあたり**1日 +18k…+98k ユニット** |
| 🔑 1 つのキーで得られるもの | 独自のアカウント上の 1 つのキー、`Open ai 特价` で作成され、`gpt-6-sol` でチャット検証済み |
| 🌐 API の形式 | OpenAI 互換：`POST https://dimilinks.com/v1/chat/completions` |
| 🔒 あなたのデータ | `dimilinks.com` とあなたのインボックスバックエンドのみが接触される |

## 🐞 問題

DimiLinks がグループ、チェックイン報酬、または登録ゲートを変更した場合、ツールはそこで停止し、その旨を報告します。コマンドと正確な出力を添えて**[issue を開いてください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>