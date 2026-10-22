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

**Otomatik oluşturulan API anahtarlarıyla toplu DimiLinks hesabı oluşturun — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-35-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

DimiLinks, kayıt kredisinin **çok küçük (5.000 birim ≈ $0.01)** olduğu ve asıl paranın **günlük check-in**'de olduğu bir New API ailesi panelidir: hesaplar **günde +18k…+98k kota birimi** ölçtü (19 canlı hesap ilk check-in'lerinden sonra 15.307 ile 103.660 arasına yerleşti). Panel **`default` grubunu terk etmiştir** (`403 分组 default 已被弃用`) ve çalışan kanalları **`Open ai 特价`** ailesinde yaşar — bu araç tam olarak anahtarı orada oluşturur ve canlı kapı `gpt-6-sol` çalıştırır.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Bu panelde kredi yalnızca check-in ile gelir:** yeni bir hesap 5.000 birimle başlar ve bakiye günlük check-in ile büyür.

| Ne | Değer |
| --- | --- |
| Kayıt kredisi (`quotaStart`) | **5.000** birim (qpu=500,000 → ≈ $0.01 — kayıt kredisini gürültü olarak kabul edin) |
| **Günlük check-in** | **+18.000 … +98.000 birim/gün** (19 hesapta ölçüldü: quotaAfter 15.307…103.660) |
| Çalışan grup | **`Open ai 特价`** (+ kardeşleri `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` şu yanıtı verir: `403 分组 default 已被弃用` |
| Katalog | Canlı fiyatlandırma sayfasında 35 model girdisi |
| Kayıt | e-posta + 6 karakterli kod — **captcha yok** (`turnstile_check: false`) |
| Ölçeklenen birim | **bir hesap = bir anahtar**, anahtar saklanmadan önce bir kez check-in yapılır |

> 💡 Ücretsiz katman DimiLinks tarafından belirlenir ve değişebilir. Canlı sayıları [dimilinks.com](https://dimilinks.com) adresinden kontrol edin — ve aracın kendi kapısının karar vermesine izin verin:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 35'inin tamamı

Canlı katalog **35 model girdisi** taşır; doğrulanmış anahtar satırı `gpt-6-sol` olup `Open ai 特价` grup ailesi üzerinden yönlendirilir:

| Model ID | Grup | Doğrulandı |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | Üretim sırasında **100/100 anahtar chat-200**; bağımsız yeniden kontrol **3/3** (`GET /v1/models` + gerçek tamamlama) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API nasıl kullanılır

Temel URL **`https://dimilinks.com/v1`** — OpenAI uyumlu.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

Grup, oluşturma anında anahtara bağlanır — `Open ai 特价` içinde oluşturulan bir anahtar o grubun kanallarına hizmet eder; CLI'nin `--group`/`--alt-groups` seçenekleri varsayılan olarak çalışan aileye ayarlanır.

## 🛠 Hızlı başlangıç

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Bir anahtar `keys.txt` dosyasına **yalnızca** `/v1/chat/completions` gerçek içerikle 200 yanıtı verdikten sonra yazılır; `accounts.json` kullanıcı adı / e-posta / quotaStart → quotaAfterCheckin / grup bilgilerini saklar.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini ve sayıyı sorar, bunları hatırlar ve CLI'yi çalıştırır — üret, doğrula, çıkışları tara, ayarlar, yardım, 9Router'a Bağlan.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — kayıt açık, e-posta doğrulama açık, captcha kapalı, check-in açık |
| `POST /api/user/checkin` | **200** — bakiye 5.000'den 15k–104k'ya yükselir (önemli olan kredi) |
| `POST /api/token/` (+ reveal) `Open ai 特价` içinde | **200** — anahtar materyali bir kez döndürülür (kardeş gruplar boş token durumlarını yakalar) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — yazılmadan önce **her** anahtar için | Gerçek içerikle **200** — **100/100 anahtar** |
| bağımsız yeniden kontrol (taze çıkış, örnek) | **3/3** anahtar `GET /v1/models` 200 + tamamlama 200 |
| chat kontrolünde başarısız olan bir anahtar | asla yazılmaz — hesap `accounts.json` içinde kalır |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| durum | `GET /api/status` | kayıt/e-posta/check-in kapıları (captcha kapalı) |
| posta kutusu | Emailnator `POST /api/generate-email` | Mailtrap 300 gelen kutusu filo sınırına ulaştı; gmail her yerde çalışır |
| kod gönder | `GET /api/verification?email=…` | gelen kutusundan 6 karakterli kod |
| kayıt | `POST /api/user/register` | e-posta + kod + parola |
| giriş | `POST /api/user/login` | oturum token'ı |
| **check-in** | `POST /api/user/checkin` | günlük bonus — panelin gerçek ücretsiz katmanı budur |
| anahtar | `Open ai 特价` içinde `POST /api/token/` (yedek: pro kardeşler) | birincil gruptaki boş dönüşler kardeşlere geçer |
| kanıt | `POST /v1/chat/completions` `gpt-6-sol` | içerikle 200 = anahtar canlı |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Varsayılan | Anlam |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | çıkış havuzu, her satırda bir proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | canlı doğrulama için model |

## 🛰️ Proxy arkasında

**İsteğe bağlı — ölçekte önerilir (IP başına limitler, yasaklar).** Araç proxy olmadan da çalışır.

- **Havuzla:** `--pool <file>` geçin (veya `DIMILINKS_PROXIES` ayarlayın) ve her istek o listeden bir çıkış üzerinden gider — ölü bir hat o denemeyi başarısız kılar ve araç bir sonrakine geçer (havuz sağlandığında fail-closed; havuz kullanımda yeniden yoklanır).
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır ve doğrudan bağlanır. Kayıt, check-in, anahtar üretimi veya doğrulama hakkında hiçbir şey değişmez — yalnızca paketlerin nereden çıktığı değişir.
- Her iki moda karşı `--screen` çalıştırın: gerçek bir çalıştırmadan önce sahip olduğunuz çıkışları (veya doğrudan rotayı) sağlayıcıya karşı test eder.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | kullanıcı adı / e-posta / quotaStart / quotaAfterCheckin / grup |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `outputs/` | çalıştırma günlükleri — git tarafından yok sayılır |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Varsayılanlar: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Modeller `dimilinks/<model id>` olarak sunulur.

## 🔌 OmniRoute'a bağlan

[OmniRoute](https://omniroute.online) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Varsayılanlar: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Modeller `dimilinks/<model id>` olarak sunulur.
## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Sağlayıcının verdikleri | check-in kredisi: hesap başına **günde +18k…+98k birim** |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabında bir anahtar, `Open ai 特价` içinde oluşturulmuş, `gpt-6-sol` üzerinde chat ile doğrulanmış |
| 🌐 API şekli | OpenAI uyumlu: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca `dimilinks.com` ve gelen kutusu arka ucunuzla iletişim kurulur |

## 🐞 Sorunlar

DimiLinks gruplarını, check-in ödülünü veya kayıt kapılarını değiştirirse, araç orada durur ve bunu bildirir. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey katkıda bulunanlar

</div>