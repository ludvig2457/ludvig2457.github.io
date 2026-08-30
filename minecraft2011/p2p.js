/* ============================================================
   p2p.js — настоящий P2P для сайта 2011 года!
   WebRTC (PeerJS) + публичный сигнальный сервер PeerJS Cloud.
   Гильдия (комната): до 12 слотов, децентрализованная гостевая,
   голосование и чат — напрямую между браузерами БЕЗ серверов.
   ============================================================ */
(function () {
  "use strict";

  var MC = window.MC2011 || {};
  function $(s) { return document.querySelector(s); }
  function toast(m) { if (MC.toast) MC.toast(m); }

  var ROOM_KEY = "mc2011_room", SLOTS = 12;
  var room = localStorage.getItem(ROOM_KEY) || "2011";
  var peer = null, conns = {}, mySlot = -1;

  var statusEl = $("[data-p2p-status]"), onlineEl = $("[data-p2p-online]");
  var chatEl = $("[data-chat]"), chatIn = $("[data-chat-input]"), nickEl = $("[data-chat-nick]");
  var NICK_KEY = "mc2011_nick";

  function nick() {
    return (nickEl && nickEl.value.trim()) || localStorage.getItem(NICK_KEY) || "Анонимус";
  }
  function pid(s) { return "mc2011-" + room + "-" + s; }
  function now() {
    var d = new Date();
    return ((d.getHours() < 10 ? "0" : "") + d.getHours() + ":" +
            (d.getMinutes() < 10 ? "0" : "") + d.getMinutes());
  }
  function setStatus(t) { if (statusEl) statusEl.textContent = t; }
  function online() {
    var n = Object.keys(conns).length + (peer ? 1 : 0);
    if (onlineEl) onlineEl.textContent = n;
    MC.onlineSet && MC.onlineSet(n);
  }

  function tryOpen(s) {
    if (s >= SLOTS) { setStatus("все слоты гильдии заняты :("); return; }
    if (peer) return;
    var p;
    try { p = new Peer(pid(s), { debug: 0 }); }
    catch (e) { setStatus("P2P выключен (нет PeerJS)"); return; }

    p.on("open", function () {
      peer = p; mySlot = s;
      setStatus("сеть «" + room + "»: я = слот " + s);
      online();
      toast("P2P: вошёл в сеть гильдии «" + room + "», я — слот " + s);
      var i;
      for (i = 0; i < SLOTS; i++) {
        if (i === s) continue;
        (function (t) {
          var c = p.connect(pid(t), { reliable: true });
          var to = setTimeout(function () { try { c.close(); } catch (e) {} }, 4000);
          c.on("open", function () { clearTimeout(to); setup(c, false); });
          c.on("error", function () { clearTimeout(to); });
        })(i);
      }
    });
    p.on("error", function (err) {
      if (err && err.type === "unavailable-id") { if (!peer) tryOpen(s + 1); }
      else if (peer === p) setStatus("потеря связи (" + (err && err.type) + ")");
      else if (!peer) setStatus("P2P недоступен (" + (err && err.type) + ")");
    });
    p.on("connection", function (c) { setup(c, true); });
    p.on("disconnected", function () {
      if (p === peer) { toast("P2P: оборвался, переподключаюсь..."); if (p) p.reconnect(); }
    });
  }

  function setup(c, incoming) {
    var id = c.peer;
    if (conns[id]) return;
    conns[id] = c;
    c.on("data", function (d) { handle(d, c); });
    c.on("open", function () {
      c.send({ type: "hello", name: nick() });
      if (MC.getGB) c.send({ type: "gb", entries: MC.getGB() });
      if (MC.getPoll) c.send({ type: "poll", votes: MC.getPoll() });
      online();
    });
    c.on("close", function () { delete conns[id]; online(); });
    c.on("error", function () { delete conns[id]; online(); });
    online();
  }

  function sendToAll(m) { var k; for (k in conns) { try { conns[k].send(m); } catch (e) {} } }

  function handle(d, c) {
    if (!d || !d.type) return;
    if (d.type === "gb") {
      var added = MC.mergeGB ? MC.mergeGB(d.entries || []) : 0;
      if (added > 0 && MC.getGB) sendToAll({ type: "gb", entries: MC.getGB() });
    } else if (d.type === "poll") {
      var ch = MC.mergePoll ? MC.mergePoll(d.votes || {}) : 0;
      if (ch > 0 && MC.getPoll) sendToAll({ type: "poll", votes: MC.getPoll() });
    } else if (d.type === "chat") { renderChat(d.name, d.text, d.ts || now()); }
    else if (d.type === "skin") { renderSkin(d.name, d.ts || now()); }
  }

  /* ======== чат ======== */
  function renderChat(name, text, ts) {
    if (!chatEl) return;
    var el = document.createElement("div");
    el.className = "chatline";
    el.innerHTML = '<span class="cts">[' + ts + ']</span> <b></b> <span class="ctt"></span>';
    el.querySelector("b").textContent = "<" + name + ">";
    el.querySelector(".ctt").textContent = text;
    chatEl.appendChild(el);
    chatEl.scrollTop = chatEl.scrollHeight;
  }
  function renderSkin(name, ts) {
    if (!chatEl) return;
    var el = document.createElement("div");
    el.className = "chatline";
    el.innerHTML = '<span class="cts">[' + ts + ']</span> <b></b> <span class="ctt"></span>';
    el.querySelector("b").textContent = "<" + name + ">";
    el.querySelector(".ctt").innerHTML = "прислал(а) СКИН: <span data-art='creeper' data-ps='3' style='display:inline-block;vertical-align:middle;'></span>";
    var a = el.querySelector("[data-art]");
    if (a && MC.makeArt) a.appendChild(MC.makeArt("creeper", 3));
    chatEl.appendChild(el);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  /* ======== UI управления ======== */
  function joinUI() {
    var inp = $("[data-room]"), btn = $("[data-join]");
    if (inp) inp.value = room;
    if (btn) btn.onclick = function () {
      var r = (inp.value || "").replace(/[^a-z0-9-]/gi, "").slice(0, 16).toLowerCase();
      if (!r) r = "2011";
      room = r;
      localStorage.setItem(ROOM_KEY, r);
      restart();
    };
    if (chatIn) chatIn.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter") return;
      var t = chatIn.value.trim();
      if (!t) return;
      if (t === "/скин") {
        renderSkin(nick(), now());
        sendToAll({ type: "skin", name: nick(), ts: now() });
      } else {
        renderChat(nick(), t, now());
        sendToAll({ type: "chat", name: nick(), text: t, ts: now() });
      }
      chatIn.value = "";
    });
    if (nickEl) nickEl.addEventListener("change", function () {
      localStorage.setItem(NICK_KEY, nickEl.value.trim());
    });
    if (nickEl && localStorage.getItem(NICK_KEY)) nickEl.value = localStorage.getItem(NICK_KEY);
  }

  /* ======== запуск/остановка ======== */
  function restart() { stop(); start(); }
  function stop() {
    if (peer) { try { peer.destroy(); } catch (e) {} }
    peer = null; conns = {}; mySlot = -1;
  }
  function start() {
    joinUI();
    if (!window.Peer) { setStatus("P2P выключен: PeerJS не загрузился (нужен интернет)"); return; }
    tryOpen(0);
  }

  window.MC2011P2P = {
    broadcastGB: function () { if (peer && MC.getGB) sendToAll({ type: "gb", entries: MC.getGB() }); },
    broadcastPoll: function () { if (peer && MC.getPoll) sendToAll({ type: "poll", votes: MC.getPoll() }); }
  };

  if (!window.Peer) { setStatus("P2P выключен: PeerJS не загрузился (нужен интернет)"); return; }
  document.addEventListener("DOMContentLoaded", start);
})();