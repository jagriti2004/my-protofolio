/* ==========================================================
   Jagriti Prakash Portfolio — main.js
   Edit the PROFILE, SKILLS and PROJECTS objects below to update the site.
   ========================================================== */

/* ---------- 1. Your content (edit this part) ---------- */

const PROFILE = {
  roles: ["web developer", "Laravel learner", "database enthusiast", "future AI/ML engineer", "cloud computing learner"],
  // Fill in the links you want to show. Leave a value empty ("") to hide it.
  contact: {
    email: "",     // example: "name@example.com"
    linkedin: "",  // example: "https://www.linkedin.com/in/your-id"
    github: "",    // example: "https://github.com/your-username"
    resume: ""     // example: "assets/Jagriti-Prakash-Resume.pdf"
  }
};

const SKILLS = [
  { name: "HTML", group: "frontend", short: "HT", desc: "Semantic page structure and content." },
  { name: "CSS", group: "frontend", short: "CS", desc: "Layouts and styling that adapt to phones and desktops." },
  { name: "Laravel", group: "backend", short: "LV", desc: "Routes, forms and application logic in PHP." },
  { name: "DBMS", group: "backend", short: "DB", desc: "Designing tables, relationships and queries." },
  { name: "AI and Machine Learning", group: "emerging", short: "AI", desc: "Models that learn from data." },
  { name: "Cloud Computing", group: "emerging", short: "CL", desc: "Deploying and running applications online." }
];

const SKILL_GROUPS = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend and data" },
  { id: "emerging", label: "Emerging tech" }
];

// Add your projects here. Example:
// { title: "Library Management System", desc: "Short description.", tech: ["Laravel", "MySQL"], demo: "https://...", code: "https://github.com/..." }
const PROJECTS = [];

/* ---------- 2. Small helpers ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  });
  [].concat(children).forEach(child => child && node.appendChild(child));
  return node;
}

function showToast(message) {
  let toast = $(".toast");
  if (!toast) {
    toast = el("div", { class: "toast", role: "status", "aria-live": "polite" });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- 3. Theme toggle (light and dark) ---------- */

function initTheme() {
  const root = document.documentElement;
  const button = $("#themeToggle");
  const meta = $('meta[name="theme-color"]');
  let saved = null;
  try { saved = localStorage.getItem("jp-theme"); } catch (e) { /* storage may be blocked */ }

  function apply(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#1B1612" : "#F5EEE2");
  }

  apply(saved === "dark" ? "dark" : "light");

  button.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("jp-theme", next); } catch (e) { /* ignore */ }
  });
}

/* ---------- 4. Navigation: mobile menu, active link, scroll progress ---------- */

function initMenu() {
  const button = $("#menuToggle");
  const links = $("#links");

  function setOpen(open) {
    links.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  button.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.addEventListener("click", event => { if (event.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setOpen(false); });
  document.addEventListener("click", event => {
    if (!event.target.closest(".nav")) setOpen(false);
  });
}

function initActiveLinks() {
  const links = $$("#links a");
  const map = {};
  links.forEach(a => { map[a.getAttribute("href").slice(1)] = a; });
  const ids = Object.keys(map);
  const visible = {};

  function setActive(id) {
    links.forEach(a => a.removeAttribute("aria-current"));
    if (map[id]) map[id].setAttribute("aria-current", "true");
  }

  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0; });
    let best = null, bestRatio = 0;
    ids.forEach(id => { if ((visible[id] || 0) > bestRatio) { best = id; bestRatio = visible[id]; } });
    setActive(best);
  }, { rootMargin: "-20% 0px -45% 0px", threshold: [0, .1, .25, .5, .75, 1] });

  ids.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
}

function initScrollEffects() {
  const progress = $("#progress");
  const toTop = $("#toTop");
  let ticking = false;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    toTop.classList.toggle("show", window.scrollY > 600);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

/* ---------- 5. Typing effect for the role line ---------- */

function initTyping() {
  const target = $("#typed");
  const roles = PROFILE.roles;
  if (!target || !roles.length) return;
  if (prefersReducedMotion()) { target.textContent = roles[0]; return; }

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = word.slice(0, charIndex);

    let delay = deleting ? 45 : 85;
    if (!deleting && charIndex === word.length) { deleting = true; delay = 1600; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  target.textContent = "";
  setTimeout(tick, 400);
}

/* ---------- 6. Reveal on scroll and animated counters ---------- */

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    items.forEach(item => item.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); obs.unobserve(entry.target); }
    });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  items.forEach(item => observer.observe(item));
}

function animateCount(node, to, duration = 1100) {
  if (prefersReducedMotion()) { node.textContent = to; return; }
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = Math.round(to * eased);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initCounters() {
  const counters = $$("[data-count]");
  if (!("IntersectionObserver" in window)) {
    counters.forEach(c => { c.textContent = c.dataset.count; });
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, Number(entry.target.dataset.count));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .6 });
  counters.forEach(c => observer.observe(c));
}

