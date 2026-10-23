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

**Crea cuentas de DimiLinks en masa con claves API autogeneradas — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-35-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

DimiLinks es un panel de la familia New API donde el crédito de registro es **minúsculo (5.000 unidades ≈ $0,01)** y el dinero real está en el **check-in diario**: cuentas medidas **+18k…+98k unidades de cuota por día** (19 cuentas activas quedaron entre 15.307 y 103.660 tras su primer check-in). El panel ha **abandonado su grupo `default`** (`403 分组 default 已被弃用`) y sus canales funcionales viven en la familia **`Open ai 特价`** — que es exactamente donde esta herramienta crea la clave y donde la puerta en vivo ejecuta `gpt-6-sol`.

## 🎁 Nivel gratuito — cuánto obtienes

**El crédito es solo por check-in en este panel:** una cuenta nueva empieza con 5.000 unidades y el saldo crece con el check-in diario.

| Qué | Valor |
| --- | --- |
| Crédito de registro (`quotaStart`) | **5.000** unidades (qpu=500.000 → ≈ $0,01 — trata el crédito de registro como ruido) |
| **Check-in diario** | **+18.000 … +98.000 unidades/día** (medido en 19 cuentas: quotaAfter 15.307…103.660) |
| Grupo funcional | **`Open ai 特价`** (+ hermanos `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` responde `403 分组 default 已被弃用` |
| Catálogo | 35 entradas de modelos en la hoja de precios en vivo |
| Registro | correo electrónico + código de 6 caracteres — **sin captcha** (`turnstile_check: false`) |
| La unidad que escala | **una cuenta = una clave**, con check-in hecho una vez antes de conservar la clave |

> 💡 El nivel gratuito lo define DimiLinks y puede cambiar. Consulta los números en vivo en [dimilinks.com](https://dimilinks.com) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 35

El catálogo en vivo contiene **35 entradas de modelos**; la línea de clave verificada es `gpt-6-sol`, enrutada a través de la familia de grupos `Open ai 特价`:

| ID del modelo | Grupo | Verificado |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **cada clave, chat-200** durante la creación; reverificación independiente **3/3** (`GET /v1/models` + completion real) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Cómo usar la API

URL base **`https://dimilinks.com/v1`** — compatible con OpenAI.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

El grupo se vincula a la clave en el momento de la creación — una clave creada en `Open ai 特价` sirve los canales de ese grupo; los valores predeterminados de `--group`/`--alt-groups` del CLI son la familia funcional.

## 🛠 Inicio rápido

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Una clave se escribe en `keys.txt` **solo** después de que `/v1/chat/completions` responda 200 con contenido real; `accounts.json` conserva username / e-mail / quotaStart → quotaAfterCheckin / group.

### 🖱️ El lanzador

El lanzador pide la lista de proxies y la cantidad, las recuerda y ejecuta el CLI — crear, verificar, probar salidas, ajustes, ayuda, Connect to 9Router.

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET /api/status` | **200** — registro activo, verificación por correo activa, captcha desactivado, check-in activo |
| `POST /api/user/checkin` | **200** — el saldo pasa de 5.000 a 15k–104k (el crédito que importa) |
| `POST /api/token/` (+ reveal) en `Open ai 特价` | **200** — el material de la clave se devuelve una vez (los grupos hermanos capturan los intentos con token vacío) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — para **cada** clave antes de escribirse | **200** con contenido real — cada clave |
| reverificación independiente (salida nueva, muestra) | **3/3** claves `GET /v1/models` 200 + completion 200 |
| una clave que falla su comprobación de chat | nunca se escribe — la cuenta permanece en `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

> **Puertas de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se entregan). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación cuando quieras;
> los fallos se reportan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| status | `GET /api/status` | puertas de registro/correo/check-in (captcha desactivado) |
| mailbox | Emailnator `POST /api/generate-email` | Mailtrap alcanzó su límite de flota de 300 bandejas; gmail funciona en todas partes |
| send code | `GET /api/verification?email=…` | código de 6 caracteres desde la bandeja |
| register | `POST /api/user/register` | correo + código + contraseña |
| login | `POST /api/user/login` | token de sesión |
| **check-in** | `POST /api/user/checkin` | el bono diario — este es el nivel gratuito real del panel |
| key | `POST /api/token/` en `Open ai 特价` (fallback: pro siblings) | las respuestas vacías en el grupo principal pasan a los hermanos |
| proof | `POST /v1/chat/completions` `gpt-6-sol` | 200 con contenido = la clave está viva |

## ⚙️ Opciones del CLI

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Predeterminado | Significado |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | grupo de salidas, una línea por proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | modelo para la verificación en vivo |

## 🛰️ Detrás de un proxy

**Opcional — recomendado a escala (límites por IP, bloqueos).** La herramienta también funciona sin proxy.

- **Con un grupo:** pasa `--pool <file>` (o define `DIMILINKS_PROXIES`) y cada solicitud pasa por una salida de esa lista — una línea muerta hace fallar ese intento y la herramienta pasa a la siguiente (fail-closed mientras se proporciona un grupo; el grupo se vuelve a sondear al usarse).
- **Sin un grupo:** el CLI imprime `running WITHOUT a proxy (direct)` y se conecta directamente. Nada del registro, check-in, creación de claves o verificación cambia — solo desde dónde salen los paquetes.
- Ejecuta `--screen` en cualquiera de los dos modos: prueba las salidas que tengas (o la ruta directa) contra el proveedor antes de una ejecución real.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | tus salidas — ignorado por git |
| `outputs/` | registros de ejecución — ignorados por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Predeterminados: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Los modelos se sirven como `dimilinks/<model id>`.

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado compatible con OpenAI:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Predeterminados: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Los modelos se sirven como `dimilinks/<model id>`.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 Qué da el proveedor | crédito por check-in: **+18k…+98k unidades/día** por cuenta |
| 🔑 Qué te da una clave | una clave en su propia cuenta, creada en `Open ai 特价`, verificada por chat en `gpt-6-sol` |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con `dimilinks.com` y tu backend de bandeja de entrada |

## 🐞 Problemas

Si DimiLinks cambia sus grupos, la recompensa del check-in o las puertas de registro, la herramienta se detiene ahí y lo indica. **[Abre un issue](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>