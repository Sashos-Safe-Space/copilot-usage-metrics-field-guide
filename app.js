(function () {
  "use strict";
  const { DOC, SOURCES, REPORTS, RECORDS, GROUPS, FIELDS, QUESTIONS, TRACE } = window.NDJ;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HUES = { agg1: 255, agg28: 292, u1: 152, u28: 196, teams: 72, repos: 24 };

  /* ---------- Extra synthetic users for the hero file ---------- */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const base = RECORDS.u1.data;
  const dev02 = clone(base);
  Object.assign(dev02, { user_id: 5002, user_login: "dev-02", ai_adoption_phase: { phase: "Phase 1", phase_number: 1, version: "v1" }, ai_credits_used: 3.0, used_cli: false, used_agent: false });
  delete dev02.totals_by_cli;
  dev02.totals_by_feature = dev02.totals_by_feature.filter((f) => f.feature === "code_completion" || f.feature === "agent_edit");
  dev02.user_initiated_interaction_count = 0;
  dev02.totals_by_ide[0].user_initiated_interaction_count = 0;
  dev02.totals_by_client = [];
  dev02.totals_by_skill = []; dev02.totals_by_mcp = []; dev02.totals_by_slash_cmd = [];
  dev02.distinct_skill_use_count = 0; dev02.distinct_mcp_use_count = 0; dev02.distinct_slash_cmd_use_count = 0;

  const dev03 = {
    day: "2026-10-19", enterprise_id: "100", organization_id: "200", user_id: 5003, user_login: "dev-03",
    ai_adoption_phase: { phase: "No Cohort", phase_number: 0, version: "v1" },
    ai_credits_used: 1.5, user_initiated_interaction_count: 6, code_generation_activity_count: 0, code_acceptance_activity_count: 0,
    loc_suggested_to_add_sum: 0, loc_suggested_to_delete_sum: 0, loc_added_sum: 0, loc_deleted_sum: 0,
    used_chat: true, used_agent: false, used_cli: false, used_copilot_app: false, used_copilot_cloud_agent: false, used_copilot_coding_agent: false,
    used_copilot_code_review_active: null, used_copilot_code_review_passive: null, used_local_byok: false,
    client_telemetry_present: true, usage_metrics_requirements: { met: ["vscode", "vscode/copilot-chat"], unmet: [], unknown: [] },
    totals_by_feature: [{ feature: "chat_panel_ask_mode", user_initiated_interaction_count: 6, code_generation_activity_count: 0, code_acceptance_activity_count: 0, loc_suggested_to_add_sum: 0, loc_suggested_to_delete_sum: 0, loc_added_sum: 0, loc_deleted_sum: 0 }],
    totals_by_ide: [{ ide: "vscode", user_initiated_interaction_count: 6, code_generation_activity_count: 0, code_acceptance_activity_count: 0, loc_suggested_to_add_sum: 0, loc_suggested_to_delete_sum: 0, loc_added_sum: 0, loc_deleted_sum: 0 }],
    totals_by_language_feature: [], totals_by_language_model: [], totals_by_model_feature: [], totals_by_client: [],
  };
  const USERS = [
    { data: base, label: "dev-01 · Phase 2 · used Copilot CLI" },
    { data: dev02, label: "dev-02 · Phase 1 · completions and agent edits" },
    { data: dev03, label: "dev-03 · No Cohort · chat questions only" },
  ];

  /* ---------- Hero ---------- */
  function heroLines() {
    const ol = $("#hero-lines");
    ol.innerHTML = USERS.map((u, i) => {
      const raw = esc(JSON.stringify(u.data)).replace(/,/g, ",<wbr>").replace(/&quot;(user_login|ai_adoption_phase|user_id)&quot;/g, "<b>&quot;$1&quot;</b>");
      return `<li><button type="button" data-user="${i}" aria-label="Line ${i + 1}: ${esc(u.label)}. Open in the record reader."><span class="ln" aria-hidden="true"></span><span><span class="lbl">${esc(u.label)}</span><span class="raw">${raw}</span></span></button></li>`;
    }).join("");
    ol.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-user]");
      if (!b) return;
      state.user = +b.dataset.user;
      openRecord("u1", "user_login");
    });
  }

  /* ---------- Report map ---------- */
  const SVGNS = "http://www.w3.org/2000/svg";
  const W = 210, H = 78;
  const POS = { agg1: [4, 22], u1: [495, 22], teams: [986, 22], agg28: [4, 200], u28: [495, 200], repos: [986, 200] };
  const MAPTXT = {
    agg1: ["organization-1-day", "enterprise-1-day", "1 line: whole org, 1 day"],
    agg28: ["organization-28-day", "enterprise-28-day", "1 line: 28 daily totals"],
    u1: ["users-1-day", "", "1 line: 1 user, 1 day"],
    u28: ["users-28-day", "", "1 line: 1 user, each day"],
    teams: ["user-teams-1-day", "", "1 line: 1 user + 1 team"],
    repos: ["repos-1-day", "", "1 line: 1 repository, 1 day"],
  };
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function label(svg, x, y, lines, opts = {}) {
    const g = el("g", { class: "m-label" }, svg);
    const lh = 18, padX = 8, padY = 6;
    const wMax = Math.max(...lines.map((l) => l.t.length)) * 7.6;
    const anchor = opts.anchor || "middle";
    const x0 = anchor === "middle" ? x - wMax / 2 - padX : anchor === "start" ? x - padX : x - wMax - padX;
    el("rect", { x: x0, y: y - padY - 13, width: wMax + padX * 2, height: lines.length * lh + padY * 2 - 4, rx: 6 }, g);
    lines.forEach((l, i) => {
      const t = el("text", { x, y: y + i * lh, "text-anchor": anchor, class: l.c || "" }, g);
      t.textContent = l.t;
    });
    return g;
  }
  function buildMap() {
    const svg = $("#map");
    svg.setAttribute("viewBox", "0 0 1200 326");
    const c = (k) => `var(--${k})`;
    const mid = (k) => [POS[k][0] + W / 2, POS[k][1] + H / 2];
    const edges = [];
    const path = (d, cls, color) => {
      const a = { d, class: "m-edge " + cls };
      if (color) a.stroke = color;
      if (/\bdraw\b/.test(cls)) a.pathLength = 1;
      const p = el("path", a, svg); edges.push(p); return p;
    };

    // Vertical: daily totals to 28-day totals
    path(`M ${mid("agg1")[0]} ${POS.agg1[1] + H} V ${POS.agg28[1]}`, "draw", c("agg28"));
    // Vertical: users-1-day to users-28-day
    path(`M ${mid("u1")[0]} ${POS.u1[1] + H} V ${POS.u28[1]}`, "draw", c("u28"));
    // Join: users-1-day to user-teams
    path(`M ${POS.u1[0] + W} ${mid("u1")[1]} H ${POS.teams[0]}`, "draw", c("teams"));
    // Shared pull_requests shape: 28-day/1-day totals to repos, along the bottom
    path(`M ${mid("agg28")[0]} ${POS.agg28[1] + H} V 302 H ${mid("repos")[0]} V ${POS.repos[1] + H}`, "draw", c("repos"));
    // Do not join: users-28-day to user-teams, routed through the band between rows
    const tX = mid("teams")[0];
    path(`M ${POS.u28[0] + W} ${POS.u28[1] + 22} H ${POS.u28[0] + W + 30} L ${POS.u28[0] + W + 102} 150 H ${tX} V ${POS.teams[1] + H}`, "dash");
    // No shared key: totals to per-user
    path(`M ${POS.agg1[0] + W} ${mid("agg1")[1]} H ${POS.u1[0]}`, "dash grey");

    // Hubs and marks
    const hubX = (POS.u1[0] + W + POS.teams[0]) / 2;
    el("circle", { cx: hubX, cy: mid("u1")[1], r: 9, class: "m-hub" }, svg);
    const xm = (POS.u28[0] + W + 102 + tX) / 2, ym = 150;
    el("path", { d: `M ${xm - 9} ${ym - 9} L ${xm + 9} ${ym + 9} M ${xm + 9} ${ym - 9} L ${xm - 9} ${ym + 9}`, class: "m-x" }, svg);
    const gx = (POS.agg1[0] + W + POS.u1[0]) / 2;
    el("path", { d: `M ${gx - 8} ${mid("agg1")[1] - 8} L ${gx + 8} ${mid("agg1")[1] + 8} M ${gx + 8} ${mid("agg1")[1] - 8} L ${gx - 8} ${mid("agg1")[1] + 8}`, class: "m-x", style: "stroke: oklch(0.6 0.012 260)" }, svg);

    // Labels
    label(svg, hubX, mid("u1")[1] - 35, [{ t: "Match on user_id, day," }, { t: "and org or enterprise ID" }]);
    label(svg, hubX, mid("u1")[1] + 30, [{ t: "→ team metrics", c: "sub" }]);
    label(svg, mid("agg1")[0] + 14, POS.agg1[1] + H + 42, [{ t: "28 daily totals" }, { t: "inside day_totals", c: "sub" }], { anchor: "start" });
    label(svg, mid("u1")[0] + 14, POS.u1[1] + H + 42, [{ t: "Same fields," }, { t: "one record per day", c: "sub" }], { anchor: "start" });
    label(svg, gx, mid("agg1")[1] + 32, [{ t: "No user IDs" }, { t: "cannot split", c: "sub" }]);
    label(svg, xm, ym - 26, [{ t: "Do not join" }, { t: "28 days × 1-day teams", c: "sub" }]);
    label(svg, 600, 307, [{ t: "Same pull_requests object, also per repository" }]);

    // Nodes
    Object.keys(POS).forEach((k) => {
      const [x, y] = POS[k];
      const r = REPORTS[k];
      const g = el("g", { class: "m-node", tabindex: 0, role: "button", "aria-pressed": "false", "data-k": k, "aria-label": `${r.name}: ${r.grain}` }, svg);
      el("rect", { x: x + 1, y: y + 3, width: W - 2, height: H, rx: 12, class: "shadow" }, g);
      el("rect", { x, y, width: W, height: H, rx: 12, class: "card" }, g);
      el("rect", { x: x + 14, y, width: W - 28, height: 3, rx: 1.5, fill: c(r.color), class: "band" }, g);
      el("circle", { cx: x + 21, cy: y + 23, r: 6, class: "hole", stroke: c(r.color) }, g);
      const t1 = el("text", { x: x + 35, y: y + 29, class: "t1" }, g); t1.textContent = r.name;
      const [a, b, gr] = MAPTXT[k];
      const t2 = el("text", { x: x + 15, y: y + 50, class: "t2" }, g); t2.textContent = a;
      const t3 = el("text", { x: x + 15, y: y + 68, class: b ? "t2" : "t3" }, g); t3.textContent = b || gr;
      g.addEventListener("click", () => selectReport(k));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectReport(k); } });
    });

    // Draw-on, once
    const draw = () => edges.forEach((p, i) => {
      if (!p.classList.contains("draw")) return;
      p.style.transitionDelay = (i * 110) + "ms";
      p.classList.add("drawn");
    });
    if (reduceMotion || !("IntersectionObserver" in window)) { edges.forEach((p) => p.classList.remove("draw")); return; }
    const io = new IntersectionObserver((ents) => { if (ents.some((e) => e.isIntersecting)) { requestAnimationFrame(draw); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(svg);
  }

  function selectReport(k) {
    const r = REPORTS[k];
    $$(".m-node").forEach((n) => n.setAttribute("aria-pressed", String(n.dataset.k === k)));
    const card = $("#report-card");
    card.innerHTML = `
      <div>
        <h3>${esc(r.name)}</h3>
        <div class="ids">${r.ids.map((i) => `<span class="tag tag-${r.color}">${esc(i)}</span>`).join("")}</div>
        <p class="grain" style="margin-top:12px">${esc(r.grain)}</p>
      </div>
      <div><p class="k">Has</p><ul>${r.has.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>
      <div><p class="k">Does not have</p><ul>${r.lacks.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>
      <div>
        <p class="k">Organization endpoint</p>
        <div class="ep">GET ${esc(r.endpoint)}</div>
        <div class="actions">
          <button type="button" class="btn" data-open="${r.sample}">Read a sample record</button>
          <a href="${r.src}">Fields in GitHub Docs</a>
        </div>
      </div>`;
    $("[data-open]", card).addEventListener("click", (e) => openRecord(e.currentTarget.dataset.open));
  }

  /* ---------- Question finder ---------- */
  function buildFinder() {
    const list = $("#finder-list");
    list.innerHTML = QUESTIONS.map((q, i) => `<button type="button" class="q" role="option" aria-selected="false" data-i="${i}">${esc(q.q)}</button>`).join("");
    list.addEventListener("click", (e) => { const b = e.target.closest(".q"); if (b) pickQuestion(+b.dataset.i); });
    list.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const btns = $$(".q", list); const cur = btns.indexOf(document.activeElement);
      const next = btns[(cur + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length];
      next.focus(); pickQuestion(+next.dataset.i);
    });
    pickQuestion(0);
  }
  function pickQuestion(i) {
    const q = QUESTIONS[i];
    $$(".q").forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.i === i)));
    const tags = q.reports.length
      ? q.reports.map((k) => REPORTS[k].ids.map((id) => `<span class="tag tag-${REPORTS[k].color}">${esc(id)}</span>`).join("")).join("")
      : `<span class="none">Not in the NDJSON files</span>`;
    $("#finder-answer").innerHTML = `
      <h3>${esc(q.q)}</h3>
      <p class="k">Use</p><div class="tags">${tags}</div>
      <p class="k">Fields</p><p class="fields">${esc(q.fields)}</p>
      <p class="k">Keep in mind</p><p style="margin:0">${esc(q.note)}</p>`;
  }

  /* ---------- Record explorer ---------- */
  const state = { rec: "u1", user: 0, view: "pretty", sel: null, group: null };
  const fieldIndex = new Map();

  function lookup(path) {
    const clean = path.replace(/\[\]/g, "");
    const last = path.split(".").pop().replace(/\[\]/g, "");
    let f = FIELDS[path] || FIELDS[clean] || FIELDS["*." + last];
    let inherited = false;
    if (!f && path.includes(".") && FIELDS[last]) { f = FIELDS[last]; inherited = true; }
    if (!f) {
      const parts = clean.split(".");
      while (parts.length > 1 && !f) { parts.pop(); f = FIELDS[parts.join(".")]; }
      if (f) return { g: f.g, t: null, src: f.src, text: `Part of ${parts.join(".")}. See the parent field for its meaning.`, generic: true };
      return { g: "breakdown", t: null, src: DOC.data, text: "See the field reference in GitHub Docs." };
    }
    return inherited ? Object.assign({}, f, { text: f.text + " Here it is scoped to this breakdown entry.", inherited: true }) : f;
  }

  function renderJSON(v, path, depth, line) {
    const ind = line ? "" : "  ".repeat(depth);
    const ind1 = line ? "" : "  ".repeat(depth + 1);
    const nl = line ? "" : "\n";
    const sep = line ? ":" : ": ";
    if (v === null) return `<span class="z">null</span>`;
    if (typeof v === "string") return `<span class="s">"${esc(v)}"</span>`;
    if (typeof v === "number") return `<span class="n">${Number.isInteger(v) ? v : v.toFixed(v % 1 === 0 ? 1 : 2).replace(/0$/, "")}</span>`;
    if (typeof v === "boolean") return `<span class="b">${v}</span>`;
    if (Array.isArray(v)) {
      if (!v.length) return `<span class="p">[]</span>`;
      if (v.every((x) => typeof x !== "object" || x === null)) return `<span class="p">[</span>${v.map((x) => renderJSON(x, path + "[]", depth + 1, line)).join(`<span class="p">,</span>${line ? "" : " "}`)}<span class="p">]</span>`;
      return `<span class="p">[</span>${nl}${v.map((x) => ind1 + renderJSON(x, path + "[]", depth + 1, line)).join(`<span class="p">,</span>${nl}`)}${nl}${ind}<span class="p">]</span>`;
    }
    const keys = Object.keys(v);
    return `<span class="p">{</span>${nl}${keys.map((k) => {
      const p = path ? path + "." + k : k;
      const id = "f" + fieldIndex.size;
      fieldIndex.set(id, { path: p, value: v[k] });
      const g = lookup(p).g;
      return `${ind1}<button type="button" class="k" data-id="${id}" data-g="${g}">"${esc(k)}"</button><span class="p">${sep}</span>${renderJSON(v[k], p, depth + 1, line)}`;
    }).join(`<span class="p">,</span>${nl}`)}${nl}${ind}<span class="p">}</span>`;
  }

  function currentData() {
    return state.rec === "u1" ? USERS[state.user].data : RECORDS[state.rec].data;
  }

  function buildExplorer() {
    const tabs = $("#rec-tabs");
    tabs.innerHTML = Object.keys(RECORDS).map((k) => `<button type="button" role="tab" class="tag tag-${RECORDS[k].family}" data-rec="${k}" aria-selected="false">${esc(RECORDS[k].label)}</button>`).join("");
    tabs.addEventListener("click", (e) => { const b = e.target.closest("[data-rec]"); if (b) { if (b.dataset.rec === "u1") state.user = 0; showRecord(b.dataset.rec); } });
    tabs.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const btns = $$("[data-rec]", tabs); const cur = btns.indexOf(document.activeElement);
      const n = btns[(cur + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
      n.focus(); showRecord(n.dataset.rec);
    });
    $$(".view-toggle [data-view]").forEach((b) => b.addEventListener("click", () => {
      state.view = b.dataset.view;
      $$(".view-toggle [data-view]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      showRecord(state.rec, state.sel && fieldIndex.get(state.sel) ? fieldIndex.get(state.sel).path : null);
    }));
    const pre = $("#rec-json");
    pre.addEventListener("click", (e) => { const k = e.target.closest(".k"); if (k) selectField(k.dataset.id); });
    pre.addEventListener("scroll", scheduleLeader, { passive: true });
    window.addEventListener("scroll", scheduleLeader, { passive: true });
    window.addEventListener("resize", scheduleLeader);
    showRecord("u1");
  }

  function showRecord(k, keepPath) {
    state.rec = k;
    const r = RECORDS[k];
    const fam = r.family;
    $("#explorer").style.setProperty("--hue", HUES[fam]);
    $("#explorer").style.setProperty("--accent", `var(--${fam})`);
    $$("#rec-tabs [data-rec]").forEach((b) => { const on = b.dataset.rec === k; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    fieldIndex.clear();
    const data = currentData();
    const pre = $("#rec-json");
    pre.classList.toggle("line", state.view === "line");
    pre.innerHTML = renderJSON(data, "", 0, state.view === "line");
    let note = r.note;
    if (k === "u1") note = `Showing ${USERS[state.user].data.user_login}. ` + note;
    if (state.view === "line") note += " This is how the record looks in the file: one line, no line breaks.";
    $("#rec-note").textContent = note;

    // Groups present in this record
    const counts = {};
    fieldIndex.forEach((f) => { const g = lookup(f.path).g; counts[g] = (counts[g] || 0) + 1; });
    if (state.group && !counts[state.group]) state.group = null;
    $("#rec-groups").innerHTML = Object.keys(GROUPS).filter((g) => counts[g]).map((g) => `<button type="button" class="chip" data-group="${g}" aria-pressed="${state.group === g}">${esc(GROUPS[g])}<span class="n">${counts[g]}</span></button>`).join("");
    $$("#rec-groups .chip").forEach((c) => c.addEventListener("click", () => { state.group = state.group === c.dataset.group ? null : c.dataset.group; paintGroups(); }));
    paintGroups();

    const want = keepPath || r.start;
    let id = null;
    fieldIndex.forEach((f, i) => { if (!id && f.path === want) id = i; });
    selectField(id || fieldIndex.keys().next().value, true);
  }

  function paintGroups() {
    $$("#rec-groups .chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.group === state.group)));
    $$("#rec-json .k").forEach((k) => k.classList.toggle("hl", !!state.group && k.dataset.g === state.group));
  }

  const SECTION = {
    "report-identification-fields": "Report identification fields",
    "per-user-report-fields": "Per-user report fields",
    "aggregated-enterprise-and-organization-report-fields": "Aggregated report fields",
    "28-day-report-fields": "28-day report fields",
    "copilot-feature-engagement-fields": "Copilot feature engagement fields",
    "user-teams-fields": "User-teams fields",
    "repository-level-fields-api-only": "Repository-level fields",
    "activity-breakdown-objects": "Activity breakdown objects",
    "breakdown-dimension-values": "Breakdown dimension values",
    "copilot-cli-metrics-fields": "Copilot CLI metrics fields",
    "client-metrics-fields": "Client metrics fields",
    "customization-fields-api-only": "Customization fields",
    "byok-metrics-fields": "BYOK metrics fields",
    "vs-code-agents-window-metrics-fields": "VS Code Agents-window fields",
    "pull-request-activity-fields": "Pull request activity fields",
    "pull-request-review-time-fields": "Pull request review time fields",
    "copilot-code-review-outcome-fields": "Copilot code review outcome fields",
    "ai-adoption-phase-fields": "AI adoption phase fields",
  };
  const WARN_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.2 2.6 16.2h14.8z"/><path d="M10 8.2v3.6M10 14.1v.1"/></svg>';
  function selectField(id, quiet) {
    const f = fieldIndex.get(id);
    if (!f) return;
    state.sel = id;
    $$("#rec-json .k.sel").forEach((k) => k.classList.remove("sel"));
    const btn = $(`#rec-json .k[data-id="${id}"]`);
    btn.classList.add("sel");
    const d = lookup(f.path);
    const v = f.value;
    const type = v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "number" ? (d.t || (Number.isInteger(v) ? "integer" : "number")) : typeof v;
    let preview = "";
    if (v === null || typeof v !== "object") preview = `<div class="val">Value here: ${esc(JSON.stringify(v))}</div>`;
    else if (Array.isArray(v)) preview = `<div class="val">${v.length ? v.length + (v.length === 1 ? " entry" : " entries") : "Empty array: no matching activity in this record"}</div>`;
    const srcText = SECTION[(d.src || DOC.data).split("#")[1]] || "Data available in Copilot usage metrics";
    $("#field-card").innerHTML = `
      <p class="path">${esc(f.path)}</p>
      <div class="meta"><span class="pill mono">${esc(type)}</span>${d.n ? '<span class="pill">can be null</span>' : ""}<span class="pill">${esc(GROUPS[d.g] || "")}</span></div>
      ${preview}
      <p class="what">${esc(d.text)}</p>
      ${d.warn ? `<div class="warn">${WARN_ICON}<span>${esc(d.warn)}</span></div>` : ""}
      <p class="src">GitHub Docs: <a href="${d.src || DOC.data}">${esc(srcText)}</a></p>`;
    ensureVisible(btn);
    scheduleLeader();
  }

  function ensureVisible(btn) {
    const pre = $("#rec-json");
    const pr = pre.getBoundingClientRect(), br = btn.getBoundingClientRect();
    if (br.top < pr.top + 8 || br.bottom > pr.bottom - 8) pre.scrollTop += br.top - pr.top - pr.height / 3;
  }

  let leaderRaf = 0;
  function scheduleLeader() { if (!leaderRaf) leaderRaf = requestAnimationFrame(() => { leaderRaf = 0; drawLeader(); }); }
  function drawLeader() {
    const svg = $("#leader");
    const btn = $("#rec-json .k.sel");
    const card = $("#field-card .path");
    if (!btn || !card || getComputedStyle(svg).display === "none") { svg.classList.remove("on"); return; }
    const body = $(".explorer-body").getBoundingClientRect();
    const pre = $("#rec-json").getBoundingClientRect();
    const b = btn.getBoundingClientRect(), c = card.getBoundingClientRect();
    const y1 = b.top + b.height / 2 - body.top;
    if (b.top < pre.top || b.bottom > pre.bottom) { svg.classList.remove("on"); return; }
    const x0 = Math.min(b.right + 6, pre.right) - body.left;
    const x1 = pre.right - body.left + 2;
    const x2 = c.left - body.left - 10;
    const y2 = c.top + c.height / 2 - body.top;
    const xm = x1 + (x2 - x1) * 0.45;
    $("path", svg).setAttribute("d", `M ${x0} ${y1} H ${xm} L ${x2} ${y2}`);
    const dot = $("circle", svg); dot.setAttribute("cx", x2 + 2); dot.setAttribute("cy", y2);
    svg.classList.add("on");
  }

  function openRecord(k, field) {
    showRecord(k, field);
    $("#explorer").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------- Endpoints ---------- */
  const EP = [
    ["agg1", "organization-1-day?day=YYYY-MM-DD", "enterprise-1-day?day=YYYY-MM-DD"],
    ["agg28", "organization-28-day/latest", "enterprise-28-day/latest"],
    ["u1", "users-1-day?day=YYYY-MM-DD", "users-1-day?day=YYYY-MM-DD"],
    ["u28", "users-28-day/latest", "users-28-day/latest"],
    ["teams", "user-teams-1-day?day=YYYY-MM-DD", "user-teams-1-day?day=YYYY-MM-DD"],
    ["repos", "repos-1-day?day=YYYY-MM-DD", "repos-1-day?day=YYYY-MM-DD"],
  ];
  function buildEndpoints() {
    const draw = (scope) => {
      const pre = scope === "org" ? "/orgs/<i>{org}</i>" : "/enterprises/<i>{enterprise}</i>";
      $("#ep-table tbody").innerHTML = EP.map(([k, o, e]) => `<tr><td><span class="tag tag-${REPORTS[k].color}">${esc(REPORTS[k].name)}</span></td><td class="ep">${pre}/copilot/metrics/reports/${esc(scope === "org" ? o : e)}</td></tr>`).join("");
    };
    $$("[data-scope]").forEach((b) => b.addEventListener("click", () => {
      $$("[data-scope]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      draw(b.dataset.scope);
    }));
    draw("org");
  }

  /* ---------- Team join trace ---------- */
  const T = TRACE;
  const teamOf = (uid) => T.teams.filter((t) => t.user_id === uid);
  const joined = T.teams.map((t) => Object.assign({}, t, T.users.find((u) => u.user_id === t.user_id)));
  const grouped = Object.values(joined.reduce((acc, r) => {
    const g = acc[r.team_id] || (acc[r.team_id] = { team_id: r.team_id, slug: r.slug, users: new Set(), acc: 0, loc: 0 });
    g.users.add(r.user_id); g.acc += r.code_acceptance_activity_count; g.loc += r.loc_added_sum; return acc;
  }, {}));
  const orgLoc = T.users.reduce((s, u) => s + u.loc_added_sum, 0);
  const teamLoc = grouped.reduce((s, g) => s + g.loc, 0);

  function tbl(title, tagCls, cols, rows, rowCls, extra) {
    return `<div class="tbl"><div class="tbl-h"><span class="tag ${tagCls}">${esc(title)}</span></div><div class="tbl-scroll"><table><thead><tr>${cols.map((c) => `<th class="${c.num ? "num" : ""}" scope="col">${esc(c.h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r, i) => `<tr class="${rowCls ? rowCls(r, i) : ""}">${cols.map((c) => `<td class="${c.num ? "num" : ""}">${esc(c.v(r))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${extra || ""}</div>`;
  }
  const C = {
    uid: { h: "user_id", v: (r) => r.user_id },
    login: { h: "user_login", v: (r) => r.user_login },
    team: { h: "team_id", v: (r) => r.team_id, num: true },
    slug: { h: "slug", v: (r) => r.slug },
    acc: { h: "acceptances", v: (r) => r.code_acceptance_activity_count, num: true },
    loc: { h: "loc_added_sum", v: (r) => r.loc_added_sum, num: true },
  };
  const STEPS = [
    {
      name: "Two daily files",
      say: "Start with two files for the same day and the same organization. user-teams-1-day has one row per user and team. users-1-day has one row per user.",
      html: () => tbl("user-teams-1-day", "tag-teams", [C.uid, C.login, C.team, C.slug], T.teams) + tbl("users-1-day", "tag-u1", [C.uid, C.login, C.acc, C.loc], T.users),
    },
    {
      name: "Match rows",
      say: "Keep only rows that match in both files on user_id, day, and organization_id (an inner join). dev-01 is on two teams, so dev-01's activity now appears twice. dev-04 has no team row, so dev-04 drops out.",
      html: () => tbl("users-1-day", "tag-u1", [C.uid, C.login, C.acc, C.loc], T.users, (r) => (teamOf(r.user_id).length ? "" : "drop"),
        `<p class="why">dev-04 has no row in user-teams. One possible reason: their team has fewer than 5 seated Copilot users.</p>`) +
        tbl("joined rows", "tag-teams", [C.login, C.team, C.slug, C.acc, C.loc], joined, (r) => "new" + (r.user_id === 5001 ? " dup" : "")),
    },
    {
      name: "Group by team",
      say: "Group the joined rows by team_id and slug. Count people with COUNT(DISTINCT user_id). Add the activity counters with SUM.",
      html: () => tbl("joined rows", "tag-teams", [C.login, C.team, C.slug, C.acc, C.loc], joined, (r) => (r.user_id === 5001 ? "dup" : "")) +
        tbl("team result", "tag-teams", [C.team, C.slug, { h: "active users", v: (r) => r.users.size, num: true }, { h: "acceptances", v: (r) => r.acc, num: true }, { h: "loc_added_sum", v: (r) => r.loc, num: true }], grouped, () => "new"),
    },
    {
      name: "Check the totals",
      say: "The team rows do not add up to the organization total. That is expected. Use team rows for team views, and the per-user report alone for organization totals.",
      html: () => tbl("team result", "tag-teams", [C.team, C.slug, { h: "active users", v: (r) => r.users.size, num: true }, { h: "loc_added_sum", v: (r) => r.loc, num: true }], grouped) +
        `<div class="tbl"><div class="tbl-h">Why the sums differ</div><div class="sum">
          <span>Sum of team rows</span><b>${teamLoc}</b>
          <span>Organization total from users-1-day</span><b>${orgLoc}</b>
          <span>dev-01 counted in two teams</span><b class="bad">+${T.users[0].loc_added_sum}</b>
          <span>dev-04 in no team row</span><b class="bad">−${T.users[3].loc_added_sum}</b>
        </div><p class="why">${orgLoc} + ${T.users[0].loc_added_sum} − ${T.users[3].loc_added_sum} = ${teamLoc}. Synthetic numbers.</p></div>`,
    },
  ];
  let step = 0;
  function buildTrace() {
    $("#trace-steps").innerHTML = STEPS.map((s, i) => `<button type="button" role="tab" class="tstep" data-s="${i}" aria-selected="false">${esc(s.name)}</button>`).join("");
    $("#trace-steps").addEventListener("click", (e) => { const b = e.target.closest("[data-s]"); if (b) goStep(+b.dataset.s); });
    $("#trace-prev").addEventListener("click", () => goStep(step - 1));
    $("#trace-next").addEventListener("click", () => goStep(step + 1));
    goStep(0);
  }
  function goStep(i) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    $$(".tstep").forEach((b, j) => { b.setAttribute("aria-selected", String(j === step)); b.classList.toggle("past", j < step); });
    $("#trace-say").textContent = STEPS[step].say;
    $("#trace-grid").innerHTML = STEPS[step].html();
    $("#trace-prev").disabled = step === 0;
    $("#trace-next").disabled = step === STEPS.length - 1;
  }

  /* ---------- Sources ---------- */
  function buildSources() {
    $("#sources-list").innerHTML = SOURCES.map((s) => `<li><a href="${s.url}"><span class="t">${esc(s.title)}</span><span class="u">${esc(s.use)}</span></a></li>`).join("");
  }

  /* ---------- Copy ---------- */
  function buildCopy() {
    $$(".copy").forEach((b) => b.addEventListener("click", async () => {
      const text = document.getElementById(b.dataset.copy).textContent;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
        const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); try { ok = document.execCommand("copy"); } catch (e2) { ok = false; } ta.remove();
      }
      $(".copy-label", b).textContent = ok ? "Copied" : "Copy failed";
      b.classList.toggle("done", ok);
      clearTimeout(b._t);
      b._t = setTimeout(() => { b.classList.remove("done"); $(".copy-label", b).textContent = "Copy"; }, 1600);
    }));
  }

  /* ---------- Scrollspy ---------- */
  function buildSpy() {
    const links = $$(".rail-list a");
    const targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
    const set = (id) => links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + id)));
    const onScroll = () => {
      const y = window.innerHeight * 0.35;
      let cur = targets[0].id;
      for (const t of targets) if (t.getBoundingClientRect().top <= y) cur = t.id;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = targets[targets.length - 1].id;
      set(cur);
    };
    window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
    links.forEach((a) => a.addEventListener("click", () => set(a.getAttribute("href").slice(1))));
    onScroll();
  }

  heroLines();
  buildMap();
  selectReport("u1");
  buildFinder();
  buildExplorer();
  buildEndpoints();
  buildTrace();
  buildSources();
  buildCopy();
  buildSpy();
})();