/* ---------- 7. Skills: render and filter ---------- */

function renderSkills(group) {
  const grid = $("#skillGrid");
  const list = group === "all" ? SKILLS : SKILLS.filter(skill => skill.group === group);
  const labels = Object.fromEntries(SKILL_GROUPS.map(g => [g.id, g.label]));
  grid.replaceChildren();

  list.forEach((skill, index) => {
    const card = el("article", { class: "glass lift skill tilt enter" }, [
      el("div", { class: "badge-ico", text: skill.short, "aria-hidden": "true" }),
      el("h3", { text: skill.name }),
      el("span", { class: "group", text: labels[skill.group] }),
      el("p", { text: skill.desc })
    ]);
    card.style.animationDelay = `${index * 60}ms`;
    grid.appendChild(card);
  });
  bindTilt($$(".tilt", grid));
}

function initSkills() {
  const bar = $("#skillFilters");
  SKILL_GROUPS.forEach((group, index) => {
    const chip = el("button", { class: "chip", type: "button", "data-group": group.id, "aria-pressed": String(index === 0), text: group.label });
    bar.appendChild(chip);
  });
  bar.addEventListener("click", event => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    $$(".chip", bar).forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    renderSkills(chip.dataset.group);
  });
  renderSkills("all");
}

/* ---------- 8. Projects: render from the PROJECTS array ---------- */

function initProjects() {
  const grid = $("#projectGrid");
  grid.replaceChildren();

  if (!PROJECTS.length) {
    grid.appendChild(el("div", { class: "glass project empty" }, [
      el("h3", { text: "Projects coming soon" }),
      el("p", { text: "I am working on projects with Laravel, MySQL and AI/ML. They will appear here as soon as they are ready." })
    ]));
    return;
  }

  PROJECTS.forEach(project => {
    const tags = el("div", { class: "tags" }, (project.tech || []).map(t => el("span", { class: "tag", text: t })));
    const links = el("div", { class: "links-row" });
    if (project.demo) links.appendChild(el("a", { class: "btn primary", href: project.demo, target: "_blank", rel: "noopener", text: "Live demo" }));
    if (project.code) links.appendChild(el("a", { class: "btn ghost", href: project.code, target: "_blank", rel: "noopener", text: "Source code" }));
    grid.appendChild(el("article", { class: "glass lift project tilt" }, [
      el("h3", { text: project.title }),
      el("p", { text: project.desc }),
      tags,
      links
    ]));
  });
  bindTilt($$(".tilt", grid));
}

/* ---------- 9. Contact links ---------- */

function initContact() {
  const box = $("#contactLinks");
  const { email, linkedin, github, resume } = PROFILE.contact;
  box.replaceChildren();

  if (email) {
    const copy = el("button", { class: "btn primary", type: "button", text: "Copy email" });
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(email); showToast("Email copied"); }
      catch (e) { showToast(email); }
    });
    box.appendChild(copy);
    box.appendChild(el("a", { class: "btn ghost", href: `mailto:${email}`, text: "Send an email" }));
  }
  if (linkedin) box.appendChild(el("a", { class: "btn ghost", href: linkedin, target: "_blank", rel: "noopener", text: "LinkedIn" }));
  if (github) box.appendChild(el("a", { class: "btn ghost", href: github, target: "_blank", rel: "noopener", text: "GitHub" }));
  if (resume) box.appendChild(el("a", { class: "btn ghost", href: resume, target: "_blank", rel: "noopener", text: "View resume" }));

  if (!box.children.length) {
    box.appendChild(el("p", { class: "contact-note", text: "Contact details will be added soon." }));
  }
}

/* ---------- 10. Pointer effects: card tilt, magnetic buttons, orb parallax ---------- */

function bindTilt(cards) {
  if (!canHover() || prefersReducedMotion()) return;
  cards.forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "1";
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

function initMagnetic() {
  if (!canHover() || prefersReducedMotion()) return;
  $$("[data-magnetic]").forEach(btn => {
    btn.addEventListener("pointermove", event => {
      const rect = btn.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .18;
      const y = (event.clientY - rect.top - rect.height / 2) * .28;
      btn.style.transform = `translate(${x.toFixed(1)}px, ${(y - 2).toFixed(1)}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

function initParallax() {
  if (!canHover() || prefersReducedMotion()) return;
  const orbs = $$(".orb");
  let raf = null;
  window.addEventListener("pointermove", event => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const x = event.clientX / window.innerWidth - .5;
      const y = event.clientY / window.innerHeight - .5;
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 14;
        orb.style.transform = `translate(${(x * depth).toFixed(1)}px, ${(y * depth).toFixed(1)}px)`;
      });
      raf = null;
    });
  }, { passive: true });
}

/* ---------- 11. Start everything ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  initTheme();
  initMenu();
  initActiveLinks();
  initScrollEffects();
  initTyping();
  initReveal();
  initCounters();
  initSkills();
  initProjects();
  initContact();
  bindTilt($$(".tilt"));
  initMagnetic();
  initParallax();
});
