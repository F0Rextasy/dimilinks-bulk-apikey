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

**批量创建 DimiLinks 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-35%20served-412991?style=for-the-badge)](https://dimilinks.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-35-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

DimiLinks 是一个 New API 系列面板，其注册赠送额度**极少（5,000 单位 ≈ $0.01）**，真正的收益来自**每日签到**：账户实测**每天 +18k…+98k 额度单位**（19 个活跃账户首次签到后的额度落在 15,307 到 103,660 之间）。该面板**已弃用其 `default` 分组**（`403 分组 default 已被弃用`），其可用渠道位于 **`Open ai 特价`** 系列 —— 这正是本工具创建密钥的地方，也是实时验证运行 `gpt-6-sol` 的地方。

## 🎁 免费额度 — 你能获得多少

**该面板的额度仅靠签到获得：** 新账户初始为 5,000 单位，余额通过每日签到增长。

| 项目 | 数值 |
| --- | --- |
| 注册赠送额度（`quotaStart`） | **5,000** 单位（qpu=500,000 → ≈ $0.01 —— 把注册赠送当作噪音即可） |
| **每日签到** | **每天 +18,000 … +98,000 单位**（在 19 个账户上实测：quotaAfter 15,307…103,660） |
| 可用分组 | **`Open ai 特价`**（以及同类 `Open ai 特价 pro`、`Open ai 特价 pro 不降智`）—— `default` 返回 `403 分组 default 已被弃用` |
| 目录 | 实时价格表上有 35 个模型条目 |
| 注册 | 邮箱 + 6 位验证码 —— **无验证码**（`turnstile_check: false`） |
| 可扩展的单位 | **一个账户 = 一个密钥**，在保留密钥前先签到一次 |

> 💡 免费额度由 DimiLinks 设定，可能会变化。请在 [dimilinks.com](https://dimilinks.com) 查看实时数据 —— 并让工具自身的验证来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 35 个

实时目录包含 **35 个模型条目**；已验证的密钥线路是 `gpt-6-sol`，通过 `Open ai 特价` 分组系列路由：

| 模型 ID | 分组 | 已验证 |
| --- | --- | --- |
| `gpt-6-sol` | `Open ai 特价` | 铸造期间 **100/100 密钥 chat-200**；独立复检 **3/3**（`GET /v1/models` + 真实补全） |

```bash
curl https://dimilinks.com/v1/chat/completions \
  -H "Authorization: Bearer TbxdZM…" -H "Content-Type: application/json" \
  -d '{"model":"gpt-6-sol","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 如何使用 API

基础 URL **`https://dimilinks.com/v1`** —— 兼容 OpenAI。

```python
from openai import OpenAI
c = OpenAI(base_url="https://dimilinks.com/v1", api_key="TbxdZM…")
print(c.chat.completions.create(model="gpt-6-sol",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

分组在创建时即绑定到密钥 —— 在 `Open ai 特价` 中创建的密钥服务于该分组的渠道；CLI 的 `--group`/`--alt-groups` 默认使用可用系列。

## 🛠 快速开始

```bash
cd dimilinks-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt
node src/launcher.js        # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 30    (one account per key, check-in runs first)
```

只有当 `/v1/chat/completions` 返回 200 且带有真实内容后，密钥才会被写入 `keys.txt`；`accounts.json` 保存用户名 / 邮箱 / quotaStart → quotaAfterCheckin / 分组。

### 🖱️ 启动器

启动器会询问代理列表和数量，记住它们，并运行 CLI —— 铸造、验证、筛选出口、设置、帮助、连接到 9Router。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET /api/status` | **200** —— 注册开启、邮箱验证开启、验证码关闭、签到开启 |
| `POST /api/user/checkin` | **200** —— 余额从 5,000 变为 15k–104k（真正重要的额度） |
| 在 `Open ai 特价` 中 `POST /api/token/`（+ 揭示） | **200** —— 密钥材料仅返回一次（同类分组会接住空 token 的情况） |
| `POST /v1/chat/completions`（`gpt-6-sol`）—— 对**每个**密钥在写入前执行 | **200** 且带有真实内容 —— **100/100 密钥** |
| 独立复检（全新出口，抽样） | **3/3** 密钥 `GET /v1/models` 200 + 补全 200 |
| 未通过 chat 检查的密钥 | 永不写入 —— 账户保留在 `accounts.json` 中 |

```bash
node src/cli.js --verify-only
node src/cli.js --screen
```

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: DimiLinks page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://dimilinks.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| status | `GET /api/status` | 注册/邮箱/签到开关（验证码关闭） |
| mailbox | Emailnator `POST /api/generate-email` | Mailtrap 达到了 300 个收件箱的容量上限；gmail 在任何地方都可用 |
| send code | `GET /api/verification?email=…` | 从收件箱获取 6 位验证码 |
| register | `POST /api/user/register` | 邮箱 + 验证码 + 密码 |
| login | `POST /api/user/login` | 会话令牌 |
| **check-in** | `POST /api/user/checkin` | 每日奖励 —— 这是该面板真正的免费额度 |
| key | 在 `Open ai 特价` 中 `POST /api/token/`（回退：pro 同类分组） | 主分组返回空时会落到同类分组 |
| proof | `POST /v1/chat/completions` `gpt-6-sol` | 200 且带有内容 = 密钥可用 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N        # mint N keys (check-in + chat gate per account)
node src/cli.js --group "Open ai 特价" --alt-groups "Open ai 特价 pro,Open ai 特价 pro 不降智"
node src/cli.js --verify-only    # re-verify every key in keys.txt
node src/cli.js --screen         # exit pool self-test
node src/cli.js --connect-9router
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `DIMILINKS_PROXIES` | `proxies.txt` | 出口池，每行一个代理 |
| `DIMILINKS_MODEL` | `gpt-6-sol` | 用于实时验证的模型 |

## 🛰️ 使用代理

**必需 —— 无直连回退。** 每个请求都通过出口发出；面板对注册有速率限制（突发时出现 `register refused` —— CLI 会用下一个出口重试）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个实时验证的密钥 —— 已被 git 忽略 |
| `accounts.json` | 用户名 / 邮箱 / quotaStart / quotaAfterCheckin / 分组 |
| `proxies.txt` | 你的出口 —— 已被 git 忽略 |
| `outputs/` | 运行日志 —— 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

默认值：`--prefix dimilinks`、`--base-url https://dimilinks.com/v1`、`--model gpt-6-sol`。模型以 `dimilinks/<model id>` 形式提供。

## 🔑 一个密钥能给你带来什么

| | |
| --- | --- |
| 🏢 提供商 | **DimiLinks** —— [dimilinks.com](https://dimilinks.com) |
| 🎁 提供商提供什么 | 签到额度：每个账户**每天 +18k…+98k 单位** |
| 🔑 一个密钥能给你带来什么 | 一个密钥对应其独立账户，在 `Open ai 特价` 中创建，并在 `gpt-6-sol` 上通过 chat 验证 |
| 🌐 API 形式 | 兼容 OpenAI：`POST https://dimilinks.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 `dimilinks.com` 和你的收件箱后端 |

## 🐞 问题反馈

如果 DimiLinks 更改了其分组、签到奖励或注册开关，工具会在此停止并说明原因。请**[提交 issue](../../issues)**，附上命令和确切输出。

## 📄 许可证

MIT © 2026 —— 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 dimilinks-bulk-apikey contributors

</div>