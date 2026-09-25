**English | [简体中文](./README.md)**

# zhipu-switch · Zhipu Qingyan Multi-Account Credits Assistant (userscript)

> A browser userscript built for the **Zhipu Qingyan (chatglm.cn) 2026 Double-Festival event** (2026-09-25 ~ 10-07: automatic daily login bonus, streak multipliers, 100% spending rebate).
> Manage credits for multiple accounts right inside the chatglm.cn page: a balance panel, one-click check-in, one-click account switching, one-click account adding — **no more logging out and back in**.

## What it does

The Double-Festival event pays credits per account, but a browser can only hold one login at a time — switching accounts to claim on each one means endless logout/login/token-grabbing. This script turns all of it into a small floating panel at the bottom-right corner:

- **Automatic daily login bonus**: claims the daily event credits idempotently on page load (the page usually claims it itself; this is a safety net)
- **Multi-account pool**: stores login tokens for several accounts in browser localStorage, with balance and check-in results per account
- **Check in all**: one click iterates the whole pool through the daily login-bonus API (idempotent; already-claimed accounts are skipped)
- **One-click account switching**: click a pool entry to write its login state back and reload — like an account switcher, no logout needed
- **One-click account adding**: auto-snapshots the current account → guided guest state → you log in / register a new account → the script captures the new token, pools it, and **switches back to your original account** automatically
- **Collapsible panel**: collapses into a round icon; click to expand
- **Export pool file**: downloads the whole pool as JSON for local tools (e.g. a self-hosted relay)
- **Bilingual UI**: Chinese/English toggle in the panel title bar

## Installation

Four ways (the first two need a userscript manager; the last two don't):

**Option 1 · One-click install (needs Tampermonkey / ScriptCat)**

Install Tampermonkey or ScriptCat, then open this link — the manager pops up an install confirmation automatically:

👉 [Install zhipu-switch](https://raw.githubusercontent.com/apmengzi/zhipu-switch/main/zhipu-switch.user.js)

Future updates are checked from the same link automatically.

**Option 2 · ScriptCat store**

👉 [ScriptCat listing](https://scriptcat.org/en/script-show-page/8138) — open and click Install (with the ScriptCat extension).

**Option 3 · Load as an unpacked extension (no userscript manager needed)**

The `edge-ext/` folder in this repo is a packaged MV3 browser extension (same features as the script):

1. Download the `edge-ext` folder (`manifest.json`, `content.js`, `icons/`)
2. In Edge, open `edge://extensions` → enable **Developer mode** → **Load unpacked** → pick the `edge-ext` folder (Chrome: `chrome://extensions`, same steps)
3. Open chatglm.cn and you're live

> GreasyFork listing pending (new-account posting restriction); official Edge Add-ons store listing pending program registration.

**Option 4 · Manual paste**

Open the userscript manager dashboard → Create a new script → paste the contents of [`zhipu-switch.user.js`](./zhipu-switch.user.js) → save (Ctrl+S).

Then open [chatglm.cn](https://chatglm.cn/) and log in — the floating panel at the bottom-right means it's live.

## Using multiple accounts

- Click **Add account** → the page enters guest state (a toast guides you) → click the site's **Log-in** button and log in another account (or register one) → the script pools the new account automatically and switches back to your previous one
- Click **切 (Switch)** next to a pool entry to switch logins; **×** only removes the local record, the account itself is untouched

## How it works (brief)

- Login state = cookies `chatglm_token` (24h) + `chatglm_refresh_token` (~50 days); the site itself writes them via js-cookie (not HttpOnly), so writing cookies back = switching accounts
- The `X-Sign` header algorithm matches the site bundle (md5, module 55569 embedded verbatim)
- Guest accounts are detected precisely via the `is_guest` flag in the JWT payload, so they are never mistaken for real logins
- Each pool entry keeps its own device fingerprint (localStorage `chatglm-deid`), written back on switching/adding

## Safety & Privacy

- ⚠️ The account pool (tokens) is stored in **plain text** in browser localStorage and exported files — **never use on shared computers, never share exported files**
- The script only talks to chatglm.cn itself (check-in, balance, user/info); no third-party services
- No obfuscation, no remote code loading — audit it yourself

## Disclaimer

- A **personal-use** event-credits helper; it claims the "daily login bonus" idempotently as intended by the event. It contains no bulk registration, no captcha automation, no farming capabilities
- Follow the chatglm.cn terms of service; excessive or abnormal use may trigger platform risk control (HTTP 403) at your own responsibility
- Not affiliated with Zhipu AI; event rules are decided by the official side. If Zhipu considers this tool inappropriate, open an issue and it will be removed promptly

## License

MIT
