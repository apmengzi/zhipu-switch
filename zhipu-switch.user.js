// ==UserScript==
// @name         zhipu-switch · 智谱清言多账号积分助手
// @namespace    zsw
// @version      0.3.0
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
  const LOGO_URL = "data:image/png;base64,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";

  /* ---------- md5（取自 chatglm.cn 前端 bundle 模块55569 = blueimp-md5，node 对拍通过） ---------- */
  const __md5 = (function () {
    const e = { exports: {} }, r = () => ({});
    /* === verbatim from chatglm bundle === */
    !function(){"use strict";var t="input is invalid type",o="object"==typeof window,i=o?window:{};i.JS_MD5_NO_WINDOW&&(o=!1);var A=!o&&"object"==typeof self,l=!i.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;l?i=r.g:A&&(i=self);var a,n=!i.JS_MD5_NO_COMMON_JS&&e.exports,s="function"==typeof define&&define.amd,c=!i.JS_MD5_NO_ARRAY_BUFFER&&"u">typeof ArrayBuffer,d="0123456789abcdef".split(""),u=[128,32768,8388608,-0x80000000],p=[0,8,16,24],f=["hex","array","digest","buffer","arrayBuffer","base64"],C="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),h=[];if(c){var m=new ArrayBuffer(68);a=new Uint8Array(m),h=new Uint32Array(m)}var g=Array.isArray;(i.JS_MD5_NO_NODE_JS||!g)&&(g=function(e){return"[object Array]"===Object.prototype.toString.call(e)});var b=ArrayBuffer.isView;c&&(i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW||!b)&&(b=function(e){return"object"==typeof e&&e.buffer&&e.buffer.constructor===ArrayBuffer});var w=function(e){var r=typeof e;if("string"===r)return[e,!0];if("object"!==r||null===e)throw Error(t);if(c&&e.constructor===ArrayBuffer)return[new Uint8Array(e),!1];if(!g(e)&&!b(e))throw Error(t);return[e,!1]},B=function(e){return function(t){return new y(!0).update(t)[e]()}},x=function(e){var o,A=r(97091),l=r(66318).Buffer;return o=l.from&&!i.JS_MD5_NO_BUFFER_FROM?l.from:function(e){return new l(e)},function(r){if("string"==typeof r)return A.createHash("md5").update(r,"utf8").digest("hex");if(null==r)throw Error(t);return r.constructor===ArrayBuffer&&(r=new Uint8Array(r)),g(r)||b(r)||r.constructor===l?A.createHash("md5").update(o(r)).digest("hex"):e(r)}},_=function(e){return function(t,r){return new k(t,!0).update(r)[e]()}};function y(e){if(e)h[0]=h[16]=h[1]=h[2]=h[3]=h[4]=h[5]=h[6]=h[7]=h[8]=h[9]=h[10]=h[11]=h[12]=h[13]=h[14]=h[15]=0,this.blocks=h,this.buffer8=a;else if(c){var t=new ArrayBuffer(68);this.buffer8=new Uint8Array(t),this.blocks=new Uint32Array(t)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}function k(e,t){var r,o=w(e);if(e=o[0],o[1]){var i,A=[],l=e.length,a=0;for(r=0;r<l;++r)(i=e.charCodeAt(r))<128?A[a++]=i:(i<2048?A[a++]=192|i>>>6:(i<55296||i>=57344?A[a++]=224|i>>>12:(i=65536+((1023&i)<<10|1023&e.charCodeAt(++r)),A[a++]=240|i>>>18,A[a++]=128|i>>>12&63),A[a++]=128|i>>>6&63),A[a++]=128|63&i);e=A}e.length>64&&(e=new y(!0).update(e).array());var n=[],s=[];for(r=0;r<64;++r){var c=e[r]||0;n[r]=92^c,s[r]=54^c}y.call(this,t),this.update(s),this.oKeyPad=n,this.inner=!0,this.sharedMemory=t}y.prototype.update=function(e){if(this.finalized)throw Error("finalize already called");var t=w(e);e=t[0];for(var r,o,i=t[1],A=0,l=e.length,a=this.blocks,n=this.buffer8;A<l;){if(this.hashed&&(this.hashed=!1,a[0]=a[16],a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),i)if(c)for(o=this.start;A<l&&o<64;++A)(r=e.charCodeAt(A))<128?n[o++]=r:(r<2048?n[o++]=192|r>>>6:(r<55296||r>=57344?n[o++]=224|r>>>12:(r=65536+((1023&r)<<10|1023&e.charCodeAt(++A)),n[o++]=240|r>>>18,n[o++]=128|r>>>12&63),n[o++]=128|r>>>6&63),n[o++]=128|63&r);else for(o=this.start;A<l&&o<64;++A)(r=e.charCodeAt(A))<128?a[o>>>2]|=r<<p[3&o++]:(r<2048?a[o>>>2]|=(192|r>>>6)<<p[3&o++]:(r<55296||r>=57344?a[o>>>2]|=(224|r>>>12)<<p[3&o++]:(r=65536+((1023&r)<<10|1023&e.charCodeAt(++A)),a[o>>>2]|=(240|r>>>18)<<p[3&o++],a[o>>>2]|=(128|r>>>12&63)<<p[3&o++]),a[o>>>2]|=(128|r>>>6&63)<<p[3&o++]),a[o>>>2]|=(128|63&r)<<p[3&o++]);else if(c)for(o=this.start;A<l&&o<64;++A)n[o++]=e[A];else for(o=this.start;A<l&&o<64;++A)a[o>>>2]|=e[A]<<p[3&o++];this.lastByteIndex=o,this.bytes+=o-this.start,o>=64?(this.start=o-64,this.hash(),this.hashed=!0):this.start=o}return this.bytes>0xffffffff&&(this.hBytes+=this.bytes/0x100000000|0,this.bytes=this.bytes%0x100000000),this},y.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var e=this.blocks,t=this.lastByteIndex;e[t>>>2]|=u[3&t],t>=56&&(this.hashed||this.hash(),e[0]=e[16],e[16]=e[1]=e[2]=e[3]=e[4]=e[5]=e[6]=e[7]=e[8]=e[9]=e[10]=e[11]=e[12]=e[13]=e[14]=e[15]=0),e[14]=this.bytes<<3,e[15]=this.hBytes<<3|this.bytes>>>29,this.hash()}},y.prototype.hash=function(){var e,t,r,o,i,A,l=this.blocks;this.first?(r=((r=(-0x10325477^(o=((o=(-0x67452302^0x77777777&(e=((e=l[0]-0x28955b89)<<7|e>>>25)-0x10325477|0))+l[1]-0x705f434)<<12|o>>>20)+e|0)&(-0x10325477^e))+l[2]-0x4324b227)<<17|r>>>15)+o|0,t=((t=(e^r&(o^e))+l[3]-0x4e748589)<<22|t>>>10)+r|0):(e=this.h0,t=this.h1,r=this.h2,e+=((o=this.h3)^t&(r^o))+l[0]-0x28955b88,o+=(r^(e=(e<<7|e>>>25)+t|0)&(t^r))+l[1]-0x173848aa,r+=(t^(o=(o<<12|o>>>20)+e|0)&(e^t))+l[2]+0x242070db,t+=(e^(r=(r<<17|r>>>15)+o|0)&(o^e))+l[3]-0x3e423112,t=(t<<22|t>>>10)+r|0),e+=(o^t&(r^o))+l[4]-0xa83f051,o+=(r^(e=(e<<7|e>>>25)+t|0)&(t^r))+l[5]+0x4787c62a,r+=(t^(o=(o<<12|o>>>20)+e|0)&(e^t))+l[6]-0x57cfb9ed,t+=(e^(r=(r<<17|r>>>15)+o|0)&(o^e))+l[7]-0x2b96aff,e+=(o^(t=(t<<22|t>>>10)+r|0)&(r^o))+l[8]+0x698098d8,o+=(r^(e=(e<<7|e>>>25)+t|0)&(t^r))+l[9]-0x74bb0851,r+=(t^(o=(o<<12|o>>>20)+e|0)&(e^t))+l[10]-42063,t+=(e^(r=(r<<17|r>>>15)+o|0)&(o^e))+l[11]-0x76a32842,e+=(o^(t=(t<<22|t>>>10)+r|0)&(r^o))+l[12]+0x6b901122,o+=(r^(e=(e<<7|e>>>25)+t|0)&(t^r))+l[13]-0x2678e6d,r+=(t^(o=(o<<12|o>>>20)+e|0)&(e^t))+l[14]-0x5986bc72,t+=(e^(r=(r<<17|r>>>15)+o|0)&(o^e))+l[15]+0x49b40821,t=(t<<22|t>>>10)+r|0,e+=(r^o&(t^r))+l[1]-0x9e1da9e,e=(e<<5|e>>>27)+t|0,o+=(t^r&(e^t))+l[6]-0x3fbf4cc0,o=(o<<9|o>>>23)+e|0,r+=(e^t&(o^e))+l[11]+0x265e5a51,r=(r<<14|r>>>18)+o|0,t+=(o^e&(r^o))+l[0]-0x16493856,t=(t<<20|t>>>12)+r|0,e+=(r^o&(t^r))+l[5]-0x29d0efa3,e=(e<<5|e>>>27)+t|0,o+=(t^r&(e^t))+l[10]+0x2441453,o=(o<<9|o>>>23)+e|0,r+=(e^t&(o^e))+l[15]-0x275e197f,r=(r<<14|r>>>18)+o|0,t+=(o^e&(r^o))+l[4]-0x182c0438,t=(t<<20|t>>>12)+r|0,e+=(r^o&(t^r))+l[9]+0x21e1cde6,e=(e<<5|e>>>27)+t|0,o+=(t^r&(e^t))+l[14]-0x3cc8f82a,o=(o<<9|o>>>23)+e|0,r+=(e^t&(o^e))+l[3]-0xb2af279,r=(r<<14|r>>>18)+o|0,t+=(o^e&(r^o))+l[8]+0x455a14ed,t=(t<<20|t>>>12)+r|0,e+=(r^o&(t^r))+l[13]-0x561c16fb,e=(e<<5|e>>>27)+t|0,o+=(t^r&(e^t))+l[2]-0x3105c08,o=(o<<9|o>>>23)+e|0,r+=(e^t&(o^e))+l[7]+0x676f02d9,r=(r<<14|r>>>18)+o|0,t+=(o^e&(r^o))+l[12]-0x72d5b376,e+=((i=(t=(t<<20|t>>>12)+r|0)^r)^o)+l[5]-378558,o+=(i^(e=(e<<4|e>>>28)+t|0))+l[8]-0x788e097f,r+=((A=(o=(o<<11|o>>>21)+e|0)^e)^t)+l[11]+0x6d9d6122,t+=(A^(r=(r<<16|r>>>16)+o|0))+l[14]-0x21ac7f4,e+=((i=(t=(t<<23|t>>>9)+r|0)^r)^o)+l[1]-0x5b4115bc,o+=(i^(e=(e<<4|e>>>28)+t|0))+l[4]+0x4bdecfa9,r+=((A=(o=(o<<11|o>>>21)+e|0)^e)^t)+l[7]-0x944b4a0,t+=(A^(r=(r<<16|r>>>16)+o|0))+l[10]-0x41404390,e+=((i=(t=(t<<23|t>>>9)+r|0)^r)^o)+l[13]+0x289b7ec6,o+=(i^(e=(e<<4|e>>>28)+t|0))+l[0]-0x155ed806,r+=((A=(o=(o<<11|o>>>21)+e|0)^e)^t)+l[3]-0x2b10cf7b,t+=(A^(r=(r<<16|r>>>16)+o|0))+l[6]+0x4881d05,e+=((i=(t=(t<<23|t>>>9)+r|0)^r)^o)+l[9]-0x262b2fc7,o+=(i^(e=(e<<4|e>>>28)+t|0))+l[12]-0x1924661b,r+=((A=(o=(o<<11|o>>>21)+e|0)^e)^t)+l[15]+0x1fa27cf8,t+=(A^(r=(r<<16|r>>>16)+o|0))+l[2]-0x3b53a99b,t=(t<<23|t>>>9)+r|0,e+=(r^(t|~o))+l[0]-0xbd6ddbc,e=(e<<6|e>>>26)+t|0,o+=(t^(e|~r))+l[7]+0x432aff97,o=(o<<10|o>>>22)+e|0,r+=(e^(o|~t))+l[14]-0x546bdc59,r=(r<<15|r>>>17)+o|0,t+=(o^(r|~e))+l[5]-0x36c5fc7,t=(t<<21|t>>>11)+r|0,e+=(r^(t|~o))+l[12]+0x655b59c3,e=(e<<6|e>>>26)+t|0,o+=(t^(e|~r))+l[3]-0x70f3336e,o=(o<<10|o>>>22)+e|0,r+=(e^(o|~t))+l[10]-1051523,r=(r<<15|r>>>17)+o|0,t+=(o^(r|~e))+l[1]-0x7a7ba22f,t=(t<<21|t>>>11)+r|0,e+=(r^(t|~o))+l[8]+0x6fa87e4f,e=(e<<6|e>>>26)+t|0,o+=(t^(e|~r))+l[15]-0x1d31920,o=(o<<10|o>>>22)+e|0,r+=(e^(o|~t))+l[6]-0x5cfebcec,r=(r<<15|r>>>17)+o|0,t+=(o^(r|~e))+l[13]+0x4e0811a1,t=(t<<21|t>>>11)+r|0,e+=(r^(t|~o))+l[4]-0x8ac817e,e=(e<<6|e>>>26)+t|0,o+=(t^(e|~r))+l[11]-0x42c50dcb,o=(o<<10|o>>>22)+e|0,r+=(e^(o|~t))+l[2]+0x2ad7d2bb,r=(r<<15|r>>>17)+o|0,t+=(o^(r|~e))+l[9]-0x14792c6f,t=(t<<21|t>>>11)+r|0,this.first?(this.h0=e+0x67452301|0,this.h1=t-0x10325477|0,this.h2=r-0x67452302|0,this.h3=o+0x10325476|0,this.first=!1):(this.h0=this.h0+e|0,this.h1=this.h1+t|0,this.h2=this.h2+r|0,this.h3=this.h3+o|0)},y.prototype.hex=function(){this.finalize();var e=this.h0,t=this.h1,r=this.h2,o=this.h3;return d[e>>>4&15]+d[15&e]+d[e>>>12&15]+d[e>>>8&15]+d[e>>>20&15]+d[e>>>16&15]+d[e>>>28&15]+d[e>>>24&15]+d[t>>>4&15]+d[15&t]+d[t>>>12&15]+d[t>>>8&15]+d[t>>>20&15]+d[t>>>16&15]+d[t>>>28&15]+d[t>>>24&15]+d[r>>>4&15]+d[15&r]+d[r>>>12&15]+d[r>>>8&15]+d[r>>>20&15]+d[r>>>16&15]+d[r>>>28&15]+d[r>>>24&15]+d[o>>>4&15]+d[15&o]+d[o>>>12&15]+d[o>>>8&15]+d[o>>>20&15]+d[o>>>16&15]+d[o>>>28&15]+d[o>>>24&15]},y.prototype.toString=y.prototype.hex,y.prototype.digest=function(){this.finalize();var e=this.h0,t=this.h1,r=this.h2,o=this.h3;return[255&e,e>>>8&255,e>>>16&255,e>>>24&255,255&t,t>>>8&255,t>>>16&255,t>>>24&255,255&r,r>>>8&255,r>>>16&255,r>>>24&255,255&o,o>>>8&255,o>>>16&255,o>>>24&255]},y.prototype.array=y.prototype.digest,y.prototype.arrayBuffer=function(){this.finalize();var e=new ArrayBuffer(16),t=new Uint32Array(e);return t[0]=this.h0,t[1]=this.h1,t[2]=this.h2,t[3]=this.h3,e},y.prototype.buffer=y.prototype.arrayBuffer,y.prototype.base64=function(){for(var e,t,r,o="",i=this.array(),A=0;A<15;)e=i[A++],t=i[A++],r=i[A++],o+=C[e>>>2]+C[(e<<4|t>>>4)&63]+C[(t<<2|r>>>6)&63]+C[63&r];return o+(C[(e=i[A])>>>2]+C[e<<4&63]+"==")},k.prototype=new y,k.prototype.finalize=function(){if(y.prototype.finalize.call(this),this.inner){this.inner=!1;var e=this.array();y.call(this,this.sharedMemory),this.update(this.oKeyPad),this.update(e),y.prototype.finalize.call(this)}};var E=function(){var e=B("hex");l&&(e=x(e)),e.create=function(){return new y},e.update=function(t){return e.create().update(t)};for(var t=0;t<f.length;++t){var r=f[t];e[r]=B(r)}return e}();E.md5=E,E.md5.hmac=function(){var e=_("hex");e.create=function(e){return new k(e)},e.update=function(t,r){return e.create(t).update(r)};for(var t=0;t<f.length;++t){var r=f[t];e[r]=_(r)}return e}(),n?e.exports=E:(i.md5=E,s&&define(function(){return E}))}()
    /* === end === */
    return e.exports;
  })();
  function hex_md5(s) { return __md5(s); }

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
  function onNewLoginToken(tok) {
    captured.token = tok;
    if (!tok || tok.split(".").length < 3) return; // 清 cookie 时的空值等垃圾写入
    if (onNewLoginToken._lastTok === tok) return;
    onNewLoginToken._lastTok = tok;
    const flag = (() => { try { return JSON.parse(localStorage.getItem(ADDING_KEY) || "null"); } catch { return null; } })();
    if (!flag) return;
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
      border-radius:50%;background:#fff center/34px no-repeat url("${LOGO_URL}");
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

  /* 切换账号：写回 cookie + 设备指纹 + 刷新（等效 Z-SWITCH） */
  function switchTo(name) {
    const acc = pool.all()[name];
    if (!acc) return;
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

  async function checkinOne(acc) {
    const j = await accCheckin(acc);
    if (j.status === 0) { setResult(acc.name, "✅+" + ((j.result || {}).score ?? "?")); return true; }
    if (j.status === 10001) { setResult(acc.name, "已领"); return true; }
    if (j.status === 401) { setResult(acc.name, "token过期"); return false; }
    if (j.status === 403) { setResult(acc.name, "⚠️403风控"); return false; }
    setResult(acc.name, "status" + j.status + ":" + (j.message || "").slice(0, 12));
    return false;
  }

  async function checkinAll() {
    for (const acc of Object.values(pool.all())) await checkinOne(acc);
  }

  async function refreshBalances() {
    for (const acc of Object.values(pool.all())) {
      const j = await accInfo(acc);
      const p = pool.all();
      if (j.status === 0) {
        p[acc.name].balance = j.result.member_info?.left_score;
        p[acc.name].last_result = "";
      } else if (p[acc.name]) {
        p[acc.name].last_result = "HTTP" + j.status;
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

  window.__zsw = { pool, signHeaders, hex_md5, captured, apiCall, switchTo, readCookie };
})();
