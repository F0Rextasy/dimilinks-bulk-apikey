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

**Crie contas DimiLinks em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-35-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isso existe

DimiLinks é um painel da família New API onde o crédito de registro é **minúsculo (5.000 unidades ≈ US$ 0,01)** e o dinheiro de verdade está no **check-in diário**: contas mediram **+18k…+98k unidades de cota por dia** (19 contas ativas ficaram entre 15.307 e 103.660 após o primeiro check-in). O painel **abandonou seu grupo `default`** (`403 分组 default 已被弃用`) e seus canais funcionais vivem na família **`Open ai 特价`** — que é exatamente onde esta ferramenta cria a chave e onde o gate ativo executa `gpt-6-sol`.

## 🎁 Nível gratuito — quanto você recebe

**O crédito é somente via check-in neste painel:** uma conta nova começa com 5.000 unidades e o saldo cresce com o check-in diário.

| O quê | Valor |
| --- | --- |
| Crédito de registro (`quotaStart`) | **5.000** unidades (qpu=500.000 → ≈ US$ 0,01 — trate o crédito de cadastro como irrelevante) |
| **Check-in diário** | **+18.000 … +98.000 unidades/dia** (medido em 19 contas: quotaAfter 15.307…103.660) |
| Grupo funcional | **`Open ai 特价`** (+ irmãos `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default` responde `403 分组 default 已被弃用` |
| Catálogo | 35 entradas de modelos na tabela de preços ativa |
| Cadastro | e-mail + código de 6 caracteres — **sem captcha** (`turnstile_check: false`) |
| A unidade que escala | **uma conta = uma chave**, com check-in feito uma vez antes de a chave ser mantida |

> 💡 O nível gratuito é definido pela DimiLinks e pode mudar. Confira os números ativos em [dimilinks.com](https://dimilinks.com) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 35

O catálogo ativo contém **35 entradas de modelos**; a linha de chave verificada é `gpt-6-sol`, roteada pela família de grupos `Open ai 特价`:

| ID do modelo | Grupo | Verificado |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | **100/100 chaves chat-200** durante a criação; reverificação independente **3/3** (`GET /v1/models` + conclusão real) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Como usar a API

URL base **`https://dimilinks.com/v1`** — compatível com OpenAI.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

O grupo é vinculado à chave no momento da criação — uma chave criada em `Open ai 特价` atende os canais desse grupo; os padrões `--group`/`--alt-groups` da CLI usam a família funcional.

## 🛠 Início rápido

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

Uma chave é gravada em `keys.txt` **somente** depois que `/v1/chat/completions` responde 200 com conteúdo real; `accounts.json` mantém username / e-mail / quotaStart → quotaAfterCheckin / group.

### 🖱️ O launcher

O launcher pede a lista de proxies e a quantidade, memoriza-os e executa a CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verificado e funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET /api/status` | **200** — registro ativo, verificação por e-mail ativa, captcha desativado, check-in ativo |
| `POST /api/user/checkin` | **200** — saldo passa de 5.000 para 15k–104k (o crédito que importa) |
| `POST /api/token/` (+ reveal) em `Open ai 特价` | **200** — material da chave retornado uma vez (grupos irmãos capturam os retornos de token vazio) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — para **toda** chave antes de ser gravada | **200** com conteúdo real — **100/100 chaves** |
| reverificação independente (saída nova, amostra) | **3/3** chaves `GET /v1/models` 200 + conclusão 200 |
| uma chave que falha na verificação de chat | nunca gravada — a conta permanece em `accounts.json` |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- | --- |
| status | `GET /api/status` | gates de registro/e-mail/check-in (captcha desativado) |
| caixa de correio | Emailnator `POST /api/generate-email` | Mailtrap atingiu seu limite de 300 caixas; gmail funciona em todos os lugares |
| enviar código | `GET /api/verification?email=…` | código de 6 caracteres da caixa de entrada |
| registrar | `POST /api/user/register` | e-mail + código + senha |
| login | `POST /api/user/login` | token de sessão |
| **check-in** | `POST /api/user/checkin` | o bônus diário — este é o nível gratuito real do painel |
| chave | `POST /api/token/` em `Open ai 特价` (fallback: irmãos pro) | retornos vazios no grupo primário caem para os irmãos |
| prova | `POST /v1/chat/completions` `gpt-6-sol` | 200 com conteúdo = a chave está ativa |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| Env | Padrão | Significado |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | pool de saídas, uma linha por proxy |
| `DIMILINKS_MODEL` | `gpt-6-sol` | modelo para a verificação ativa |

## 🛰️ Atrás de um proxy

**Opcional — recomendado em escala (limites por IP, banimentos).** A ferramenta funciona sem proxy também.

- **Com um pool:** passe `--pool <file>` (ou defina `DIMILINKS_PROXIES`) e toda requisição passa por uma saída dessa lista — uma linha morta falha naquela tentativa e a ferramenta passa para a próxima (fail-closed enquanto um pool é fornecido; o pool é re-testado no uso).
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)` e conecta diretamente. Nada sobre cadastro, check-in, criação de chave ou verificação muda — apenas de onde os pacotes saem.
- Execute `--screen` em qualquer um dos modos: ele testa as saídas que você tem (ou a rota direta) contra o provedor antes de uma execução real.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada em produção por linha — ignorado pelo git |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `outputs/` | logs de execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Padrões: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. Os modelos são servidos como `dimilinks/<model id>`.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 O que o provedor dá | crédito de check-in: **+18k…+98k unidades/dia** por conta |
| 🔑 O que uma chave oferece | uma chave em sua própria conta, criada em `Open ai 特价`, verificada por chat em `gpt-6-sol` |
| 🌐 Formato da API | compatível com OpenAI: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 Seus dados | apenas `dimilinks.com` e seu backend de caixa de entrada são contatados |

## 🐞 Problemas

Se a DimiLinks mudar seus grupos, a recompensa de check-in ou os gates de registro, a ferramenta para ali e avisa. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>