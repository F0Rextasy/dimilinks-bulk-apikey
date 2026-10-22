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

**자동 생성된 API 키로 DimiLinks 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-35-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 왜 만들었나

DimiLinks는 New API 계열 패널로, 가입 크레딧은 **매우 작고 (5,000 단위 ≈ $0.01)**, 실제 수익은 **일일 출석 체크**에서 나옵니다: 계정당 **하루 +18k…+98k 할당량 단위**가 측정되었습니다 (활성 계정 19개가 첫 출석 체크 후 15,307에서 103,660 사이에 도달했습니다). 이 패널은 **`default` 그룹을 폐기했으며** (`403 分组 default 已被弃用`), 작동하는 채널은 **`Open ai 特价`** 계열에 있습니다 — 이 도구가 키를 생성하고 라이브 게이트가 `gpt-6-sol`을 실행하는 곳이 바로 여기입니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

**이 패널에서 크레딧은 출석 체크로만 얻습니다:** 새 계정은 5,000 단위로 시작하고 잔액은 일일 출석 체크로 늘어납니다.

| 항목 | 값 |
| --- | --- |
| 가입 크레딧 (`quotaStart`) | **5,000** 단위 (qpu=500,000 → ≈ $0.01 — 가입 크레딧은 무시하세요) |
| **일일 출석 체크** | **하루 +18,000 … +98,000 단위** (계정 19개에서 측정: quotaAfter 15,307…103,660) |
| 작동 그룹 | **`Open ai 特价`** (+ 형제 그룹 `Open ai 特价 pro`, `Open ai 特价 pro 不降智`) — `default`는 `403 分组 default 已被弃用` 응답 |
| 카탈로그 | 라이브 가격표에 35개 모델 항목 |
| 가입 | 이메일 + 6자리 코드 — **캡차 없음** (`turnstile_check: false`) |
| 확장되는 단위 | **계정 하나 = 키 하나**, 키를 보관하기 전에 한 번 출석 체크 |

