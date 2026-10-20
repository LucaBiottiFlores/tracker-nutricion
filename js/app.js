(function () {
  "use strict";

  // Compatibilidad con navegadores móviles antiguos (sin padStart / Object.assign / Math.log10)
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (len, ch) {
      var s = String(this), c = ch == null ? " " : String(ch);
      while (s.length < len) s = c + s;
      return s;
    };
  }
  if (typeof Object.assign !== "function") {
    Object.assign = function (t) {
      for (var i = 1; i < arguments.length; i++) {
        var s = arguments[i];
        if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k];
      }
      return t;
    };
  }
  if (typeof Math.log10 !== "function") {
    Math.log10 = function (x) { return Math.log(x) / Math.LN10; };
  }

  var STORAGE_KEY = "trackerNutricion";
  var UNIT_LABELS = {
    taza: "taza", cda: "cucharada", cdta: "cucharadita", unidad: "unidad",
    porcion: "porción", lata: "lata", botella: "botella", vaso: "vaso",
    copa: "copa", trago: "trago"
  };

  var MICROS = [
    ["fiber", "Fibra (g)"], ["sugar", "Azúcar (g)"], ["sodium", "Sodio (mg)"],
    ["satfat", "Grasa sat. (g)"], ["calcium", "Calcio (mg)"], ["iron", "Hierro (mg)"],
    ["potassium", "Potasio (mg)"], ["vitc", "Vitamina C (mg)"]
  ];

  // ---- Supabase ----
  var SB_URL = (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || "";
  var SB_KEY = (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || "";
  function looksReal() {
    if (!SB_URL || !SB_KEY) return false;
    if (/YOUR|PASTE|EXAMPLE|TU_PROYECTO/i.test(SB_URL + " " + SB_KEY)) return false;
    return /^https:\/\/.+\.supabase\.co/.test(SB_URL) && /^eyJ/.test(SB_KEY);
  }
  var sb = null;
  if (window.supabase && looksReal()) {
    try {
      sb = window.supabase.createClient(SB_URL, SB_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce"
        }
      });
    } catch (e) { sb = null; }
  }
  var currentUser = null;

  function dateKey(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function parseKey(k) {
    var p = k.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function defaultState() {
    return {
      targets: { kcal: 1750, prot: 125, carb: 180, fat: 60 },
      height: 166,
      goal: "cut",
      entries: {},
      body: {}
    };
  }

  function load() {
    var s = defaultState();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        s.targets = Object.assign(s.targets, parsed.targets || {});
        s.height = parsed.height || 166;
        s.goal = parsed.goal || "cut";
        s.entries = parsed.entries || {};
        s.body = parsed.body || {};
      }
    } catch (e) {}
    return s;
  }

  var state = load();
  var selectedDate = new Date();
  var selectedFood = null;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    prevDay: $("prevDay"), nextDay: $("nextDay"), todayBtn: $("todayBtn"),
    dateLabel: $("dateLabel"),
    sumKcal: $("sumKcal"), sumKcalTarget: $("sumKcalTarget"), kcalBar: $("kcalBar"),
    sumProt: $("sumProt"), sumProtTarget: $("sumProtTarget"),
    sumCarb: $("sumCarb"), sumCarbTarget: $("sumCarbTarget"),
    sumFat: $("sumFat"), sumFatTarget: $("sumFatTarget"),
    microList: $("microList"),
    foodSearch: $("foodSearch"), foodList: $("foodList"),
    foodQty: $("foodQty"), foodUnit: $("foodUnit"), foodForm: $("foodForm"), addBtn: $("addBtn"),
    entryList: $("entryList"), emptyEntry: $("emptyEntry"),
    bodyForm: $("bodyForm"), bodyWeight: $("bodyWeight"), bodyWaist: $("bodyWaist"), bodyNeck: $("bodyNeck"),
    bfNow: $("bfNow"), bodyList: $("bodyList"), emptyBody: $("emptyBody"),
    chartWrap: $("chartWrap"), weightChart: $("weightChart"), bfChart: $("bfChart"),
    targetForm: $("targetForm"), tKcal: $("tKcal"), tProt: $("tProt"), tCarb: $("tCarb"), tFat: $("tFat"), tHeight: $("tHeight"),
    exportBtn: $("exportBtn"), copyBtn: $("copyBtn"), importBtn: $("importBtn"), importFile: $("importFile"),
    authStatus: $("authStatus"), authForm: $("authForm"), authEmail: $("authEmail"), signInBtn: $("signInBtn"), signOutBtn: $("signOutBtn"),
    calcForm: $("calcForm"), cSex: $("cSex"), cAge: $("cAge"), cHeight: $("cHeight"), cWeight: $("cWeight"), cActivity: $("cActivity"), cGoal: $("cGoal"), cProt: $("cProt"), cFatPct: $("cFatPct"),
    calcResult: $("calcResult"), rBMR: $("rBMR"), rTDEE: $("rTDEE"), rKcal: $("rKcal"), rProt: $("rProt"), rCarb: $("rCarb"), rFat: $("rFat"), rProtNote: $("rProtNote"), calcNote: $("calcNote"), applyBtn: $("applyBtn"),
    plateau: $("plateau"),
    toast: $("toast")
  };

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    pushRemote();
  }

  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(el.toast._t);
    el.toast._t = setTimeout(function () { el.toast.hidden = true; }, 2200);
  }

  // ---- Fecha ----
  function fmtDate(d) {
    var dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return dias[d.getDay()] + " " + d.getDate() + " " + meses[d.getMonth()];
  }

  function setDate(d) {
    selectedDate = d;
    el.dateLabel.textContent = fmtDate(d);
    renderAll();
  }

  // ---- Totales del día ----
  function dayTotals() {
    var key = dateKey(selectedDate);
    var list = state.entries[key] || [];
    var t = { kcal: 0, prot: 0, carb: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, satfat: 0, calcium: 0, iron: 0, potassium: 0, vitc: 0 };
    list.forEach(function (e) {
      t.kcal += e.kcal || 0;
      t.prot += e.prot || 0;
      t.carb += e.carb || 0;
      t.fat += e.fat || 0;
      t.fiber += e.fiber || 0;
      t.sugar += e.sugar || 0;
      t.sodium += e.sodium || 0;
      t.satfat += e.satfat || 0;
      t.calcium += e.calcium || 0;
      t.iron += e.iron || 0;
      t.potassium += e.potassium || 0;
      t.vitc += e.vitc || 0;
    });
    return t;
  }

  function renderSummary() {
    var t = dayTotals();
    var g = state.targets;
    el.sumKcal.textContent = Math.round(t.kcal);
    el.sumKcalTarget.textContent = g.kcal;
    el.sumProt.textContent = Math.round(t.prot);
    el.sumProtTarget.textContent = "/ " + g.prot + " g";
    el.sumCarb.textContent = Math.round(t.carb);
    el.sumCarbTarget.textContent = "/ " + g.carb + " g";
    el.sumFat.textContent = Math.round(t.fat);
    el.sumFatTarget.textContent = "/ " + g.fat + " g";

    var pct = g.kcal > 0 ? Math.min(120, (t.kcal / g.kcal) * 100) : 0;
    el.kcalBar.style.width = pct + "%";
    el.kcalBar.classList.toggle("over", t.kcal > g.kcal);

    var html = "";
    MICROS.forEach(function (pair) {
      var key = pair[0], label = pair[1];
      var v = t[key] || 0;
      var shown = key === "sodium" ? Math.round(v) : (Math.round(v * 10) / 10);
      html += "<li><span>" + label + "</span><b>" + shown + "</b></li>";
    });
    el.microList.innerHTML = html;
  }

  // ---- Comidas ----
  function populateDatalist() {
    var frag = document.createDocumentFragment();
    window.FOODS.forEach(function (f) {
      var o = document.createElement("option");
      o.value = f.n;
      frag.appendChild(o);
    });
    el.foodList.appendChild(frag);
  }

  function findFood(name) {
    name = (name || "").trim().toLowerCase();
    for (var i = 0; i < window.FOODS.length; i++) {
      if (window.FOODS[i].n.toLowerCase() === name) return window.FOODS[i];
    }
    return null;
  }

  function renderUnits(food) {
    el.foodUnit.innerHTML = "";
    var opts = [];
    Object.keys(food.u || {}).forEach(function (key) {
      var g = food.u[key];
      var label = (UNIT_LABELS[key] || key) + " (" + g + " g)";
      opts.push('<option value="' + key + '">' + label + "</option>");
    });
    opts.push('<option value="g">gramos (g)</option>');
    opts.push('<option value="ml">mililitros (ml)</option>');
    el.foodUnit.innerHTML = opts.join("");
    el.addBtn.disabled = false;
  }

  function onFoodInput() {
    var f = findFood(el.foodSearch.value);
    if (f) {
      selectedFood = f;
      renderUnits(f);
    } else {
      selectedFood = null;
      el.foodUnit.innerHTML = '<option value="">—elige alimento—</option>';
      el.addBtn.disabled = true;
    }
  }

  function addEntry(e) {
    e.preventDefault();
    if (!selectedFood) { toast("Elige un alimento de la lista"); return; }
    var qty = parseFloat(el.foodQty.value);
    if (!(qty > 0)) { toast("Pon una cantidad válida"); return; }
    var unit = el.foodUnit.value;
    var grams;
    if (unit === "g" || unit === "ml") {
      grams = qty;
    } else {
      grams = qty * (selectedFood.u[unit] || 100);
    }
    var mul = grams / 100;
    var entry = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: selectedFood.n,
      qty: qty,
      unit: unit,
      grams: Math.round(grams * 10) / 10,
      kcal: r2(selectedFood.kcal * mul),
      prot: r2(selectedFood.prot * mul),
      carb: r2(selectedFood.carb * mul),
      fat: r2(selectedFood.fat * mul),
      fiber: r2(selectedFood.fiber * mul),
      sugar: r2(selectedFood.sugar * mul),
      sodium: r2(selectedFood.sodium * mul),
      satfat: r2(selectedFood.satfat * mul),
      calcium: r2(selectedFood.calcium * mul),
      iron: r2(selectedFood.iron * mul),
      potassium: r2(selectedFood.potassium * mul),
      vitc: r2(selectedFood.vitc * mul)
    };
    var key = dateKey(selectedDate);
    if (!state.entries[key]) state.entries[key] = [];
    state.entries[key].push(entry);
    save();
    el.foodQty.value = 1;
    renderAll();
    toast("Agregado: " + entry.name);
  }

  function r2(n) { return Math.round((n || 0) * 10) / 10; }

  function deleteEntry(id) {
    var key = dateKey(selectedDate);
    if (!state.entries[key]) return;
    state.entries[key] = state.entries[key].filter(function (e) { return e.id !== id; });
    if (!state.entries[key].length) delete state.entries[key];
    save();
    renderAll();
  }

  function renderEntries() {
    var key = dateKey(selectedDate);
    var list = state.entries[key] || [];
    el.emptyEntry.hidden = list.length > 0;
    el.entryList.innerHTML = "";
    list.forEach(function (e) {
      var li = document.createElement("li");
      var unitLabel = (e.unit === "g" || e.unit === "ml") ? e.unit : (UNIT_LABELS[e.unit] || e.unit);
      var sub = e.qty + " " + unitLabel + " · " + e.grams + " g";
      li.innerHTML =
        '<div class="info"><div class="name"></div><div class="sub"></div></div>' +
        '<span class="kcal"></span>' +
        '<button class="del" aria-label="Eliminar">&times;</button>';
      li.querySelector(".name").textContent = e.name;
      li.querySelector(".sub").textContent = sub;
      li.querySelector(".kcal").textContent = Math.round(e.kcal) + " kcal";
      li.querySelector(".del").addEventListener("click", function () { deleteEntry(e.id); });
      el.entryList.appendChild(li);
    });
  }

  // ---- Cuerpo ----
  function navyBodyFat(waist, neck, height) {
    if (!(waist > neck) || !(height > 0)) return null;
    var d = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
    var bf = (4.95 / d - 4.5) * 100;
    return Math.max(0, Math.round(bf * 10) / 10);
  }

  function addBody(e) {
    e.preventDefault();
    var w = parseFloat(el.bodyWeight.value);
    var waist = parseFloat(el.bodyWaist.value);
    var neck = parseFloat(el.bodyNeck.value);
    if (!(w > 0) && !(waist > 0) && !(neck > 0)) { toast("Pon al menos un dato"); return; }
    var bf = navyBodyFat(waist, neck, state.height);
    var entry = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      weight: w || null,
      waist: waist || null,
      neck: neck || null,
      bf: bf
    };
    var key = dateKey(selectedDate);
    if (!state.body[key]) state.body[key] = [];
    state.body[key].push(entry);
    save();
    el.bodyWeight.value = ""; el.bodyWaist.value = ""; el.bodyNeck.value = "";
    renderAll();
    toast(bf != null ? "Guardado · % grasa est.: " + bf + "%" : "Guardado");
  }

  function deleteBody(id) {
    var key = dateKey(selectedDate);
    if (!state.body[key]) return;
    state.body[key] = state.body[key].filter(function (e) { return e.id !== id; });
    if (!state.body[key].length) delete state.body[key];
    save();
    renderAll();
  }

  function sortedBody() {
    var arr = [];
    Object.keys(state.body).forEach(function (k) {
      (state.body[k] || []).forEach(function (e) { arr.push({ date: k, e: e }); });
    });
    arr.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    return arr;
  }

  function renderBody() {
    var arr = sortedBody();
    el.emptyBody.hidden = arr.length > 0;
    el.bodyList.innerHTML = "";
    arr.forEach(function (item) {
      var e = item.e;
      var li = document.createElement("li");
      var parts = [];
      if (e.weight != null) parts.push(e.weight + " kg");
      if (e.waist != null) parts.push(e.waist + " cm cintura");
      var bfTxt = e.bf != null ? " · " + e.bf + "% grasa" : "";
      li.innerHTML =
        '<div><div class="main">' + fmtShort(item.date) + "</div>" +
        '<div class="sub">' + parts.join(" · ") + bfTxt + "</div></div>" +
        '<button class="del" aria-label="Eliminar">&times;</button>';
      li.querySelector(".del").addEventListener("click", function () { deleteBody(e.id); });
      el.bodyList.appendChild(li);
    });
    renderCharts(arr);
  }

  function fmtShort(k) {
    var d = parseKey(k);
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function renderCharts(arr) {
    var weights = arr.filter(function (i) { return i.e.weight != null; });
    var bfs = arr.filter(function (i) { return i.e.bf != null; });
    el.chartWrap.hidden = weights.length < 2 && bfs.length < 2;
    if (el.chartWrap.hidden) return;
    el.weightChart.innerHTML = weights.length >= 2 ? lineChart(weights.map(function (i) { return { d: i.date, v: i.e.weight }; }), "kg") : '<p class="hint">Necesitas al menos 2 pesajes.</p>';
    el.bfChart.innerHTML = bfs.length >= 2 ? lineChart(bfs.map(function (i) { return { d: i.date, v: i.e.bf }; }), "%") : '<p class="hint">Necesitas al menos 2 mediciones con cintura y cuello.</p>';
  }

  function lineChart(points, unit) {
    var W = 320, H = 120, pad = 14;
    var values = points.map(function (p) { return p.v; });
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    if (max - min < 0.5) { max += 0.5; min -= 0.5; }
    var n = points.length;
    var step = (W - pad * 2) / Math.max(1, n - 1);
    var coords = points.map(function (p, i) {
      var x = pad + i * step;
      var y = H - pad - ((p.v - min) / (max - min)) * (H - pad * 2);
      return { x: x, y: y, p: p };
    });
    var line = coords.map(function (c) { return c.x.toFixed(1) + "," + c.y.toFixed(1); }).join(" ");
    var dots = coords.map(function (c) {
      return '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="3" fill="#22c55e"></circle>';
    }).join("");
    var last = coords[coords.length - 1];
    var label = '<text x="' + last.x.toFixed(1) + '" y="' + (last.y - 7).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#17181a">' + last.p.v + " " + unit + "</text>";
    return '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg">' +
      '<polyline points="' + line + '" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>' +
      dots + label + "</svg>";
  }

  // ---- Ajustes ----
  function renderSettings() {
    el.tKcal.value = state.targets.kcal;
    el.tProt.value = state.targets.prot;
    el.tCarb.value = state.targets.carb;
    el.tFat.value = state.targets.fat;
    el.tHeight.value = state.height;
  }

  function saveTargets(e) {
    e.preventDefault();
    state.targets.kcal = num(el.tKcal.value, 1650);
    state.targets.prot = num(el.tProt.value, 125);
    state.targets.carb = num(el.tCarb.value, 200);
    state.targets.fat = num(el.tFat.value, 70);
    state.height = num(el.tHeight.value, 166);
    save();
    renderAll();
    toast("Objetivos guardados");
  }

  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }

  // ---- Respaldo ----
  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tracker-nutricion-" + dateKey(new Date()) + ".json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
  }

  function copyData() {
    var txt = JSON.stringify(state);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { toast("Datos copiados"); }, function () { toast("No se pudo copiar"); });
    } else {
      toast("Copia manual no disponible");
    }
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object") throw new Error();
        state = Object.assign(defaultState(), parsed);
        state.targets = Object.assign(defaultState().targets, parsed.targets || {});
        save();
        renderAll();
        toast("Datos importados");
      } catch (err) {
        toast("Archivo no válido");
      }
    };
    reader.readAsText(file);
  }

  // ---- Sincronización Supabase ----
  function pushRemote() {
    if (!sb || !currentUser) return;
    var payload = { user_id: currentUser.id, data: state, updated_at: new Date().toISOString() };
    sb.from("nutrition_state").upsert(payload, { onConflict: "user_id" })
      .then(function (r) { if (r.error) console.warn("sync push:", r.error.message); })
      .catch(function (e) { console.warn("sync push:", e); });
  }

  function fetchRemote() {
    return sb.from("nutrition_state")
      .select("data")
      .eq("user_id", currentUser.id)
      .maybeSingle()
      .then(function (r) {
        if (r.error) throw r.error;
        return r.data ? r.data.data : null;
      });
  }

  function unionRecords(local, remote) {
    var map = {};
    function add(src) {
      Object.keys(src || {}).forEach(function (k) {
        map[k] = map[k] || {};
        (src[k] || []).forEach(function (e) { if (e && e.id) map[k][e.id] = e; });
      });
    }
    add(local); add(remote);
    var out = {};
    Object.keys(map).forEach(function (k) {
      out[k] = Object.keys(map[k]).map(function (id) { return map[k][id]; });
    });
    return out;
  }

  function mergeRemote(remote) {
    if (!remote || typeof remote !== "object") return;
    var d = defaultState();
    state.targets = Object.assign({}, d.targets, remote.targets || state.targets);
    state.height = remote.height || state.height;
    state.entries = unionRecords(state.entries, remote.entries);
    state.body = unionRecords(state.body, remote.body);
    save();
  }

  function onSignedIn(user) {
    currentUser = user;
    renderAuth();
    toast("Conectado · sincronizando...");
    fetchRemote()
      .then(function (remote) {
        mergeRemote(remote);
        renderAll();
        toast("Sincronizado");
      })
      .catch(function (e) {
        renderAll();
        toast("Conectado (sin datos previos en la nube)");
      });
  }

  function onSignedOut() {
    currentUser = null;
    renderAuth();
  }

  function signIn(e) {
    e.preventDefault();
    if (!sb) { toast("Supabase no está configurado aún"); return; }
    var email = (el.authEmail.value || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Escribe un correo válido"); return; }
    var redirectTo = window.location.origin + window.location.pathname;
    el.signInBtn.disabled = true;
    sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectTo } })
      .then(function (r) {
        el.signInBtn.disabled = false;
        if (r.error) throw r.error;
        toast("Revisa tu correo y haz click en el enlace");
      })
      .catch(function (err) {
        el.signInBtn.disabled = false;
        toast("No se pudo enviar el correo");
        console.warn(err);
      });
  }

  function signOut() {
    if (sb) sb.auth.signOut();
    onSignedOut();
  }

  function renderAuth() {
    if (!sb) {
      el.authStatus.textContent = "Supabase no configurado: modo local (sin nube).";
      el.authEmail.disabled = true;
      el.signInBtn.disabled = true;
      el.signOutBtn.hidden = true;
      return;
    }
    if (currentUser) {
      el.authStatus.textContent = "Conectado como " + (currentUser.email || currentUser.id) + ". Todo se guarda en la nube y se sincroniza.";
      el.authEmail.disabled = true;
      el.signInBtn.disabled = true;
      el.signOutBtn.hidden = false;
    } else {
      el.authStatus.textContent = "Sin conexión: tus datos quedan solo en este navegador.";
      el.authEmail.disabled = false;
      el.signInBtn.disabled = false;
      el.signOutBtn.hidden = true;
    }
  }

  // ---- Calculadora y estancamiento ----
  var lastCalc = null;

  function calcGoals(e) {
    e.preventDefault();
    var sex = el.cSex.value;
    var age = num(el.cAge.value, 33);
    var h = num(el.cHeight.value, 166);
    var w = num(el.cWeight.value, 77);
    var act = parseFloat(el.cActivity.value) || 1.55;
    var goal = el.cGoal.value;
    var protKg = num(el.cProt.value, 1.6);
    var fatPct = num(el.cFatPct.value, 30) / 100;

    if (!(age > 0) || !(h > 0) || !(w > 0)) { toast("Completa edad, estatura y peso"); return; }

    var bmr = sex === "m"
      ? 10 * w + 6.25 * h - 5 * age + 5
      : 10 * w + 6.25 * h - 5 * age - 161;
    var tdee = bmr * act;
    var kcal;
    if (goal === "cut") kcal = tdee * 0.8;
    else if (goal === "bulk") kcal = tdee * 1.1;
    else kcal = tdee;

    var prot = w * protKg;
    var fat = (kcal * fatPct) / 9;
    var carb = (kcal - prot * 4 - fat * 9) / 4;
    if (carb < 0) carb = 0;

    lastCalc = { kcal: Math.round(kcal), prot: Math.round(prot), carb: Math.round(carb), fat: Math.round(fat), height: h, goal: goal };

    el.rBMR.textContent = Math.round(bmr) + " kcal";
    el.rTDEE.textContent = Math.round(tdee) + " kcal";
    el.rKcal.textContent = Math.round(kcal) + " kcal";
    el.rProt.textContent = Math.round(prot) + " g";
    el.rCarb.textContent = Math.round(carb) + " g";
    el.rFat.textContent = Math.round(fat) + " g";
    el.rProtNote.textContent = "/ " + protKg + " g/kg";
    el.calcNote.textContent = "Método Mifflin-St Jeor · " + (goal === "cut" ? "déficit −20%" : goal === "bulk" ? "superávit +10%" : "mantenimiento") + " · proteína " + protKg + " g/kg · grasa " + Math.round(fatPct * 100) + "% de las kcal. Es un punto de partida: ajústalo según cómo responde tu cuerpo.";
    el.calcResult.hidden = false;
  }

  function applyCalc() {
    if (!lastCalc) return;
    state.targets.kcal = lastCalc.kcal;
    state.targets.prot = lastCalc.prot;
    state.targets.carb = lastCalc.carb;
    state.targets.fat = lastCalc.fat;
    if (lastCalc.height) state.height = lastCalc.height;
    state.goal = lastCalc.goal;
    save();
    renderAll();
    toast("Objetivos actualizados");
  }

  function prefillCalc() {
    el.cAge.value = 33;
    el.cHeight.value = state.height || 166;
    var arr = sortedBody().filter(function (i) { return i.e.weight != null; });
    el.cWeight.value = arr.length ? arr[arr.length - 1].e.weight : "";
    el.cGoal.value = state.goal || "cut";
  }

  function fmtRate(n) { return (Math.round(n * 100) / 100).toString().replace(".", ","); }

  function renderPlateau() {
    var goal = state.goal || "cut";
    var box = el.plateau;
    var wpts = sortedBody().filter(function (i) { return i.e.weight != null; });

    if (wpts.length < 3) {
      box.innerHTML = '<div class="verdict na">Registra tu peso al menos 1 vez por semana durante 3 semanas para evaluar si estás estancado.</div>';
      return;
    }
    var first = wpts[0], last = wpts[wpts.length - 1];
    var days = (parseKey(last.date) - parseKey(first.date)) / 864e5;
    var weeks = days / 7;
    if (weeks < 2.5) {
      box.innerHTML = '<div class="verdict na">Llevas ' + Math.round(days) + ' días de datos. Necesitas ~3 semanas para detectar un estancamiento real.</div>';
      return;
    }
    var rate = (last.e.weight - first.e.weight) / weeks; // kg/semana

    var wst = sortedBody().filter(function (i) { return i.e.waist != null; });
    var waistRate = null;
    if (wst.length >= 2) {
      var wf = wst[0], wl = wst[wst.length - 1];
      var wdays = (parseKey(wl.date) - parseKey(wf.date)) / 864e5;
      if (wdays >= 14) waistRate = (wl.e.waist - wf.e.waist) / (wdays / 7);
    }

    var verdict = "", cls = "", suggestions = [];

    if (goal === "maintain" || goal === "bulk") {
      if (Math.abs(rate) < 0.1) {
        verdict = "Tu peso se mantiene estable, justo lo esperado para tu objetivo.";
        cls = "ok";
      } else if (rate > 0.1 && goal === "bulk") {
        verdict = "Vas subiendo ~" + fmtRate(rate) + " kg/semana. Buen ritmo de ganancia.";
        cls = "ok";
      } else {
        verdict = "Tu peso está cambiando más de lo esperado para tu objetivo.";
        cls = "warn";
        suggestions = ["Revisa tu ingesta real y ajusta ±100–200 kcal según quieras frenar o acelerar."];
      }
    } else {
      if (rate <= -0.25) {
        verdict = "Buen ritmo: bajas ~" + fmtRate(Math.abs(rate)) + " kg/semana. Sigue igual.";
        cls = "ok";
      } else if (rate > -0.1) {
        if (waistRate != null && waistRate <= -0.5) {
          verdict = "Tu peso está estable pero tu cintura sigue bajando (~" + fmtRate(Math.abs(waistRate)) + " cm/semana): estás recomponiendo (pierdes grasa y ganas músculo). No es estancamiento.";
          cls = "ok";
        } else {
          verdict = "Posible estancamiento: llevas " + Math.round(weeks) + " semanas sin bajar de peso.";
          cls = "warn";
          suggestions = [
            "Recalcula tus calorías: al pesar menos, tu TDEE baja. Baja −5 a −10% de kcal (≈100–200 kcal).",
            "Revisa el registro: aceite, salsas y porciones 'a ojo' son la causa #1 de estancamiento. Pesa en seco/crudo.",
            "Sube el NEAT: apunta a 7.000–10.000 pasos/día además del gimnasio.",
            "Mantén proteína alta (1.6–2.2 g/kg) y entrena fuerza para no perder músculo.",
            "Si llevas >8–12 semanas en déficit, haz una 'diet break' de 1–2 semanas a mantenimiento."
          ];
        }
      } else {
        verdict = "Vas lento (~" + fmtRate(Math.abs(rate)) + " kg/semana). Cerca del estancamiento.";
        cls = "warn";
        suggestions = [
          "Aprieta un poco el déficit (−100–150 kcal) o suma pasos diarios.",
          "Confirma que el registro esté completo: los snacks y líquidos también cuentan."
        ];
      }
    }

    var html = '<div class="verdict ' + cls + '">' + verdict + "</div>";
    if (suggestions.length) {
      html += "<ul>";
      suggestions.forEach(function (s) { html += "<li>" + s + "</li>"; });
      html += "</ul>";
    }
    box.innerHTML = html;
  }

  // ---- Tabs ----
  function switchTab(name) {
    document.querySelectorAll(".tab").forEach(function (b) {
      b.classList.toggle("active", b.dataset.tab === name);
    });
    document.querySelectorAll(".panel").forEach(function (p) {
      p.classList.toggle("active", p.dataset.panel === name);
    });
  }

  function renderAll() {
    renderSummary();
    renderEntries();
    renderBody();
    renderPlateau();
    renderSettings();
    renderAuth();
  }

  // ---- Init ----
  populateDatalist();
  renderSettings();
  prefillCalc();
  setDate(new Date());

  el.prevDay.addEventListener("click", function () { setDate(new Date(selectedDate.getTime() - 864e5)); });
  el.nextDay.addEventListener("click", function () { setDate(new Date(selectedDate.getTime() + 864e5)); });
  el.todayBtn.addEventListener("click", function () { setDate(new Date()); });

  el.foodSearch.addEventListener("input", onFoodInput);
  el.foodSearch.addEventListener("change", onFoodInput);
  el.foodForm.addEventListener("submit", addEntry);

  el.bodyForm.addEventListener("submit", addBody);
  el.targetForm.addEventListener("submit", saveTargets);

  el.calcForm.addEventListener("submit", calcGoals);
  el.applyBtn.addEventListener("click", applyCalc);

  el.authForm.addEventListener("submit", signIn);
  el.signOutBtn.addEventListener("click", signOut);

  el.exportBtn.addEventListener("click", exportData);
  el.copyBtn.addEventListener("click", copyData);
  el.importBtn.addEventListener("click", function () { el.importFile.click(); });
  el.importFile.addEventListener("change", function () {
    if (el.importFile.files[0]) importData(el.importFile.files[0]);
    el.importFile.value = "";
  });

  document.querySelectorAll(".tab").forEach(function (b) {
    b.addEventListener("click", function () { switchTab(b.dataset.tab); });
  });

  // Restaurar sesión de Supabase si ya existía.
  if (sb) {
    sb.auth.getSession().then(function (res) {
      if (res.data && res.data.session) onSignedIn(res.data.session.user);
    }).catch(function () {});
    sb.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_IN" && session) onSignedIn(session.user);
      else if (event === "SIGNED_OUT") onSignedOut();
    });
  }
})();
