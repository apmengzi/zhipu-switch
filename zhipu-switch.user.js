// ==UserScript==
// @name         zhipu-switch · 智谱清言多账号积分助手
// @name:en      zhipu-switch - Zhipu Qingyan multi-account credits assistant
// @description:en  Multi-account credits assistant for Zhipu Qingyan (chatglm.cn): balance panel, account pool, one-click account switching & adding, daily bonus check-in. Bilingual UI.
// @namespace    zsw
// @version      0.3.3
// @description  智谱清言双节活动多账号助手:余额悬浮窗(可收起圆图标)、多账号池、一键切换/添加账号、自动签到、中英双语 | Zhipu Qingyan multi-account credits assistant (bilingual UI)
// @author       apmengzi
// @license      MIT
// @match        https://chatglm.cn/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* 全局: window.__zsw */
(function () {
  "use strict";
  if (window.__zsw) return;
  const POOL_KEY = "zsw_pool_v1";
  const ADDING_KEY = "zsw_adding";
  const COLLAPSED_KEY = "zsw_collapsed";
  // 智谱清言官方图标（提取自桌面端 exe 内嵌 256px 图标的 64px 帧）
  const LOGO_URL = "data:image/png;base64," +
    "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";

  /* ---------- md5（RFC 1321 可读实现。此前内嵌站点 bundle 的压缩版 md5 被
       GreasyFork 判定为压缩代码而禁止发布,故重写:K 常量按 sin 公式生成而非手抄,
       输出经 node 对拍 abc/你好/长串与 crypto 一致。仅用于 X-Sign,输入为 ASCII） ---------- */
  function hex_md5(input) {
    const s = unescape(encodeURIComponent(input)); // UTF-8 预处理
    const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    const K = [];
    for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);

    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

    // 填充:尾部 0x80,补零至 mod 64 == 56,末 8 字节小端位长度
    const len = s.length;
    const words = [];
    for (let i = 0; i < len; i++)
      words[i >> 2] = (words[i >> 2] || 0) | (s.charCodeAt(i) << ((i % 4) * 8));
    words[len >> 2] = (words[len >> 2] || 0) | (0x80 << ((len % 4) * 8));
    const total = (((len + 8) >> 6) + 1) * 16;
    for (let i = 0; i < total; i++) words[i] = words[i] || 0;
    words[total - 2] = (len * 8) & 0xffffffff;
    words[total - 1] = Math.floor(len / 536870912);

    for (let c = 0; c < total; c += 16) {
      const M = words.slice(c, c + 16);
      let A = a0, B = b0, C = c0, D = d0;
      for (let i = 0; i < 64; i++) {
        const r = i >> 4;
        let F, g;
        if (r === 0)      { F = (B & C) | (~B & D); g = i; }
        else if (r === 1) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (r === 2) { F = B ^ C ^ D;          g = (3 * i + 5) % 16; }
        else              { F = C ^ (B | ~D);       g = (7 * i) % 16; }
        F = (F + A + K[i] + M[g]) | 0;
        A = D; D = C; C = B;
        const sh = S[(r * 4) + (i % 4)];
        B = (B + ((F << sh) | (F >>> (32 - sh)))) | 0;
      }
      a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
    }

    return [a0, b0, c0, d0].map((n) => {
      let h = "";
      for (let j = 0; j < 4; j++)
        h += ((n >> (j * 8 + 4)) & 0xf).toString(16) + ((n >> (j * 8)) & 0xf).toString(16);
      return h;
    }).join("");
  }

  /* ---------- 签名（与 zsw_lib.py 同逻辑，2026-09-25 实测 MATCH） ---------- */
  function signHeaders(deviceId, token) {
    const a = String(Date.now()), e = a.length;
    let sum = 0;
    for (const ch of a) sum += Number(ch);
    const mangled = a.slice(0, e - 2) + ((sum - Number(a[e - 2])) % 10) + a.slice(e - 1);
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const h = {
      "App-Name": "chatglm",
      "X-App-Platform": "pc",
      "X-App-Version": "0.0.1",
      "X-Device-Id": deviceId,
      "X-Lang": "zh",
      "X-Request-Id": crypto.randomUUID(),
      "X-Timestamp": mangled,
      "X-Nonce": nonce,
      "X-Sign": hex_md5(`${mangled}-${nonce}-8a1317a7468aa3ad86e997d08f3f31cb`),
    };
    if (token) h["Authorization"] = "Bearer " + token;
    return h;
  }

  /* ---------- cookie 工具（站点用 js-cookie 默认参数：host-only、path=/） ---------- */
  function readCookie(name) {
    const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }
  function setCookie(name, v, days) {
    document.cookie = `${name}=${encodeURIComponent(v)}; path=/; max-age=${days * 86400}`;
  }
  function clearCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
    document.cookie = `${name}=; path=/; max-age=0; domain=.chatglm.cn`;
  }

  /* ---------- 页面请求头嗅探：拿当前登录态的 token 与 device_id ---------- */
  const captured = { token: null, deviceId: null };
  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
    try {
      const kl = String(k).toLowerCase();
      if (kl === "authorization" && !captured.token && String(v).startsWith("Bearer "))
        captured.token = String(v).slice(7);
      if (kl === "x-device-id" && !captured.deviceId) captured.deviceId = String(v);
    } catch {}
    return origSetHeader.call(this, k, v);
  };
  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      const h = (init && init.headers) || (input instanceof Request && input.headers);
      if (h) {
        const get = (n) => (h.get ? h.get(n) : (h[n] || h[n.toLowerCase?.()] || null));
        const auth = get("Authorization") || get("authorization");
        const did = get("X-Device-Id") || get("x-device-id");
        if (auth && !captured.token && String(auth).startsWith("Bearer ")) captured.token = String(auth).slice(7);
        if (did && !captured.deviceId) captured.deviceId = String(did);
      }
    } catch {}
    return origFetch.apply(this, arguments);
  };

  /* ---------- cookie 写入 hook：捕获登录成功瞬间的新 token（添加账号的核心） ---------- */
  // 访客识别（2026-09-26 实测对拍）：未登录时页面会自动静默创建访客账号并写 cookie，
  // 访客 JWT payload 带 is_guest:true，真用户 token 无此字段 → 命中即忽略，继续等真登录
  function parseJwtPayload(tok) {
    try {
      const p = JSON.parse(atob(tok.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return p && typeof p === "object" ? p : null;
    } catch { return null; }
  }
  function jwtUid(tok) { const p = parseJwtPayload(tok); return p ? (p.uid || p.sub || "") : ""; }
  function jwtDeviceId(tok) { const p = parseJwtPayload(tok); return p ? (p.device_id || "") : ""; }
  function jwtExp(tok) { const p = parseJwtPayload(tok); return p ? (p.exp || 0) : 0; }
  function onNewLoginToken(tok) {
    captured.token = tok;
    if (!tok || tok.split(".").length < 3) return; // 清 cookie 时的空值等垃圾写入
    if (onNewLoginToken._lastTok === tok) return;
    onNewLoginToken._lastTok = tok;
    const flag = (() => { try { return JSON.parse(localStorage.getItem(ADDING_KEY) || "null"); } catch { return null; } })();
    if (!flag) {
      // 前台账号被站方自动续期/重登(非添加流程):按 uid 回写池,池内 token 常青
      const hit = findPoolByUid(jwtUid(tok));
      if (hit) {
        hit.access = tok;
        hit.refresh = readCookie("chatglm_refresh_token") || hit.refresh;
        hit.token_expires = readCookie("chatglm_token_expires") || hit.token_expires;
        hit.device_id = localStorage.getItem("chatglm-deid") || hit.device_id;
        pool.upsert(hit);
      }
      return;
    }
    if (Date.now() - flag.at > 10 * 60 * 1000) { localStorage.removeItem(ADDING_KEY); render(); return; }
    const jwt = parseJwtPayload(tok);
    if (jwt && jwt.is_guest) {
      toast(t("guestReady"));
      return; // 保留 zsw_adding，等真登录
    }
    if (onNewLoginToken._busy) return;
    onNewLoginToken._busy = true;
    setTimeout(async () => {
      localStorage.removeItem(ADDING_KEY);
      render();
      const refresh = readCookie("chatglm_refresh_token");
      const expires = readCookie("chatglm_token_expires");
      const did = localStorage.getItem("chatglm-deid") || "";
      const j = await apiCall(did, tok, "GET", "/user-api/user/info").catch(() => null);
      const info = j && j.status === 0 ? j.result || {} : {};
      const name = info.nickname || "acc" + (Object.keys(pool.all()).length + 1);
      pool.upsert({
        name, access: tok, refresh, token_expires: expires, device_id: did,
        user_id: info._id || "", balance: info.member_info?.left_score ?? null,
        last_result: "", added_at: Date.now(),
      });
      toast(t("added", name, flag.prev && flag.prev.name));
      if (flag.prev && pool.all()[flag.prev.name]) {
        setTimeout(() => switchTo(flag.prev.name), 900);
      } else {
        setTimeout(() => location.reload(), 900);
      }
    }, 2500);
  }
  try {
    const d = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    Object.defineProperty(document, "cookie", {
      get() { return d.get.call(document); },
      set(v) {
        d.set.call(document, v);
        try {
          const m = /^\s*chatglm_token=([^;]+)/.exec(String(v));
          if (m && m[1]) onNewLoginToken(decodeURIComponent(m[1]));
        } catch {}
      },
      configurable: true,
    });
  } catch {}

  /* ---------- API（页面同源，相对路径即可） ---------- */
  async function apiCall(deviceId, token, method, path, body) {
    const h = signHeaders(deviceId || captured.deviceId || "", token);
    if (body !== undefined) h["Content-Type"] = "application/json;charset=utf-8";
    const r = await fetch("/chatglm" + path, {
      method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401) return { status: 401 };
    if (r.status === 403) return { status: 403 };
    return await r.json();
  }
  const accInfo = (acc) => apiCall(acc.device_id, acc.access, "GET", "/user-api/user/info");
  const accCheckin = (acc) => apiCall(acc.device_id, acc.access, "POST", "/member-api/member/daily_login_score", {});

  /* refresh 自愈链:池内账号 access(24h)过期时用其 refresh(约 50 天)续期并写回池。
     设备指纹以 token JWT 绑定的为准(实测:账号文件字段可能不准);轮换时返回新 refresh 一并保存 */
  async function tryRefreshAcc(acc) {
    if (!acc.refresh) return false;
    const did = jwtDeviceId(acc.access) || acc.device_id || "";
    const h = signHeaders(did, "");
    h["Content-Type"] = "application/json;charset=utf-8";
    for (const auth of [acc.refresh, "Bearer " + acc.refresh]) {
      try {
        const r = await fetch("/chatglm/user-api/user/refresh", {
          method: "POST", headers: Object.assign({}, h, { Authorization: auth }), body: "{}",
        });
        if (r.status !== 200) continue;
        const j = await r.json();
        const res = j.result || {};
        const na = res.access_token || res.token;
        if (na) {
          acc.access = na;
          acc.refresh = res.refresh_token || acc.refresh;
          pool.upsert(acc);
          return true;
        }
      } catch {}
    }
    return false;
  }
  /* 按 uid 找池内账号(前台自愈/回写用) */
  function findPoolByUid(uid) {
    if (!uid) return null;
    return Object.values(pool.all()).find((a) => a.user_id === uid) || null;
  }
  /* 静默刷新某账号余额并回写池(签到成功/自愈后调用,修复"已领却显示旧余额") */
  async function refreshBalFor(acc) {
    let j = await accInfo(acc);
    if (j.status === 401 && (await tryRefreshAcc(acc))) j = await accInfo(acc);
    if (j.status === 0) {
      const p = pool.all();
      if (p[acc.name]) {
        p[acc.name].balance = j.result.member_info?.left_score ?? p[acc.name].balance;
        pool.save(p);
        render();
      }
    }
  }

  /* ---------- token 池（localStorage 明文，仅自用机器） ---------- */
  const pool = {
    all: () => { try { return JSON.parse(localStorage.getItem(POOL_KEY) || "{}"); } catch { return {}; } },
    save: (p) => localStorage.setItem(POOL_KEY, JSON.stringify(p)),
    upsert: (acc) => { const p = pool.all(); p[acc.name] = acc; pool.save(p); },
    remove: (name) => { const p = pool.all(); delete p[name]; pool.save(p); },
  };

  /* ---------- i18n(中/英;悬浮窗标题栏按钮切换,偏好存 zsw_lang,默认跟随浏览器) ---------- */
  const I18N = {
    zh: {
      add: "添加账号", checkin: "全部签到", refresh: "刷余额", export1: "导出",
      export1Title: "手动导出当前登录态（添加账号会自动做）",
      exportPool: "导出池文件", exportPoolTitle: "把整个账号池下载为 JSON 文件（可放入 zhipu-relay 的账号目录）",
      cancelAdd: "取消添加", collapseTitle: "收起为圆图标", langTitle: "切换到 English",
      loading: "当前登录：加载中…",
      curBal: (bal, st) => `当前登录：<b>${esc(bal)}分</b> · ${st}`,
      gotToday: "今日刚领✅", already: "今日已领", noLogin: "未登录/登录态过期",
      emptyPool: "池为空：点「添加账号」登录新号，自动入池",
      guestReady: "访客态已就绪：请点页面右上角【登录】按钮登录新账号；放弃请点悬浮窗「取消添加」",
      added: (n, prev) => `新号「${n}」已入池${prev && pool.all()[prev] ? "，正在切回 " + prev : ""}`,
      cancelOk: "已取消添加，当前登录态不受影响",
      poolDownloaded: "账号池已下载；⚠️ JSON 内含明文 token，勿外传",
      poolEmpty: "zsw: 池为空",
      noToken: "zsw: 未捕获到登录 token（未登录？）",
      badToken: (s) => `zsw: token 无效(${s})`,
      poolName: "存入池的名称：",
      delConfirm: "从池中删除该账号？（仅删本地记录，不影响账号本身）",
      guestWarn: (s) => `当前登录态校验失败(${s})。\n继续将丢失当前登录（可稍后从池中切回）。继续？`,
      renewing: (n) => `正在为「${n}」续期 token…`, refreshFail: "token过期(refresh失败)",
      langBtn: "EN",
    },
    en: {
      add: "Add account", checkin: "Check in all", refresh: "Refresh", export1: "Export",
      export1Title: "Export current login state manually (adding does it automatically)",
      exportPool: "Export pool file", exportPoolTitle: "Download the whole account pool as JSON (for zhipu-relay)",
      cancelAdd: "Cancel adding", collapseTitle: "Collapse to round icon", langTitle: "切换到中文",
      loading: "Current login: loading…",
      curBal: (bal, st) => `Current login: <b>${esc(bal)} pts</b> · ${st}`,
      gotToday: "Got today ✅", already: "Already claimed", noLogin: "Not logged in / expired",
      emptyPool: "Pool is empty: click \"Add account\" and log in a new account — it gets pooled automatically",
      guestReady: "Guest state ready: click the site's Log-in button (top-right) to log in a new account; give up via \"Cancel adding\" in the panel",
      added: (n, prev) => `New account "${n}" pooled${prev && pool.all()[prev] ? ", switching back to " + prev : ""}`,
      cancelOk: "Adding cancelled; current login untouched",
      poolDownloaded: "Pool downloaded; ⚠️ the JSON contains plain-text tokens, do not share it",
      poolEmpty: "zsw: pool is empty",
      noToken: "zsw: no login token captured (not logged in?)",
      badToken: (s) => `zsw: token invalid (${s})`,
      poolName: "Name for the pool:",
      delConfirm: "Remove this account from the pool? (local record only; the account itself is unaffected)",
      guestWarn: (s) => `Current login check failed (${s}).\nContinuing will lose the current login (you can switch back from the pool later). Continue?`,
      renewing: (n) => `Renewing token for "${n}"…`, refreshFail: "token expired (refresh failed)",
      langBtn: "中",
    },
  };
  let LANG = localStorage.getItem("zsw_lang") || (/^zh/i.test(navigator.language || "") ? "zh" : "en");
  const t = (k, ...a) => {
    const v = (I18N[LANG] || I18N.zh)[k];
    const d = I18N.zh[k];
    if (v === undefined) return typeof d === "function" ? d(...a) : d;
    return typeof v === "function" ? v(...a) : v;
  };

  /* ---------- 悬浮窗（可收起为圆图标） ---------- */
  let panel, bubble;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function ensureBubble() {
    if (bubble) return bubble;
    bubble = document.createElement("div");
    bubble.id = "zsw-bubble";
    bubble.title = "zhipu-switch";
    bubble.style.cssText = `position:fixed;right:16px;bottom:16px;z-index:99999;width:46px;height:46px;
      border-radius:50%;background:center/cover no-repeat url("${LOGO_URL}");
      box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer;display:none`;
    bubble.onclick = () => { localStorage.setItem(COLLAPSED_KEY, "0"); bubble.style.display = "none"; panel.style.display = ""; render(); };
    document.documentElement.appendChild(bubble);
    return bubble;
  }
  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "zsw-panel";
    panel.style.cssText = `position:fixed;right:16px;bottom:16px;z-index:99999;background:#1e2430;
      color:#d8dee9;font:12px/1.6 system-ui,sans-serif;border-radius:10px;padding:10px 12px;
      box-shadow:0 4px 16px rgba(0,0,0,.35);min-width:250px;max-width:340px`;
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:default">
        <b style="color:#7ec3ff">zhipu-switch</b>
        <span><span id="zsw-lang" title="${t("langTitle")}" style="cursor:pointer;opacity:.7;margin-right:10px">${t("langBtn")}</span>
        <span id="zsw-toggle" title="${t("collapseTitle")}" style="cursor:pointer;opacity:.7">—</span></span></div>
      <div id="zsw-body"></div>`;
    document.documentElement.appendChild(panel);
    panel.querySelector("#zsw-toggle").onclick = () => {
      localStorage.setItem(COLLAPSED_KEY, "1");
      panel.style.display = "none";
      ensureBubble().style.display = "";
    };
    panel.querySelector("#zsw-lang").onclick = () => {
      LANG = LANG === "zh" ? "en" : "zh";
      localStorage.setItem("zsw_lang", LANG);
      location.reload();
    };
    return panel;
  }

  function render() {
    if (localStorage.getItem(COLLAPSED_KEY) === "1") {
      ensurePanel().style.display = "none";
      ensureBubble().style.display = "";
    } else if (panel) {
      panel.style.display = "";
    }
    const body = ensurePanel().querySelector("#zsw-body");
    const p = pool.all();
    const curTok = readCookie("chatglm_token");
    const rows = Object.values(p).map((a) => {
      const isCur = curTok && a.access && curTok === a.access;
      return `<div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
        <span title="${esc(a.user_id || "")}">${isCur ? "●" : ""}${esc(a.name)} · ${esc(a.balance ?? "?")}分</span>
        <span style="opacity:.85">${esc(a.last_result || "")}</span>
        <span style="white-space:nowrap">
          <span data-sw="${esc(a.name)}" style="cursor:pointer;color:#7ec3ff;${isCur ? "opacity:.35" : ""}">切</span>
          <span data-del="${esc(a.name)}" style="cursor:pointer;color:#e06c75">×</span></span></div>`;
    }).join("");
    body.innerHTML = `
      <div id="zsw-main">${t("loading")}</div>
      <div style="margin:4px 0">
        <button data-act="add" style="font-size:12px">${t("add")}</button>
        ${localStorage.getItem(ADDING_KEY) ? `<button data-act="cancel-add" style="font-size:12px;color:#e5c07b">${t("cancelAdd")}</button>` : ""}
        <button data-act="checkin-all" style="font-size:12px">${t("checkin")}</button>
        <button data-act="refresh-bal" style="font-size:12px">${t("refresh")}</button>
        <button data-act="export" title="${t("export1Title")}" style="font-size:12px">${t("export1")}</button>
        <button data-act="export-file" title="${t("exportPoolTitle")}" style="font-size:12px">${t("exportPool")}</button></div>
      <div>${rows || `<span style="opacity:.5">${t("emptyPool")}</span>`}</div>`;
  }
  function setResult(name, text) {
    const p = pool.all();
    if (p[name]) { p[name].last_result = text; pool.save(p); }
    render();
  }
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:100000;
      background:#1e2430;color:#d8dee9;font:13px system-ui;padding:8px 16px;border-radius:8px;
      box-shadow:0 4px 16px rgba(0,0,0,.35)`;
    document.documentElement.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  /* ---------- 动作 ---------- */
  async function currentAccount() {
    for (let i = 0; i < 40 && !captured.token; i++)
      await new Promise((r) => setTimeout(r, 250));
    let token = captured.token || readCookie("chatglm_token");
    if (!token) return null;
    return { access: token, device_id: captured.deviceId || localStorage.getItem("chatglm-deid") || "" };
  }

  function autoName(info) {
    return (info && info.nickname) || "acc" + (Object.keys(pool.all()).length + 1);
  }

  async function exportCurrent() {
    const acc = await currentAccount();
    if (!acc) return alert(t("noToken"));
    const j = await accInfo(acc);
    if (j.status === 401 || j.status === 403) return alert(t("badToken", j.status));
    const info = j.result || {};
    const name = prompt(t("poolName"), autoName(info));
    if (!name) return;
    pool.upsert({
      name, access: acc.access, refresh: readCookie("chatglm_refresh_token"),
      token_expires: readCookie("chatglm_token_expires"), device_id: acc.device_id,
      user_id: info._id || "", balance: info.member_info?.left_score ?? null,
      last_result: "", added_at: Date.now(),
    });
    render();
  }

  /* 切换账号：先给过期/临期 token 续期,再写回 cookie + 设备指纹 + 刷新(等效 Z-SWITCH) */
  async function switchTo(name) {
    const acc = pool.all()[name];
    if (!acc) return;
    const expMs = jwtExp(acc.access) * 1000;
    if (!expMs || expMs - Date.now() < 10 * 60 * 1000) {
      toast(t("renewing", name));
      await tryRefreshAcc(acc);
    }
    setCookie("chatglm_token", acc.access, 30);
    if (acc.refresh) setCookie("chatglm_refresh_token", acc.refresh, 180);
    if (acc.token_expires) setCookie("chatglm_token_expires", acc.token_expires, 30);
    try {
      if (acc.device_id && /^[a-f0-9]{32}$/i.test(acc.device_id)) localStorage.setItem("chatglm-deid", acc.device_id);
      if (acc.user_id) localStorage.setItem("chatglm_user_id", acc.user_id);
    } catch {}
    location.reload();
  }

  /* 添加账号：快照当前号 → 换新设备指纹 → 清 cookie 引导登录 → hook 自动入池并切回 */
  async function addAccount() {
    const cur = await currentAccount();
    let prevName = null;
    if (cur) {
      const j = await accInfo(cur).catch(() => null);
      if (j && j.status === 0) {
        const info = j.result || {};
        prevName = autoName(info);
        pool.upsert({
          name: prevName, access: cur.access, refresh: readCookie("chatglm_refresh_token"),
          token_expires: readCookie("chatglm_token_expires"), device_id: cur.device_id,
          user_id: info._id || "", balance: info.member_info?.left_score ?? null,
          last_result: "", added_at: Date.now(),
        });
      } else if (!confirm(t("guestWarn", j && j.status))) return;
    }
    // 每个新号配独立设备指纹（登录前写入，页面请求即用新 deid）
    localStorage.setItem("chatglm-deid", crypto.randomUUID().replace(/-/g, ""));
    localStorage.setItem(ADDING_KEY, JSON.stringify({ prev: prevName ? { name: prevName } : null, at: Date.now() }));
    clearCookie("chatglm_token");
    clearCookie("chatglm_refresh_token");
    clearCookie("chatglm_token_expires");
    location.href = location.origin + "/";
  }

  /* 导出整个池为 JSON 文件(供 zhipu-relay 等本地工具导入) */
  function exportPoolFile() {
    const p = pool.all();
    if (!Object.keys(p).length) return alert(t("poolEmpty"));
    const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const d = new Date();
    a.download = `zsw-pool-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    toast(t("poolDownloaded"));
  }

  async function checkinOne(acc, retried) {
    let j = await accCheckin(acc);
    if (j.status === 401 && !retried && (await tryRefreshAcc(acc))) return checkinOne(acc, true);
    if (j.status === 0) { setResult(acc.name, "✅+" + ((j.result || {}).score ?? "?")); refreshBalFor(acc); return true; }
    if (j.status === 10001) { setResult(acc.name, "已领"); refreshBalFor(acc); return true; }
    if (j.status === 401) { setResult(acc.name, t("refreshFail")); return false; }
    if (j.status === 403) { setResult(acc.name, "⚠️403风控"); return false; }
    setResult(acc.name, "status" + j.status + ":" + (j.message || "").slice(0, 12));
    return false;
  }

  async function checkinAll() {
    for (const acc of Object.values(pool.all())) await checkinOne(acc);
  }

  async function refreshBalances() {
    for (const acc of Object.values(pool.all())) {
      let j = await accInfo(acc);
      if (j.status === 401 && (await tryRefreshAcc(acc))) j = await accInfo(acc);
      const p = pool.all();
      if (j.status === 0) {
        p[acc.name].balance = j.result.member_info?.left_score;
        p[acc.name].last_result = "";
      } else if (p[acc.name]) {
        p[acc.name].last_result = j.status === 401 ? t("refreshFail") : "HTTP" + j.status;
      }
      pool.save(p);
    }
    render();
  }

  async function autoDaily() {
    // 当前登录账号的每日赠分（幂等；页面通常已自发，此处兜底）
    const acc = await currentAccount();
    if (!acc) return;
    const j = await accCheckin(acc);
    const main = ensurePanel().querySelector("#zsw-main");
    const info = await accInfo(acc).catch(() => null);
    const bal = info && info.status === 0 ? (info.result.member_info?.left_score ?? "?") : "?";
    const st = j.status === 0 ? t("gotToday") : j.status === 10001 ? t("already") : j.status === 401 ? t("noLogin") : "status " + j.status;
    main.innerHTML = t("curBal", bal, st);
    // 回写池:前台号的最新 access/deid/余额同步进池(池内余额不再陈旧)
    const hit = findPoolByUid(jwtUid(acc.access));
    if (hit) {
      hit.access = acc.access;
      hit.device_id = acc.device_id || hit.device_id;
      if (bal !== "?") hit.balance = bal;
      pool.upsert(hit);
    }
  }

  /* ---------- 启动 ---------- */
  const boot = () => {
    render();
    panel = ensurePanel();
    panel.addEventListener("click", (e) => {
      const act = e.target.dataset && e.target.dataset.act;
      const del = e.target.dataset && e.target.dataset.del;
      const sw = e.target.dataset && e.target.dataset.sw;
      if (act === "add") addAccount();
      else if (act === "cancel-add") { localStorage.removeItem(ADDING_KEY); toast(t("cancelOk")); render(); }
      else if (act === "export-file") exportPoolFile();
      else if (act === "export") exportCurrent();
      else if (act === "checkin-all") checkinAll();
      else if (act === "refresh-bal") refreshBalances();
      else if (sw) switchTo(sw);
      else if (del) { if (confirm(t("delConfirm"))) { pool.remove(del); render(); } }
    });
    autoDaily();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);

  window.__zsw = { pool, signHeaders, hex_md5, captured, apiCall, switchTo, readCookie, tryRefreshAcc };
})();
