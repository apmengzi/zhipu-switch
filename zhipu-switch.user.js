// ==UserScript==
// @name         zhipu-switch · 智谱清言多账号积分助手
// @namespace    zsw
// @version      0.3.1
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
