/* ===== Typing ===== */
const roles = ["Developer", "Modder", "Content Creator"];
let i = 0, ch = 0, del = false;
(function loop() {
  const w = roles[i % roles.length], el = document.getElementById("roleTyping");
  el.textContent = del ? w.slice(0, --ch) : w.slice(0, ++ch);
  if (!del && ch === w.length) setTimeout(() => del = true, 900);
  if (del && ch === 0) { del = false; i++; }
  setTimeout(loop, del ? 40 : 70);
})();

/* ===== Ripple ===== */
function rip(e) {
  const a = e.currentTarget, s = document.createElement("span");
  s.className = "ripple"; s.style.left = e.offsetX + "px"; s.style.top = e.offsetY + "px";
  a.appendChild(s); setTimeout(() => s.remove(), 600);
}
document.querySelectorAll(".app,.action").forEach(x => x.addEventListener("click", rip));

/* ===== Theme toggle ===== */
const $html = document.documentElement, $themeIcon = document.getElementById('themeIcon');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) $html.setAttribute('data-theme', savedTheme);
$themeIcon.textContent = $html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
document.getElementById('themeToggle').onclick = () => {
  const cur = $html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  $html.setAttribute('data-theme', cur);
  localStorage.setItem('theme', cur);
  $themeIcon.textContent = cur === 'dark' ? '☀️' : '🌙';
};

/* ===== Tabs (hash router, phím 1..4) ===== */
function showTab(name) {
  document.querySelectorAll('.nav-link').forEach(l => { l.classList.toggle('active', l.dataset.tab === name) });
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  const el = document.getElementById('tab-' + name);
  if (el) el.style.display = '';
  if (name === 'home') document.getElementById('homeSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  location.hash = name;
}
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', e => { e.preventDefault(); showTab(l.dataset.tab); });
});
window.addEventListener('hashchange', () => {
  const n = location.hash.replace('#','') || 'home'; showTab(n);
});
showTab((location.hash || '#home').replace('#',''));
// phím tắt 1..4
window.addEventListener('keydown', (e) => {
  if (['1','2','3','4'].includes(e.key)) {
    const t = {1:'home',2:'about',3:'contact',4:'bank'}[e.key]; showTab(t);
  }
});

/* ===== Timestamps ===== */
function setStamp(el) {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  el.textContent = `${hh}:${mm}:${ss} ${dd}/${mo}/${yy}`;
}
setStamp(document.getElementById("time1"));
setStamp(document.getElementById("time2"));

/* ===== Visit counter chip (API) ===== */
const visitChip = document.getElementById('visitChip');
visitChip.classList.add('skeleton');
(async () => {
  try {
    const r = await fetch("https://api-dem-luot-truy-cap.onrender.com/api/visit");
    const d = await r.json();
    visitChip.textContent = new Intl.NumberFormat().format(d.value) + " lượt truy cập";
  } catch {
    visitChip.textContent = "Không tải được lượt truy cập";
  } finally {
    visitChip.classList.remove('skeleton');
  }
})();

/* ===== Download counters (local) ===== */
function getCount(id){ return parseInt(localStorage.getItem('dl_'+id) || '0', 10) }
function setCount(id,v){ localStorage.setItem('dl_'+id, String(v)) }
function renderCount(id){
  const el = document.getElementById('dl-'+id);
  if (el) el.textContent = getCount(id).toLocaleString('vi-VN') + " lượt";
}
document.querySelectorAll('.action-download').forEach(btn => {
  const id = btn.dataset.id;
  btn.addEventListener('click', () => { setCount(id, getCount(id)+1); renderCount(id); });
  renderCount(id);
});

/* ===== Skills reveal ===== */
(function(){
  const bars = document.querySelectorAll('#skills .bar i');
  bars.forEach(b => b.style.width = '0%');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        bars.forEach((b,i) => {
          const pct = parseInt(b.getAttribute('data-pct') || '0', 10);
          b.style.transitionDelay = (i*120) + 'ms';
          requestAnimationFrame(() => b.style.width = pct + '%');
        });
      } else {
        bars.forEach(b => { b.style.transitionDelay = '0ms'; b.style.width = '0%'; });
      }
    });
  }, { threshold: .35 });
  const sec = document.getElementById('skills');
  if (sec) io2.observe(sec);
})();

/* ===== Reveal on view ===== */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('reveal'); io.unobserve(en.target); }
}), { threshold: .12 });
document.querySelectorAll(".card,.list-card").forEach(c => io.observe(c));

/* ===== Helpers: Toast, Copy, Buttons ===== */
const toast = (() => {
  const el = document.createElement('div');
  el.className = 'toast'; document.body.appendChild(el);
  return msg => { el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1600); };
})();
function copyText(t){ return navigator.clipboard.writeText(t).then(() => toast('Đã copy vào clipboard')) }
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => {
  const v = b.getAttribute('data-copy');
  if (v.startsWith('#')) { const el = document.querySelector(v); if (el) copyText(el.textContent.trim()); }
  else copyText(v);
}));
document.getElementById('btnGotIt').onclick = () => document.getElementById('warningCard').style.display = 'none';

// Contact form
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const name = (f.get('name') || '').toString();
    const email = (f.get('email') || '').toString();
    const msg = (f.get('message') || '').toString();
    const subject = encodeURIComponent(`[Liên hệ] ${name}`);
    const body = encodeURIComponent(`Tên: ${name}\nEmail: ${email}\n\nNội dung:\n${msg}`);
    window.location.href = `mailto:quocchien2709@gmail.com?subject=${subject}&body=${body}`;
    toast('Mở ứng dụng Email...');
  });
  const zalo = document.getElementById('openZalo');
  zalo && zalo.addEventListener('click', () => window.open('https://zalo.me/84385531007', '_blank'));
}

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => { toTop.classList.toggle('show', window.scrollY > 400); });
toTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