> 💡 무료 티어는 DimiLinks가 정하며 변경될 수 있습니다. [dimilinks.com](https://dimilinks.com)에서 실시간 수치를 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 35개 전부

라이브 카탈로그에는 **35개 모델 항목**이 있습니다; 검증된 키 라인은 `gpt-6-sol`이며, `Open ai 特价` 그룹 계열을 통해 라우팅됩니다:

| 모델 ID | 그룹 | 검증됨 |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | 생성 중 **100/100 키 chat-200**; 독립 재확인 **3/3** (`GET /v1/models` + 실제 완성) |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API 사용 방법

Base URL **`https://dimilinks.com/v1`** — OpenAI 호환.

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

그룹은 생성 시점에 키에 바인딩됩니다 — `Open ai 特价`에서 만든 키는 해당 그룹의 채널을 제공합니다; CLI의 `--group`/`--alt-groups`는 기본적으로 작동하는 계열로 설정됩니다.

## 🛠 빠른 시작

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js        # interactive: mint / verify / screen / settings

# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

키는 `/v1/chat/completions`가 실제 콘텐츠와 함께 200을 응답한 **후에만** `keys.txt`에 기록됩니다; `accounts.json`은 username / e-mail / quotaStart → quotaAfterCheckin / group을 보관합니다.

### 🖱️ 런처

런처는 프록시 목록과 개수를 묻고, 이를 기억한 뒤 CLI를 실행합니다 — 생성, 검증, 출구 스크린, 설정, 도움말, 9Router 연결.

## ✅ 검증됨 — 모든 키가 테스트됩니다

| 검사 | 결과 |
| --- | --- |
| `GET /api/status` | **200** — 가입 켜짐, 이메일 인증 켜짐, 캡차 꺼짐, 출석 체크 켜짐 |
| `POST /api/user/checkin` | **200** — 잔액이 5,000에서 15k–104k로 이동 (중요한 크레딧) |
| `Open ai 特价`에서 `POST /api/token/` (+ 공개) | **200** — 키 자료가 한 번 반환됨 (형제 그룹이 빈 토큰 롤을 잡음) |
| `POST /v1/chat/completions` (`gpt-6-sol`) — 기록되기 전 **모든** 키에 대해 | 실제 콘텐츠와 함께 **200** — **100/100 키** |
| 독립 재확인 (새 출구, 샘플) | **3/3** 키 `GET /v1/models` 200 + 완성 200 |
| 채팅 검사에 실패한 키 | 기록되지 않음 — 계정은 `accounts.json`에 남음 |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 상태 | `GET /api/status` | 가입/이메일/출석 체크 게이트 (캡차 꺼짐) |
| 메일함 | Emailnator `POST /api/generate-email` | Mailtrap은 300개 inbox 플릿 한도에 도달; gmail은 어디서나 작동 |
| 코드 전송 | `GET /api/verification?email=…` | 메일함에서 온 6자리 코드 |
| 가입 | `POST /api/user/register` | 이메일 + 코드 + 비밀번호 |
| 로그인 | `POST /api/user/login` | 세션 토큰 |
| **출석 체크** | `POST /api/user/checkin` | 일일 보너스 — 이것이 패널의 실제 무료 티어 |
| 키 | `Open ai 特价`에서 `POST /api/token/` (대체: pro 형제) | 기본 그룹의 빈 반환은 형제로 넘어감 |
| 증명 | `POST /v1/chat/completions` `gpt-6-sol` | 콘텐츠와 함께 200 = 키가 라이브 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | 출구 풀, 프록시당 한 줄 |
| `DIMILINKS_MODEL` | `gpt-6-sol` | 라이브 검증에 사용할 모델 |

## 🛰️ 프록시 뒤에서

**선택 사항 — 대규모에서는 권장 (IP당 제한, 차단).** 이 도구는 프록시 없이도 작동합니다.

- **풀 사용 시:** `--pool <file>`을 전달하거나 (또는 `DIMILINKS_PROXIES` 설정) 모든 요청이 해당 목록의 출구를 통해 나갑니다 — 죽은 라인은 해당 시도를 실패시키고 도구는 다음으로 넘어갑니다 (풀이 제공되면 fail-closed; 풀은 사용 시 재탐색됩니다).
- **풀 없이:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다. 가입, 출석 체크, 키 생성 또는 검증에 대해 달라지는 것은 없습니다 — 패킷이 나가는 위치만 다릅니다.
- 어느 모드에서든 `--screen`을 실행하세요: 실제 실행 전에 보유한 출구 (또는 직접 경로)를 제공자에 대해 테스트합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 라이브 검증된 키가 한 줄에 하나씩 — git 무시됨 |
| `accounts.json` | username / e-mail / quotaStart / quotaAfterCheckin / group |
| `proxies.txt` | 출구 — git 무시됨 |
| `outputs/` | 실행 로그 — git 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

기본값: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. 모델은 `dimilinks/<model id>`로 제공됩니다.

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

기본값: `--prefix dimilinks`, `--base-url https://dimilinks.com/v1`, `--model gpt-6-sol`. 모델은 `dimilinks/<model id>`로 제공됩니다.
## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **DimiLinks** — [dimilinks.com](https://dimilinks.com) |
| 🎁 제공자가 주는 것 | 출석 체크 크레딧: 계정당 **하루 +18k…+98k 단위** |
| 🔑 키 하나로 얻는 것 | 자체 계정의 키 하나, `Open ai 特价`에서 생성, `gpt-6-sol`에서 채팅 검증됨 |
| 🌐 API 형태 | OpenAI 호환: `POST https://dimilinks.com/v1/chat/completions` |
| 🔒 데이터 | `dimilinks.com`과 메일함 백엔드만 접촉됨 |

## 🐞 이슈

DimiLinks가 그룹, 출석 체크 보상 또는 가입 게이트를 변경하면 도구는 그 지점에서 멈추고 그렇게 알립니다. 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>