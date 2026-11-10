// Motion helpers. CSS does the animating; this only says when.
// - [data-live]: gets .is-live the first time it scrolls into view, which starts its paused animations.
// - [data-draw]: icons inside draw their strokes (every shape normalised to pathLength 1).
// - [data-count]: a Persian-digit integer that counts up from zero when its [data-live] parent shows.
// - [data-parallax]: gets --px/--py (-1…1) from the pointer, for the hero tiles.
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const shape of document.querySelectorAll("[data-draw] svg > *")) shape.setAttribute("pathLength", "1");

const digits = "۰۱۲۳۴۵۶۷۸۹";
const fa = (n) => String(n).replace(/\d/g, (d) => digits[d]);
const counters = calm ? [] : [...document.querySelectorAll("[data-count]")];
for (const el of counters) {
  el.dataset.count = [...el.textContent.trim()].map((c) => digits.indexOf(c)).join("");
  if (/^\d+$/.test(el.dataset.count)) el.textContent = fa(0);
}

function countUp(el) {
  const target = Number(el.dataset.count);
  if (!Number.isInteger(target)) return;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 1000);
    el.textContent = fa(Math.round(target * (1 - (1 - t) ** 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Fire a little before the element is fully in; tall lists still trigger (threshold 0).
const io = new IntersectionObserver(
  (entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      target.classList.add("is-live");
      target.querySelectorAll("[data-count]").forEach((el) => counters.includes(el) && countUp(el));
      io.unobserve(target);
    }
  },
  { rootMargin: "0px 0px -15% 0px" },
);
document.querySelectorAll("[data-live]").forEach((el) => io.observe(el));

const stage = document.querySelector("[data-parallax]");
if (stage && !calm && matchMedia("(pointer: fine)").matches) {
  addEventListener(
    "pointermove",
    (e) => {
      stage.style.setProperty("--px", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
      stage.style.setProperty("--py", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
    },
    { passive: true },
  );
}
