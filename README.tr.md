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

**Otomatik oluşturulan API anahtarlarıyla toplu DimiLinks hesabı açın — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-35-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

DimiLinks, kayıt kredisinin **çok küçük (5.000 birim ≈ $0.01)** olduğu ve asıl paranın **günlük giriş (check-in)** olduğu bir New API ailesi panelidir: hesaplar **günde +18k…+98k kota birimi** ölçtü (19 canlı hesap, ilk girişlerinden sonra 15.307 ile 103.660 arasına yerleşti). Panel **`default` grubunu terk etti** (`403 分组 default 已被弃用`) ve çalışan kanalları **`Open ai 特价`** ailesinde yaşıyor — bu araç tam da orada anahtarı oluşturuyor ve canlı kapı `gpt-6-sol` çalıştırıyor.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Bu panelde kredi yalnızca girişle gelir:** yeni bir hesap 5.000 birimle başlar ve bakiye günlük girişten büyür.

| Ne | Değer |
| --- | --- |
| Kayıt kredisi (`quotaStart`) | **5.000** birim (qpu=500.000 → ≈ $0.01 — kayıt kredisini gürültü olarak görün) |
| **Günlük giriş** | **+18.000 … +98.000 birim/gün** (19 hesapta ölçüldü: quotaAfter 15.307…103.660) |
| Çalışan grup | **`Open ai 特价`** (+ kardeşleri `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` şu yanıtı veriyor: `403 分组 default 已被弃用` |
| Katalog | Canlı fiyat listesinde 35 model girdisi |
| Kayıt | e-posta + 6 karakterli kod — **captcha yok** (`turnstile_check: false`) |
| Ölçeklenen birim | **bir hesap = bir anahtar**, anahtar saklanmadan önce bir kez giriş yapılır |

> 💡 Ücretsiz katman DimiLinks tarafından belirlenir ve değişebilir. Canlı sayıları [dimilinks.com](https://dimilinks.com) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 35'inin tamamı

Canlı katalog **35 model girdisi** taşıyor; doğrulanmış anahtar satırı `gpt-6-sol` ve `Open ai 特价` grup ailesi üzerinden yönlendiriliyor:

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

Grup, oluşturma anında anahtara bağlanır — `Open ai 特价` içinde oluşturulan bir anahtar o grubun kanallarına hizmet eder; CLI'nin `--group`/`--alt-groups` seçenekleri varsayılan olarak çalışan aileyi kullanır.

## 🛠 Hızlı başlangıç

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt
node src/launcher.js        # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Bir anahtar `keys.txt` dosyasına **yalnızca** `/v1/chat/completions` gerçek içerikle 200 yanıtı verdikten sonra yazılır; `accounts.json` kullanıcı adı / e-posta / quotaStart → quotaAfterCheckin / grup bilgilerini saklar.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini ve sayıyı sorar, bunları hatırlar ve CLI'yi çalıştırır — üret, doğrula, çıkışları tara, ayarlar, yardım, 9Router'a Bağlan.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — kayıt açık, e-posta doğrulama açık, captcha kapalı, giriş açık |
| `POST /api/user/checkin` | **200** — bakiye 5.000'den 15k–104k'ya çıkar (asıl önemli olan kredi) |
| `Open ai 特价` içinde `POST /api/token/` (+ reveal) | **200** — anahtar materyali bir kez döner (kardeş gruplar boş token durumlarını yakalar) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — yazılmadan önce **her** anahtar için | gerçek içerikle **200** — **100/100 anahtar** |
| bağımsız yeniden kontrol (yeni çıkış, örnek) | **3/3** anahtar `GET /v1/models` 200 + tamamlama 200 |
| sohbet kontrolünde başarısız olan anahtar | asla yazılmaz — hesap `accounts.json` içinde kalır |

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
| durum | `GET /api/status` | kayıt/e-posta/giriş kapıları (captcha kapalı) |
| posta kutusu | Emailnator `POST /api/generate-email` | Mailtrap 300 gelen kutusu filo sınırına ulaştı; gmail her yerde çalışır |
| kod gönder | `GET /api/verification?email=…` | gelen kutusundan 6 karakterli kod |
| kayıt | `POST /api/user/register` | e-posta + kod + parola |
| giriş | `POST /api/user/login` | oturum token'ı |
| **giriş (check-in)** | `POST /api/user/checkin` | günlük bonus — panelin gerçek ücretsiz katmanı budur |
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

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | çıkış havuzu, her satırda bir proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | canlı doğrulama için model |

## 🛰️ Proxy arkasında

**Gerekli — doğrudan bağlantı yedeği yok.** Her istek bir çıkıştan geçer; panelde kayıt hız sınırına tabidir (yoğunlukta `register refused` — CLI bir sonraki çıkışla yeniden dener).

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | kullanıcı adı / e-posta / quotaStart / quotaAfterCheckin / grup |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `outputs/` | çalıştırma günlükleri — git tarafından yok sayılır |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi sunucunuzda barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Varsayılanlar: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Modeller `dimilinks/<model id>` olarak sunulur.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Sağlayıcının verdikleri | giriş kredisi: hesap başına **günde +18k…+98k birim** |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabında bir anahtar, `Open ai 特价` içinde oluşturulmuş, `gpt-6-sol` üzerinde sohbet doğrulamalı |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca `dimilinks.com` ve gelen kutusu arka ucunuzla iletişim kurulur |

## 🐞 Sorunlar

DimiLinks gruplarını, giriş ödülünü veya kayıt kapılarını değiştirirse araç orada durur ve bunu bildirir. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey katkıda bulunanlar

</div>