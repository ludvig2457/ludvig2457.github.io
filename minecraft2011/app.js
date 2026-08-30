/* ============================================================
   app.js — "движок" сайта 2011: пиксель-арт, гост<евая, счётчики,
   голосование, дождь, часы, секреты. Без флеша!
   ============================================================ */

(function () {
  "use strict";

  var MC = window.MC2011 = window.MC2011 || {};

  /* ---------------- пиксель-арт: палитра спрайтов ---------------- */
  var PAL = {
    k: "#1a1a1a", g: "#4caf50", G: "#2e7d32", s: "#e8b883", S: "#c98a54",
    h: "#5d3a1a", H: "#40260f", w: "#f4f4f4", W: "#c9c9c9", d: "#8a5a2b",
    D: "#6e441d", r: "#ff3b30", R: "#a31717", b: "#3f6cdf", B: "#1d4db8",
    y: "#ffd54f", Y: "#d4a017", o: "#ff9800", t: "#00e5ff", T: "#00838f",
    l: "#ff6f00", p: "#f06292", e: "#101010", n: "#9c4a1c", N: "#6e2f10",
    m: "#8a8a8a", M: "#555555", u: "#7a4a21", U: "#553315", c: "#b0bec5",
    C: "#78909c", L: "#ffb300", f: "#5d4037"
  };

  var ART = {
    creeper: [
      "..gggg..",
      "gggggggg",
      "ggkkkkgg",
      "ggkkkkgg",
      "ggkkkkgg",
      "gggggggg",
      "ggg..ggg",
      "ggg..ggg"
    ],
    zombie: [
      "hhhhhhhh",
      "hhhhhhhh",
      "hssssshh",
      "hskksshh",
      "hssssshh",
      "hshhsshh",
      "ssssssss",
      "ssSSssss"
    ],
    steve: [
      "hhhhhhhh",
      "hhhhhhhh",
      "hssssssH",
      "hsbbsbHH",
      "hssssssH",
      "hssssshh",
      "hssssshh",
      "hhshhhsh"
    ],
    grass: [
      "gGGgGGgg",
      "GGGGGGGG",
      "dgGGGGgd",
      "DDddddDD",
      "ddDddDdd",
      "dDdddddD",
      "DddDdddD",
      "dddddddd"
    ],
    dirt: [
      "DdDdddDd",
      "ddddDddD",
      "dDdDDddD",
      "DDddDddd",
      "ddDddDdD",
      "dDdddDDd",
      "DddDdddd",
      "dddddddd"
    ],
    wood: [
      "uuUuuuUu",
      "UuuUuuuu",
      "uuuuUuuU",
      "uUuuuUuu",
      "uuUuUuuu",
      "UuuuuuUu",
      "uuuUuuuU",
      "uUuuuUuu"
    ],
    netherrack: [
      "nnNnNnnn",
      "NnnnnNnN",
      "nnNnnNnn",
      "NnnnnnnN",
      "nnnNnNnn",
      "NnNnnnNn",
      "nnnnnNnn",
      "nNnnnnNn"
    ],
    "nether-brick": [
      "NNNNNNNN",
      "NN...NNN",
      "NN...NNN",
      "NNNNNNNN",
      "NN.NNNNN",
      "NN.NNNNN",
      "NNNNNNNN",
      "NN.NNNNN"
    ],
    obsidian: [
      "eEeeeeEe",
      "eeEeEeee",
      "EeeeeEee",
      "eeeEEeee",
      "eEeeeEeE",
      "EeeEeeee",
      "eeEeeeeE",
      "eEeeEeee"
    ],
    lava: [
      "LllLLlll",
      "llLLllLL",
      "lLlllLll",
      "LllLLLll",
      "lLLllLLL",
      "llLlllLL",
      "LlllLlLl",
      "llLLlLll"
    ],
    sand: [
      "yYyYYyYy",
      "YYyYYyYY",
      "yYYyYYYy",
      "YyYYYyYY",
      "YyYYyYYY",
      "YYyYYYyY",
      "yYYYYyYy",
      "YyYYyYYY"
    ],
    tnt: [
      "rrrrrrrr",
      "rRRRRRrr",
      "rRwwRRwr",
      "rrrrrrrr",
      "rrkrrkrr",
      "rRwrRwrr",
      "rrRRRRrr",
      "rrrrrrrr"
    ],
    wolf: [
      "MMmMMMMM",
      "mMMMMwwM",
      "MMwwwwww",
      "mwkwwkww",
      "MMwwwwwM",
      "mmMMmmmm",
      "mMMmMMmm",
      "MMmMMMMm"
    ],
    pig: [
      "pppppppp",
      "pppppppp",
      "pPpppPPp",
      "pWpWWWPp",
      "pPpppPPp",
      "pppppppp",
      "pppppppp",
      "pPpppPPp"
    ],
    diamond: [
      "....tt..",
      "...tttt.",
      "..tttttt",
      ".ttttttt",
      "ttTttttt",
      ".Tttttt.",
      "..tttt..",
      "...tt..."
    ],
    piston: [
      "mmmmmmmm",
      "mMwwwwMm",
      "mwkwkkwm",
      "mwkkkwkm",
      "mwkwkkwm",
      "mwwwwwkm",
      "mMwwwwMm",
      "mmmmmmmm"
    ]
  };

  function artDOM(name, ps) {
    ps = ps || 6;
    var rows = ART[name];
    var div = document.createElement("div");
    div.className = "art";
    var h = rows.length, w = rows[0].length;
    div.style.width = (w * ps) + "px";
    div.style.height = (h * ps) + "px";
    var shadows = [];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var ch = rows[y].charAt(x);
        if (ch === "." || !PAL[ch]) continue;
        shadows.push((x * ps) + "px " + (y * ps) + "px 0 " + PAL[ch]);
      }
    }
    var pix = document.createElement("div");
    pix.className = "pix";
    pix.style.boxShadow = shadows.join(",");
    div.appendChild(pix);
    return div;
  }

  function artBox(name, ps) {
    var el = artDOM(name, ps);
    return el;
  }

  /* ======== инициализация всех спрайтов [data-art] ======== */
  function initArts() {
    var els = document.querySelectorAll("[data-art]");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      var name = e.getAttribute("data-art");
      var ps = parseInt(e.getAttribute("data-ps"), 10) || 6;
      var a = artBox(name, ps);
      e.style.width = "auto";
      e.appendChild(a);
    }
  }

  /* ======== счётчик посещений ======== */
  var COUNTER_KEY = "mc2011_counter";
  function initCounter() {
    var el = document.querySelector("[data-counter]");
    if (!el) return;
    var base = 1048576;
    var n = parseInt(localStorage.getItem(COUNTER_KEY), 10) || base;
    n += Math.floor(Math.random() * 4) + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    var target = el.
              getAttribute("data-counter") === "0" ? n : parseInt(el.getAttribute("data-counter"),10) || n;
    var disp = String(target);
    while (disp.length < 7) disp = "0" + disp;
    var nd = Math.max(el.dataset.min || 7, disp.length);
    var digits = [];
    for (var i = 0; i < nd; i++) {
      var d = document.createElement("span");
      d.className = "odod";
      digits.push(d);
      el.appendChild(d);
    }
    // анимация перемотки как у барабана
    var frames = 12;
    var step = 0;
    function paint() {
      var shown = String(Math.floor(target * (step / frames))).split("");
      while (shown.length < nd) shown.unshift("0");
      for (var i = 0; i < nd; i++) digits[i].textContent = shown[i];
      step++;
      if (step <= frames) setTimeout(paint, 40);
    }
    paint();
  }

  /* ======== онлайн ======== */
  function initOnline() {
    var el = document.querySelector("[data-online]");
    if (!el) return;
    var min = parseInt(el.getAttribute("data-min"), 10) || 15;
    var max = parseInt(el.getAttribute("data-max"), 10) || 90;
    function tick() {
      el.textContent = Math.floor(min + Math.random() * (max - min));
    }
    tick();
    setInterval(tick, 4000);
  }

  /* ======== часы ======== */
  function initClock() {
    var el = document.querySelector("[data-clock]");
    if (!el) return;
    function tick() {
      var d = new Date();
      var p = function (x) { return (x < 10 ? "0" : "") + x; };
      el.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ======== голосование ======== */
  var POLL_KEY = "mc2011_poll_v1";
  var POLL_DEFAULTS = {
    "Альфа 1.2.0": 312,
    "Бета 1.7 (поршни)": 451,
    "Бета 1.8": 689,
    "Классик (творог)": 143
  };
  function initPoll() {
    var el = document.querySelector("[data-poll]");
    if (!el) return;
    el.classList.add("poll");
    var votes;
    try { votes = JSON.parse(localStorage.getItem(POLL_KEY)) || POLL_DEFAULTS; }
    catch (e) { votes = POLL_DEFAULTS; }
    localStorage.setItem(POLL_KEY, JSON.stringify(votes));

    function total() { var s = 0; for (var k in votes) s += votes[k]; return s; }
    function render() {
      el.innerHTML = "";
      var tot = total();
      var max = 0; for (var k in votes) if (votes[k] > max) max = votes[k];
      var names = Object.keys(votes);
      names.forEach(function (nm) {
        var pct = tot ? Math.round(votes[nm] * 100 / tot) : 0;
        var row = document.createElement("div");
        row.className = "row opt";
        row.innerHTML = '<span class="nm"></span><span class="w"><div class="bar"></div></span><span class="pct"></span>';
        row.querySelector(".nm").textContent = nm;
        var bar = row.querySelector(".bar");
        bar.style.width = Math.max(3, pct) + "%";
        if (votes[nm] === max) bar.classList.add("win");
        row.querySelector(".pct").textContent = pct + "%";
        row.onclick = function () {
          votes[nm]++;
          localStorage.setItem(POLL_KEY, JSON.stringify(votes));
          render();
          toast("Спасибо! Твой голос записан за «" + nm + "»!!!");
        };
        el.appendChild(row);
      });
      el.appendChild(document.createElement("div").appendChild(document.createTextNode("Голосов: " + tot)));
    }
    render();
    MC.getPoll = function () { return votes; };
    MC.mergePoll = function (v) {
      if (!v) return 0;
      var k, changed = 0;
      for (k in v) {
        if (!v[k]) continue;
        if (!(k in votes)) votes[k] = 0;
        if (v[k] > votes[k]) { votes[k] = v[k]; changed++; }
      }
      if (changed) { localStorage.setItem(POLL_KEY, JSON.stringify(votes)); render(); }
      return changed;
    };
  }

  /* ======== подписка ======== */
  var SUB_KEY = "mc2011_subs";
  var CAP_KEY = "mc2011_capcha";
  function initNewsletter() {
    var form = document.querySelector("[data-newsletter]");
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = form.querySelector('[name="email"]').value.trim();
      var cap = form.querySelector('[name="cap"]').value.trim().toLowerCase();
      var subs = parseInt(localStorage.getItem(SUB_KEY), 10) || 1520;
      if (!email) { toast("А где e-mail, человек?!!"); return; }
      if (cap !== "крипер") { toast("Проверка на робота НЕ пройдена. Напиши «крипер»!"); return; }
      subs++;
      localStorage.setItem(SUB_KEY, String(subs));
      localStorage.setItem(CAP_KEY, email);
      toast("ПОДПИСАН! Теперь варенье и бетон 1.7 тебе гарантированы! Подписчиков: " + subs);
      form.reset();
    });
  }

  /* ======== советы-тикер ======== */
  var TIPS = [
    "СОВЕТ: найди уголь ДО первой ночи, иначе встречай криперов у костра.",
    "СОВЕТ: если услышал «шиииии» — беги зигзагом!",
    "СОВЕТ: поршни + редстоун = секретная дверь на зависть соседям.",
    "СОВЕТ: овцу можно покрасить, а вот крипера — нет.",
    "СОВЕТ: в бете 1.8 нажми SHIFT на краю — и не упадёшь.",
    "СОВЕТ: купил альфу за 9.95 евро? Все версии дальше бесплатные!",
    "СОВЕТ: не храни динамит рядом с домом. Проверено 1482 раз."
  ];
  function initTips() {
    var el = document.querySelector("[data-tips]");
    if (!el) return;
    var i = Math.floor(Math.random() * TIPS.length);
    el.textContent = TIPS[i];
    setInterval(function () {
      i = (i + 1) % TIPS.length;
      el.textContent = TIPS[i];
      el.style.opacity = 0.2;
      setTimeout(function () { el.style.opacity = 1; }, 200);
    }, 6500);
  }

  /* ======== тосты ======== */
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }

  /* ======== правая кнопка (мем 2011) ======== */
  document.addEventListener("contextmenu", function (ev) {
    if (ev.target.closest("input,textarea")) return;
    ev.preventDefault();
    toast("О_О Правая кнопка? Зачем? Сайт 2011 года, воровать тут нечего! Ладно, но не воруй!");
  });

  /* ======== секреты: «КРИПЕР» и «ГЕРОБРИН» ======== */
  var typed = "";
  var sec1 = "крипер", sec2 = "геробрин";
  document.addEventListener("keydown", function (ev) {
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    var ch = String(ev.key || "").toLowerCase();
    if (!ch || ch.length !== 1) return;
    typed = (typed + ch).slice(-sec2.length);
    if (typed === sec1) {
      var link = document.querySelector("[data-secret-link]");
      if (link) { link.style.visibility = "visible"; toast("О.О ТЫ ЗНАЕШЬ СЕКРЕТ! ВХОД В ПОДВАЛ ОТКРЫТ!"); }
    } else if (typed === sec2) {
      var f = document.createElement("div");
      f.style.cssText = "position:fixed;inset:0;z-index:9995;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;color:#0a0;font-family:'Comic Sans MS',cursive;font-size:20px;text-align:center;cursor:pointer;";
      f.textContent = "Он видел тебя...\n(жми в любом месте, чтобы уйти)";
      f.onclick = function () { f.remove(); };
      document.body.appendChild(f);
      toast("О.О ТЫ ВЫЗВАЛ ГЕРОБРИНА... ЭТО НЕ ФОТОШОП.");
    }
  });

  /* ======== дождь (бета 1.5) ======== */
  function initRain() {
    var btn = document.querySelector("[data-rainbtn]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      document.body.classList.toggle("weather");
      toast(document.body.classList.contains("weather") ? "ДОЖДЬ ВКЛЮЧЁН! Бета 1.5 одобряет!" : "Дождь выключен. Погода 2011 опять хорошая.");
    });
  }

  /* ======== фильтр версий ======== */
  function initFilters() {
    var box = document.querySelector("[data-filters]");
    if (!box) return;
    box.addEventListener("click", function (ev) {
      var b = ev.target.closest(".mini");
      if (!b) return;
      var f = b.getAttribute("data-filter");
      var cards = document.querySelectorAll("[data-phase]");
      cards.forEach(function (c) {
        var match = f === "all" || c.getAttribute("data-phase") === f;
        c.style.display = match ? "" : "none";
      });
      box.querySelectorAll(".mini").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
    });
  }

  /* ======== галерея: сцены ======== */
  var SC = { g: "grass", d: "dirt", w: "wood", s: "sand", n: "netherrack", b: "nether-brick", o: "obsidian", l: "lava", x: "tnt", t: "stone" };
  var STONE_ART = ["mmmmmmmm","mMmmmmMm","MmMMmmmm","mmmMmmmm","mMMmmmMm","MmmmMMmm","mMmMmMMm","mmmmmmmm"];
  ART.stone = STONE_ART;

  function buildScene(cells, opts) {
    opts = opts || {};
    var h = cells.length, w = 0, i;
    for (i = 0; i < h; i++) if (cells[i].length > w) w = cells[i].length;
    var cs = 24;
    var wrap = document.createElement("div");
    wrap.className = "scene";
    wrap.style.width = (w * cs) + "px";
    wrap.style.height = (h * cs) + "px";
    if (opts.sky) wrap.style.background = opts.sky;
    if (opts.sun) { var s = document.createElement("div"); s.className = "sun"; wrap.appendChild(s); }
    if (opts.cloud) { var c = document.createElement("div"); c.className = "cloudx"; c.style.cssText = "left:" + opts.cloud + ";top:16px;"; wrap.appendChild(c); }
    for (var y = 0; y < h; y++) {
      var row = document.createElement("div");
      row.className = "row";
      row.style.top = (opts.offsetY || 0) + y * cs + "px";
      row.style.height = cs + "px";
      for (var x = 0; x < w; x++) {
        var cell = document.createElement("div");
        cell.className = "cell";
        var key = cells[y].charAt(x);
        if (SC[key]) {
          var a = artDOM(SC[key], cs);
          a.style.position = "absolute";
          if (key === "l") a.classList.add("lava");
          cell.appendChild(a);
        }
        row.appendChild(cell);
      }
      wrap.appendChild(row);
    }
    return wrap;
  }

  function initScenes() {
    var els = document.querySelectorAll("[data-scene]");
    if (!els.length) return { scenes: [] };
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      try {
        var spec = JSON.parse(e.getAttribute("data-scene"));
        var opts = { sunset: false };
        var wrap = buildScene(spec.rows, opts);
        var top = spec.offsetY || 0;
        if (spec.rowOffset) wrap.querySelector(".row").style.top = spec.rowOffset + "px";
        // перезапишем верхние ряды
        var rows = wrap.querySelectorAll(".row");
        for (var r = 0; r < spec.rows.length; r++) rows[r].style.top = (top + r * 24) + "px";
        e.appendChild(wrap);
      } catch (err) { /* пусть пустой */ }
    }
    return { ok: true };
  }

  /* ======== гостевая книга (localStorage) ======== */
  var GB_KEY = "mc2011_gb_v2";
  function uid() {
    return "u" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }
  var GB_SEED = [
    { n: "Steve_2011", d: "17.09.2011 в 02:33", t: "ЗАБАГОВАЛ ПОРШЕНЬ, И ОН СДВИНУЛ ВЕСЬ АД НА 3 БЛОКА ВЛЕВО. КАК ТАКОЕ ВОЗМОЖНО. 10/10.", a: "админ: в 1.7 так могли многие, всемогущество поршней!", uid: "seed1" },
    { n: "иван123", d: "15.05.2011 в 18:02", t: "Скажите, а когда бета 1.8? И правда, что там ЭНДЕРМЕНЫ таскают блоки? Я БОЮСЬ.", a: "админ: да, таскают. И смотрят на тебя. Не пялься в глаза.", uid: "seed2" },
    { n: "Katty_Kitty", d: "02.05.2011 в 09:15", t: "Мой волк Дружок умер, пока я ходила за мясом. Похоронила, построила ему золотой домик.", a: "мод: соболезнуем. Бетта 1.8 будет с оврагами — сажай там цветы в память.", uid: "seed3" },
    { n: "CreepersHunter", d: "21.04.2011 в 21:00", t: "НИКОГДА. НЕ. СТАВЬ. ОБСИДИАН. НА. ПУЗО. ПРОВЕРЕНО.", a: "админ: какая боль... держись там.", uid: "seed4" },
    { n: "bot9000", d: "27.02.2011 в 02:02", t: "test. test. тест гостевой. Если это видят — движок норм. Даю 8/10, жду флеш-плагин.", a: "админ: флеша НЕ БУДЕТ, у нас HTML+JS! экономь мегабайты на кошкапе!", uid: "seed5" }
  ];
  function gbLoad() {
    try {
      var arr = JSON.parse(localStorage.getItem(GB_KEY));
      if (arr && arr.length) {
        var fixed = false;
        for (var i = 0; i < arr.length; i++) {
          if (!arr[i].uid) { arr[i].uid = uid(); fixed = true; }
        }
        if (fixed) localStorage.setItem(GB_KEY, JSON.stringify(arr));
        return arr;
      }
    } catch (e) {}
    localStorage.setItem(GB_KEY, JSON.stringify(GB_SEED));
    return GB_SEED.slice();
  }
  function initGuestbook() {
    var root = document.querySelector("[data-guestbook]");
    if (!root) return;
    var posts = gbLoad();
    function nowStr() {
      var d = new Date();
      return ((d.getDate() < 10 ? "0" : "") + d.getDate() + "." +
             ((d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1)) + "." + d.getFullYear() +
             " в " + (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" +
             (d.getMinutes() < 10 ? "0" : "") + d.getMinutes());
    }
    function save() { localStorage.setItem(GB_KEY, JSON.stringify(posts)); }
    MC.getGB = function () { return posts; };
    MC.setGB = function (arr) { posts = arr; save(); render(); };
    MC.broadcastGB = function () { if (window.MC2011P2P) window.MC2011P2P.broadcastGB(); };
    MC.mergeGB = function (arr) {
      if (!arr || !arr.length || !posts) return 0;
      var seen = {}, i, added = 0;
      for (i = 0; i < posts.length; i++) seen[posts[i].uid] = 1;
      for (i = 0; i < arr.length; i++) {
        if (!arr[i].uid || seen[arr[i].uid]) continue;
        seen[arr[i].uid] = 1;
        posts.unshift(arr[i]);
        added++;
      }
      if (posts.length > 60) posts.length = 60;
      if (added) { save(); render(); }
      return added;
    };
    function render() {
      root.innerHTML = "";
      posts.forEach(function (p, i) {
        var el = document.createElement("div");
        el.className = "post";
        if (i === 0) el.classList.add("gb-new");
        var head = document.createElement("div");
        head.className = "head";
        var del = '<span class="del" data-i="' + i + '">[удалить]</span>';
        head.innerHTML = "<b></b><span class='date'></span>" + del;
        head.querySelector("b").textContent = p.n;
        head.querySelector(".date").textContent = p.d;
        el.appendChild(head);
        var body = document.createElement("div");
        body.innerHTML = "<div></div>";
        body.children[0].textContent = p.t;
        el.appendChild(body);
        if (p.a) {
          var ans = document.createElement("div");
          ans.style.cssText = "margin-top:5px;padding:4px 6px;background:#eeffee;border-left:3px solid #4f8310;color:#255;font-size:11px;";
          ans.innerHTML = "<b>ответ:</b> " + p.a;
          el.appendChild(ans);
        }
        root.appendChild(el);
      });
      // удаление
      var dels = root.querySelectorAll(".del");
      for (var di = 0; di < dels.length; di++) {
        (function (d) {
          d.onclick = function () {
            var idx = parseInt(d.getAttribute("data-i"), 10);
            posts.splice(idx, 1);
            save();
            render();
            toast("Запись удалена. Админ видит ВСЁ, так что думай!");
          };
        })(dels[di]);
      }
    }
    render();

    var form = document.querySelector("[data-gb-form]");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var nm = form.qs ? "" :""; // noop
        var name = form.querySelector('[name="name"]').value.trim() || "Анонимус";
        var text = form.querySelector('[name="text"]').value.trim();
        if (!text) { toast("Пустую запись нельзя! Напиши хоть «ку»."); return; }
        posts.unshift({ n: name, d: nowStr(), t: text, a: null, uid: uid() });
        if (posts.length > 60) posts.length = 60;
        save();
        render();
        MC.broadcastGB();
        toast("Запись добавлена! Админ уже читает...");
        form.reset();
      });
    }
  }
  function initGBDeletes() { /* handled in render */ }

  /* ======== подпись в подвале: "лучше всего в 1024x768" ======== */
  function initBrowserNote() {
    var el = document.querySelector("[data-browser]");
    if (!el) return;
    el.textContent = "Лучше всего смотрится в 1024x768 при скорости 1 Мбит. Проверено в IE6, Firefox 3.6, Chrome.";
  }

  /* ======== убрать лишние фишки ======== */
  var PAGE = document.body.getAttribute("data-page");

  /* ======== запуск ======== */
  document.addEventListener("DOMContentLoaded", function () {
    initArts();
    initCounter();
    initOnline();
    initClock();
    initPoll();
    initNewsletter();
    initTips();
    initRain();
    initFilters();
    initGuestbook();
    initBrowserNote();
    var sc = initScenes();
    // сцены для галереи, собрать вручную
    var gall = document.querySelectorAll("[data-shot]");
    for (var i = 0; i < gall.length; i++) {
      (function (box) {
        var spec = box.getAttribute("data-shot");
        if (!spec) return;
        var rows = spec.split("|").map(function (s) { return s.trim(); });
        var wrap = buildScene(rows, { sky: undefined });
        var f = box.querySelector(".scene-wrap");
        if (f) f.appendChild(wrap);
        var mob = box.getAttribute("data-mob");
        if (mob && f) {
          var m = artDOM(mob, 24);
          m.style.position = "absolute";
          m.style.right = "22px";
          m.style.bottom = "30px";
          wrap.appendChild(m);
        }
      })(gall[i]);
    }
  });

  // публичное API для P2P-модуля (p2p.js)
  MC.toast = toast;
  MC.onlineSet = function (n) {
    if (typeof n !== "number" || n <= 0) return;
    var es = document.querySelectorAll("[data-online]");
    for (var i = 0; i < es.length; i++) es[i].textContent = n;
  };
  MC.makeArt = artDOM;

})();